var { env } = require("./env");

var uuid = require("uuid");
var { getUserByUsername, setUserById } = require("./gcp/database-functions");
var { accessSecret } = require("./gcp/secretmanager");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

async function login(username, requestPassword) {
  var user = await getUserByUsername(username);

  //Check if the user does not exist
  if (user === null) throw "USER_DOES_NOT_EXIST";

  //Check if password is valid
  const isPasswordValid = await bcrypt.compare(
    requestPassword,
    user.hashedPassword
  );

  if (!isPasswordValid) throw "INVALID_AUTH";

  //Access Secrets
  var jwtSecret = await accessSecret(env.JWT_SECRET);

  const token = jwt.sign({ userId: user.id }, jwtSecret, {
    expiresIn: "1w",
  });

  //Return the token
  return token;
}

async function signup(username, requestPassword) {
  var user = await getUserByUsername(username);

  //Check if the user exists
  if (user !== null) throw "USER_EXISTS";

  //Generate password hash
  var salt = bcrypt.genSaltSync(10);
  var hashedPass = await bcrypt.hash(requestPassword, salt);

  var userId = uuid.v4();
  //Save password, username, time created
  await setUserById(userId, {
    hashedPassword: hashedPass,
    username,
    createdAt: new Date().getTime(),
  });

  var jwtSecret = await accessSecret(env.JWT_SECRET);

  const token = jwt.sign({ userId: userId }, jwtSecret, {
    expiresIn: "1w",
  });

  return token;
}

module.exports = {
  login,
  signup,
};
