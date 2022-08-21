import { TransformationError } from 'src/errors'
import { GenericField } from '../generic'
import { NumberField } from '../number'
import { StringField } from '../string'

export interface Transformable<T> {
  to: <Out>(
    transformation: WaitableTransformFn<T, Out>,
    errorMessage?: string
  ) => GenericField<Out>
}

export interface TransformableToString<T> {
  toString: (
    transformation?: WaitableTransformFn<T, string>,
    errorMessage?: string
  ) => StringField
}

export interface TransformableToNumber<T> {
  toNumber: (
    transformation: WaitableTransformFn<T, number>,
    errorMessage?: string
  ) => NumberField
}

export const transform =
  <In, Out>(transform: WaitableTransformFn<In, Out>, errorMessage?: string) =>
  async (value: In): Promise<Out> => {
    try {
      return await transform(value)
    } catch {
      throw new TransformationError(errorMessage)
    }
  }
