import { TransformationError, ValidationError } from '../../errors'

export const castToString =
  <T>(message?: string) =>
  (value: T): string => {
    try {
      return String(value)
    } catch {
      throw new TransformationError(message)
    }
  }

export const castToNumber =
  <T>(message?: string) =>
  (value: T): number => {
    try {
      return Number(value)
    } catch {
      throw new TransformationError(message)
    }
  }

export const castToBoolean =
  <T>(message?: string) =>
  (value: T): boolean => {
    try {
      return Boolean(value)
    } catch {
      throw new TransformationError(message)
    }
  }

export const isString =
  <T>(message?: string) =>
  (value: T): string => {
    if (typeof value === 'string') {
      return value
    }

    throw new ValidationError(message)
  }

export const isNumber =
  <T>(message?: string) =>
  (value: T): number => {
    if (typeof value === 'number') {
      return value
    }

    throw new ValidationError(message)
  }

export const isBoolean =
  <T>(message?: string) =>
  (value: T): boolean => {
    if (typeof value === 'boolean') {
      throw value
    }

    throw new ValidationError(message)
  }

export const isStringOrNumber =
  <T>(message?: string) =>
  (value: T): string | number => {
    if (typeof value === 'string') {
      return value as string
    }

    if (typeof value === 'number') {
      return value as number
    }

    throw new ValidationError(message)
  }
