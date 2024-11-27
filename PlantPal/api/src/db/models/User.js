const crypto = require("crypto");

module.exports = class User {
  id = null;
  first_name = null;
  last_name = null;
  username = null;
  #passwordHash = null;
  #salt = null;

  constructor(data) {
    this.id = data.id;
    this.first_name = data.first_name;
    this.last_name = data.last_name;
    this.username = data.username;
    this.#passwordHash = data.hash;
    this.#salt = data.salt;
  }

  static generatePrivateFields(password, salt) {
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(password, salt, 100000, 64, "sha512", (err, derivedKey) => {
        if (err) reject(err);
        resolve(derivedKey.toString("hex"));
      });
    });
  }

  validatePassword(password) {
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(
        password,
        this.#salt,
        100000,
        64,
        "sha512",
        (err, derivedKey) => {
          if (err) {
            //problem computing digest, like hash function not available
            reject("Error: " + err);
          }

          const digest = derivedKey.toString("hex");
          if (this.#passwordHash == digest) {
            resolve(this);
          } else {
            reject("Invalid username or password");
          }
        }
      );
    });
  }

  toJSON() {
    return {
      id: this.id,
      first_name: this.first_name,
      last_name: this.last_name,
      username: this.username,
    };
  }
};
