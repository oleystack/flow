import { TransformationError, ValidationError } from '../../errors'
import { getWaitableValue } from './waitable-value'

export const trim = (message?: string) => async (value: string) => {
  try {
    return value.trim()
  } catch {
    throw new TransformationError(message)
  }
}

export const hasMinLength =
  (minLength: WaitableValue<number>, message?: string) =>
  async (value: string) => {
    if (value.length >= (await getWaitableValue(minLength))) {
      return value
    }

    throw new ValidationError(message)
  }

export const hasMaxLength =
  (maxLength: WaitableValue<number>, message?: string) =>
  async (value: string) => {
    if (value.length <= (await getWaitableValue(maxLength))) {
      return value
    }

    throw new ValidationError(message)
  }

export const testRegExp =
  (pattern: WaitableValue<string | RegExp>, message?: string) =>
  async (value: string) => {
    if (RegExp(await getWaitableValue(pattern)).test(value)) {
      return value
    }

    throw new ValidationError(message)
  }

export const isEmail = (message?: string) => (value: string) =>
  testRegExp(
    // This is the W3 official regexp https://html.spec.whatwg.org/multipage/input.html#email-state-(type=email)
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    message
  )(value)

export const isUrl = (message?: string) => (value: string) =>
  testRegExp(
    // regexr.com/3dqa0
    /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/,
    message
  )(value)

export const startsWith =
  (prefix: WaitableValue<string>, message?: string) =>
  async (value: string) => {
    if (value.startsWith(await getWaitableValue(prefix))) {
      return value
    }

    throw new ValidationError(message)
  }

export const endsWith =
  (sufix: WaitableValue<string>, message?: string) => async (value: string) => {
    if (value.endsWith(await getWaitableValue(sufix))) {
      return value
    }

    throw new ValidationError(message)
  }
