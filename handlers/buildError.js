class ApiError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.message = message;
  }

  static badRequest(message) {
    return new ApiError(400, message);
  }

  static internalServerError(message) {
    return new ApiError(500, message);
  }

  static unauthorized(message) {
    return new ApiError(401, message);
  }

  static notFound(message) {
    return new ApiError(404, message);
  }

  static conflict(message) {
    return new ApiError(409, message);
  }

  static forbidden(message) {
    return new ApiError(403, message);
  }

  static badGateway(message) {
    return new ApiError(502, message);
  }

  static gatewayTimeout(message) {
    return new ApiError(504, message);
  }

  static getStatusCode() {
    return this.code;
  }

  static getMessage() {
    return this.message;
  }

  static getError() {
    return {
      code: this.code,
      message: this.message,
    };
  }

  static getErrorResponse() {
    return {
      status: this.code,
      error: this.getError(),
    };
  }
}

module.exports = {
  ApiError,
};
