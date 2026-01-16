/**
 * Custom API Error class for consistent error handling
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Validation Error
 */
export class ValidationError extends ApiError {
  constructor(message: string, details?: unknown) {
    super(message, 400, details);
    this.name = "ValidationError";
  }
}

/**
 * Authentication Error
 */
export class AuthenticationError extends ApiError {
  constructor(message: string = "Unauthorized") {
    super(message, 401);
    this.name = "AuthenticationError";
  }
}

/**
 * Authorization Error
 */
export class AuthorizationError extends ApiError {
  constructor(message: string = "Forbidden") {
    super(message, 403);
    this.name = "AuthorizationError";
  }
}

/**
 * Not Found Error
 */
export class NotFoundError extends ApiError {
  constructor(message: string = "Resource not found") {
    super(message, 404);
    this.name = "NotFoundError";
  }
}
