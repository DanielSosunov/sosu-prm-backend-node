var bcrypt = require("bcryptjs");

async function run() {
  const crypto = require("crypto");

  // Generate a secure JWT secret (256 bits)
  const generateJWTSecret = () => {
    return crypto.randomBytes(32).toString("hex");
  };

  console.log(generateJWTSecret());
  // var salt = bcrypt.genSaltSync(10);
  // console.log(salt);

  // var hashedPass = await bcrypt.hash("testpass", salt);
  // console.log(hashedPass);
  // /** Encrypt password */
  // bcrypt.hash('anypassword', salt, (err, res) => {
  //     console.log('hash', res)
  //     hash = res
  //     compare(hash)
  // });

  //   const isPasswordValid = await bcrypt.compare(
  //     requestPassword,
  //     user.hashedPassword
  //   );
  //   if (!isPasswordValid) throw "INVALID_AUTH";
}

run();
