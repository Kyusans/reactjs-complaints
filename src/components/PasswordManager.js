class PasswordManager {
  constructor() {
    this.password = "";
  }

  getPassword() {
    return this.password;
  }

  setPassword(newPassword) {
    this.password = newPassword;
  }
}

const passwordManagerInstance = new PasswordManager();

export default passwordManagerInstance;
