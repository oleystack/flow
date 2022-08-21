export interface Validatable<T> {
  validate: FieldValidatorFn<T>
}

export const createValidate =
  <T>(transforms: FieldWaitableTransformsArray<T>) =>
  async (value: unknown): Promise<FieldValidatorResult<T>> => {
    const errors: string[] = []

    const finalValue = (await transforms.reduce(
      async (currentValue, transform) => {
        try {
          return await transform(currentValue)
        } catch (error) {
          if (error instanceof Error) {
            errors.push(error.message)
          }

          if (typeof error === 'string') {
            errors.push(error)
          }

          return currentValue
        }
      },
      value
    )) as T

    const isValid = errors.length === 0

    if (isValid) {
      return { isValid: true, value: finalValue, errors: [] }
    }

    return {
      isValid: false,
      errors,
      value
    }
  }
