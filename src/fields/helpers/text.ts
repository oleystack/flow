import { TransformationError, ValidationError } from '../../errors'

export const trim =
  (message?: string) =>
  (value: string): string => {
    try {
      return value.trim()
    } catch {
      throw new TransformationError(message)
    }
  }

export const hasMinLength =
  (minLength: number, message?: string) => (value: string) => {
    if (value.length >= minLength) {
      return value
    }

    throw new ValidationError(message)
  }

export const hasMaxLength =
  (maxLength: number, message?: string) => (value: string) => {
    if (value.length <= maxLength) {
      return value
    }

    throw new ValidationError(message)
  }

export const testRegExp =
  (pattern: string | RegExp, message?: string) => (value: string) => {
    if (RegExp(pattern).test(value)) {
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
  (prefix: string, message?: string) => (value: string) => {
    if (value.startsWith(prefix)) {
      return value
    }

    throw new ValidationError(message)
  }

export const endsWith =
  (sufix: string, message?: string) => (value: string) => {
    if (value.endsWith(sufix)) {
      return value
    }

    throw new ValidationError(message)
  }
