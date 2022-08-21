import { TransformationError, ValidationError } from '../../errors'

export const castToNumber =
  <T>(message?: string) =>
  (value: T): number => {
    const finalValue = Number(value)

    if (isNaN(finalValue)) {
      throw new TransformationError(message)
    }
    return finalValue
  }

export const safeCastToNumber =
  <T>(message?: string) =>
  (value: T): number => {
    if (!['string', 'number'].includes(typeof value)) {
      throw new TransformationError(message)
    }

    return castToNumber(message)(value)
  }

export const castToBoolean =
  <T>(message?: string) =>
  (value: T): boolean => {
    if (typeof value === 'boolean') {
      return value
    }

    const allowedValues = ['true', 'false', 0, 1]

    if (allowedValues.includes(value as never)) {
      return Boolean(value)
    }

    throw new TransformationError(message)
  }

export const isString =
  <T>(message?: string) =>
  (value: T): string => {
    if (typeof value === 'string') {
      return value
    }

    throw new ValidationError(message)
  }
