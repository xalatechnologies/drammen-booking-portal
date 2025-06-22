/**
 * Result utility for handling operation results and errors consistently
 * Follows Single Responsibility Principle by focusing only on representing operation outcomes
 */

export enum ErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  CONFLICT_ERROR = 'CONFLICT_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR'
}

export interface ErrorResult {
  type: ErrorType;
  message: string;
  details?: any;
}

export class Result<T> {
  private readonly _isSuccess: boolean;
  private readonly _error?: ErrorResult;
  private readonly _value?: T;

  private constructor(isSuccess: boolean, error?: ErrorResult, value?: T) {
    this._isSuccess = isSuccess;
    this._error = error;
    this._value = value;
  }

  /**
   * Check if the result is successful
   */
  public get isSuccess(): boolean {
    return this._isSuccess;
  }

  /**
   * Check if the result is a failure
   */
  public get isFailure(): boolean {
    return !this._isSuccess;
  }

  /**
   * Get the error if the result is a failure
   */
  public get error(): ErrorResult | undefined {
    return this._error;
  }

  /**
   * Get the value if the result is successful
   */
  public get value(): T | undefined {
    return this._value;
  }

  /**
   * Create a success result with a value
   */
  public static success<U>(value?: U): Result<U> {
    return new Result<U>(true, undefined, value);
  }

  /**
   * Create a failure result with an error
   */
  public static failure<U>(error: ErrorResult): Result<U> {
    return new Result<U>(false, error);
  }

  /**
   * Create a not found error
   */
  public static notFound<U>(message: string, details?: any): Result<U> {
    return Result.failure<U>({
      type: ErrorType.NOT_FOUND_ERROR,
      message,
      details
    });
  }

  /**
   * Create a validation error
   */
  public static validationError<U>(message: string, details?: any): Result<U> {
    return Result.failure<U>({
      type: ErrorType.VALIDATION_ERROR,
      message,
      details
    });
  }

  /**
   * Create a database error
   */
  public static databaseError<U>(message: string, details?: any): Result<U> {
    return Result.failure<U>({
      type: ErrorType.DATABASE_ERROR,
      message,
      details
    });
  }

  /**
   * Create an authorization error
   */
  public static authorizationError<U>(message: string, details?: any): Result<U> {
    return Result.failure<U>({
      type: ErrorType.AUTHORIZATION_ERROR,
      message,
      details
    });
  }

  /**
   * Create a conflict error
   */
  public static conflictError<U>(message: string, details?: any): Result<U> {
    return Result.failure<U>({
      type: ErrorType.CONFLICT_ERROR,
      message,
      details
    });
  }

  /**
   * Create an internal error
   */
  public static internalError<U>(message: string, details?: any): Result<U> {
    return Result.failure<U>({
      type: ErrorType.INTERNAL_ERROR,
      message,
      details
    });
  }
}
