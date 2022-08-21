export const validateFn =
  <T>(transforms: FieldTransformsArray<T>) =>
  async (value: unknown): Promise<ValidateFnResult<T>> => {
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
