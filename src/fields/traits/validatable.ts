export interface Validatable<T> {
  validate: FieldValidatorFn<T>
}

export const createValidate = <T>(
  transforms: FieldWaitableTransformsArray<T>
) => ({
  validate: async (value: unknown): Promise<FieldValidatorResult<T>> => {
    let isValid = true
    const errors: string[] = []

    const finalValue = (await transforms.reduce(
      async (currentValue, transform) => {
        try {
          return await transform(await currentValue)
        } catch (error) {
          if (error instanceof Error && error.message) {
            errors.push(error.message)
          }

          if (typeof error === 'string' && error.length > 0) {
            errors.push(error)
          }

          isValid = false

          return await currentValue
        }
      },
      value
    )) as T

    // Maybe returning the whole pipe will be a good idea.

    if (isValid) {
      return { isValid: true, value: finalValue, errors: [] }
    }

    return {
      isValid: false,
      errors,
      value
    }
  }
})
