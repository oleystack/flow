import type { Pipe } from '../src/scheme'

//
// NOTE: All the validators are actually throwable transformations.
//

// For string

export const isEmpty = (value: string): string => {
  if (value === '') {
    throw 'Value is empty'
  }

  return value
}

export const isShorterThan =
  (maxLength: number) =>
  (value: string): string => {
    if (value.length > maxLength) {
      throw `Value needs to be shorter than ${maxLength}`
    }

    return value
  }

// For Boolean

export const isChecked = (value: boolean): boolean => {
  if (!value) {
    throw 'Checkbox has to be checked'
  }

  return value
}

// For number

export const increment = (value: number): number => {
  return value + 1
}

// For all

export const toNumber = <In>(value: In): number => {
  const result = Number(value)

  if (Number.isNaN(result)) {
    throw 'Value cannot be converted to a number'
  }

  return result
}

type ValidationResult<T> =
  | { isValid: true; result: T }
  | { isValid: false; error: string }

export const validate = async <T>(
  pipe: Pipe<unknown, T>,
  value: any
): Promise<ValidationResult<T>> => {
  try {
    const result = await pipe.reduce(async (previousValue, transformation) => {
      return transformation(await previousValue)
    }, value)

    return {
      isValid: true,
      result
    }
  } catch (error) {
    return {
      isValid: false,
      error
    }
  }
}
