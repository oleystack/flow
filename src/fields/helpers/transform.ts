import { TransformationError } from '../../errors'

export const transform =
  <In, Out>(transform: TransformFn<In, Out>, errorMessage?: string) =>
  async (value: In): Promise<Out> => {
    try {
      return await transform(value)
    } catch {
      throw new TransformationError(errorMessage)
    }
  }
