import { ValidationError } from '../../errors'
import { getWaitableValue } from '../helpers/waitable-value'
import { Equalable } from './equalable'

export interface Comparable<T, Field> extends Equalable<T, Field> {
  oneOf: (values: WaitableValue<T[]>, errorMessage?: string) => Field
  noneOf: (values: WaitableValue<T[]>, errorMessage?: string) => Field
}

export const isOneOf =
  <T>(values: WaitableValue<T[]>, message?: string) =>
  async (value: T) => {
    if ((await getWaitableValue(values)).includes(value)) {
      return value
    }

    throw new ValidationError(message)
  }

export const isNoneOf =
  <T>(values: WaitableValue<T[]>, message?: string) =>
  async (value: T) => {
    if (!(await getWaitableValue(values)).includes(value)) {
      return value
    }

    throw new ValidationError(message)
  }
