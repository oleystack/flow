export const getWaitableValue = async <T>(
  value: WaitableValue<T>
): Promise<T> => {
  if (value instanceof Function) {
    return await value()
  }

  return value
}
