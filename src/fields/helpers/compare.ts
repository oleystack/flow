import { ValidationError } from '../../errors'

export const isTheSame =
  <T>(a: T, message?: string) =>
  (b: T) => {
    if (a === b) {
      return b
    }

    throw new ValidationError(message)
  }

export const isOneOf =
  <T>(values: T[], message?: string) =>
  (value: T) => {
    if (values.includes(value)) {
      return value
    }

    throw new ValidationError(message)
  }

export const isNoneOf =
  <T>(values: T[], message?: string) =>
  (value: T) => {
    if (!values.includes(value)) {
      return value
    }

    throw new ValidationError(message)
  }
