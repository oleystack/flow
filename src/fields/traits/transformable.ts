import { TransformationError } from '../../errors'

import { field as booleanField, BooleanField } from '../boolean'
import { field as genericField, GenericField } from '../generic'
import { field as numberField, NumberField } from '../number'
import { field as stringField, StringField } from '../string'

export type TransformResult<Out> = Out extends number
  ? NumberField
  : Out extends string
  ? StringField
  : Out extends boolean
  ? BooleanField
  : GenericField<Out>
export interface Transformable<T> {
  to: <Out>(
    transformation: WaitableTransformFn<T, Out>,
    errorMessage?: string
  ) => TransformResult<Out>
}

const transform =
  <In, Out>(transform: WaitableTransformFn<In, Out>, errorMessage?: string) =>
  async (value: In): Promise<Out> => {
    try {
      return await transform(value)
    } catch {
      throw new TransformationError(errorMessage)
    }
  }

type ReturningString<T> = WaitableTransformFn<T, string>
type ReturningNumber<T> = WaitableTransformFn<T, number>
type ReturningBoolean<T> = WaitableTransformFn<T, boolean>

function isReturningString<T>(
  transformation: WaitableTransformFn<T, unknown>
): transformation is ReturningString<T> {
  try {
    return typeof transformation({} as T) === 'string'
  } catch {
    return false
  }
}

function isReturningNumber<T>(
  transformation: WaitableTransformFn<T, unknown>
): transformation is ReturningNumber<T> {
  try {
    return typeof transformation({} as T) === 'number'
  } catch {
    return false
  }
}

function isReturningBoolean<T>(
  transformation: WaitableTransformFn<T, unknown>
): transformation is ReturningBoolean<T> {
  try {
    return typeof transformation({} as T) === 'boolean'
  } catch {
    return false
  }
}

export const createTransform = <T>(
  transforms: FieldWaitableTransformsArray<T>
) =>
  ({
    to: <Out>(
      transformation: WaitableTransformFn<T, Out>,
      errorMessage?: string
    ) => {
      if (isReturningString(transformation)) {
        return stringField([
          ...transforms,
          transform(transformation, errorMessage)
        ])
      }

      if (isReturningNumber(transformation)) {
        return numberField([
          ...transforms,
          transform(transformation, errorMessage)
        ])
      }

      if (isReturningBoolean(transformation)) {
        return booleanField([
          ...transforms,
          transform(transformation, errorMessage)
        ])
      }

      return genericField([
        ...transforms,
        transform(transformation, errorMessage)
      ])
    }
  } as Transformable<T>)
