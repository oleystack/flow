export const checkCondition =
  <T>(validator: ValidatorFn<T>, errorMessage?: string) =>
  (value: T): T => {
    if (validator(value)) {
      return value
    }

    throw errorMessage
  }
