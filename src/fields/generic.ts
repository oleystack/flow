import { field as numberField } from './number'
import { field as stringField } from './string'
import { checkCondition, Conditionable } from './traits/conditionable'
import {
  transform,
  Transformable,
  TransformableToNumber,
  TransformableToString
} from './traits/transformable'
import { createValidate, Validatable } from './traits/validatable'

export interface GenericField<T>
  extends Validatable<T>,
    Conditionable<T, GenericField<T>>,
    Transformable<T>,
    TransformableToString<T>,
    TransformableToNumber<T> {}

export const field = <T>(
  transforms: FieldWaitableTransformsArray<T>
): GenericField<T> => ({
  // Transformable
  toNumber: (
    transformation: WaitableTransformFn<T, number> = (value) => Number(value),
    errorMessage?: string
  ) => numberField([...transforms, transform(transformation, errorMessage)]),

  toString: (
    transformation: WaitableTransformFn<T, string> = (value) => String(value),
    errorMessage?: string
  ) => stringField([...transforms, transform(transformation, errorMessage)]),

  to: <Out>(
    transformation: WaitableTransformFn<T, Out>,
    errorMessage?: string
  ) => field([...transforms, transform(transformation, errorMessage)]),

  // Conditionable
  meets: (condition: WaitableConditionFn<T>, errorMessage?: string) =>
    field([...transforms, checkCondition(condition, errorMessage)]),

  // Validatable
  validate: createValidate(transforms)
})
