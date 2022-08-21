import { ValidationError } from '../../errors'
import { getWaitableValue } from '../helpers/waitable-value'

export interface Equalable<T, FieldApi> {
  equals: (value: WaitableValue<T>, errorMessage?: string) => FieldApi
}

export const isTheSame =
  <T>(a: WaitableValue<T>, message?: string) =>
  async (b: T) => {
    if ((await getWaitableValue(a)) === b) {
      return b
    }

    throw new ValidationError(message)
  }
