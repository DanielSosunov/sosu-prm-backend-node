const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");
var { logger } = require("./env");

async function accessSecret(secretName) {
  const client = new SecretManagerServiceClient();
  try {
    const [response] = await client.accessSecretVersion({
      name: secretName,
    });

    // Secret payload is in response.payload.data
    const payload = response.payload.data.toString("utf8");
    logger.info("Secret retrieved:", payload);
    return payload;
  } catch (err) {
    logger.error("Error accessing secret:", err);
    return null;
  }
}

module.exports = {
  accessSecret,
};
