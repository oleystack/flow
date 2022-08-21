import { ValidationError } from '../../errors'

export const isLessThan =
  (max: number, message?: string) => (value: number) => {
    if (value < max) {
      return value
    }

    throw new ValidationError(message)
  }

export const isLessThanOrEquals =
  (max: number, message?: string) => (value: number) => {
    if (value <= max) {
      return value
    }

    throw new ValidationError(message)
  }

export const isGreaterThan =
  (min: number, message?: string) => (value: number) => {
    if (value > min) {
      return value
    }

    throw new ValidationError(message)
  }

export const isGreaterThanOrEquals =
  (min: number, message?: string) => (value: number) => {
    if (value >= min) {
      return value
    }

    throw new ValidationError(message)
  }

export const isInt = (message?: string) => (value: number) => {
  if (Number.isInteger(value)) {
    return value
  }

  throw new ValidationError(message)
}
