export class ValidationError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options)
  }
}

export class TransformationError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options)
  }
}
