var { env, logger } = require("./env");

const { CloudTasksClient } = require("@google-cloud/tasks").v2;

async function enqueueTask(reminderId, scheduledTime) {
  const projectId = env.PROJECTID;
  const location = env.LOCATION;
  const queueName = env.REMINDER_QUEUE;
  // Create a Cloud Tasks client
  const client = new CloudTasksClient();

  logger.debug(`Defining Task Payload`);
  // Define the task payload
  const parent = `projects/${projectId}/locations/${location}/queues/${queueName}`;
  const task = {
    parent: parent,
    task: {
      httpRequest: {
        httpMethod: "POST",
        url: "https://process-reminder-w3dy3wmx2q-uc.a.run.app/reminder-feature", // URL for handling the task
        body: Buffer.from(
          JSON.stringify({
            reminderId, // Task payload
          })
        ).toString("base64"),
        headers: {
          "Content-Type": "application/json",
        },
      },
      scheduleTime: {
        // Convert ISO string to seconds and nanoseconds
        seconds: Math.floor(new Date(scheduledTime).getTime() / 1000),
        nanos: (new Date(scheduledTime).getTime() % 1000) * 1e6,
      },
      payloadType: "json", // Specify the payload type here
    },
  };

  // Enqueue the task
  try {
    const [createdTasks] = await client.createTask(task);
    logger.debug(`Task created:`, createdTasks);
  } catch (error) {
    logger.error("Error creating task:", error, error.stack);
  }
  return;
}

module.exports = {
  enqueueTask,
};
