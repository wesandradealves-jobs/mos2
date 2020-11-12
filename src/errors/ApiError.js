class ApiError {
  constructor(type, title, message) {
    this.type = type;
    this.message = message;
    this.title = title;
  }
}

export default ApiError;
