interface IApiError extends Error {
  code: number;
  message: string;
}
export class ApiError extends Error implements IApiError {
  public code: number;
  public message: string;
  constructor(code: number, message: string) {
    super(message);
    this.code = code;
    this.message = message;
  }

  static badRequest(message: string): IApiError {
    return new ApiError(400, message);
  }

  static internalServerError(message: string): IApiError {
    return new ApiError(500, message);
  }

  static unauthorized(message: string): IApiError {
    return new ApiError(401, message);
  }

  static notFound(message: string): IApiError {
    return new ApiError(404, message);
  }

  static conflict(message: string): IApiError {
    return new ApiError(409, message);
  }

  static forbidden(message: string): IApiError {
    return new ApiError(403, message);
  }

  static badGateway(message: string): IApiError {
    return new ApiError(502, message);
  }

  static gatewayTimeout(message: string): IApiError {
    return new ApiError(504, message);
  }
}
