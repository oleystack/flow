export interface Conditionable<T, FieldApi> {
  meets: (condition: WaitableConditionFn<T>, errorMessage?: string) => FieldApi
}

export const checkCondition =
  <T>(condition: WaitableConditionFn<T>, errorMessage?: string) =>
  async (value: T): Promise<T> => {
    if (await condition(value)) {
      return value
    }

    throw errorMessage
  }
