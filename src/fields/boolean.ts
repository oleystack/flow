import { field as genericField } from './generic'
import { field as numberField } from './number'
import { field as stringField } from './string'

import { Equalable, isTheSame } from './traits/equalable'

import {
  transform,
  Transformable,
  TransformableToNumber,
  TransformableToString
} from './traits/transformable'
import { createValidate, Validatable } from './traits/validatable'

export interface BooleanFieldApi
  extends Validatable<boolean>,
    Equalable<boolean, BooleanFieldApi>,
    Transformable<boolean>,
    TransformableToString<boolean>,
    TransformableToNumber<boolean> {
  // Instead of "meets" function
  checked: (errorMessage?: string) => BooleanFieldApi
}

export const field: Field<boolean, BooleanFieldApi> = (transforms) => ({
  // Transformable
  toNumber: (
    transformation: WaitableTransformFn<boolean, number> = (value) =>
      Number(value),
    errorMessage?: string
  ) => numberField([...transforms, transform(transformation, errorMessage)]),

  toString: (
    transformation: WaitableTransformFn<boolean, string> = (value) =>
      String(value),
    errorMessage?: string
  ) => stringField([...transforms, transform(transformation, errorMessage)]),

  to: <Out>(
    transformation: WaitableTransformFn<boolean, Out>,
    errorMessage?: string
  ) => genericField([...transforms, transform(transformation, errorMessage)]),

  // Equalable
  equals: (value: WaitableValue<boolean>, errorMessage?: string) =>
    field([...transforms, isTheSame(value, errorMessage)]),

  // Validatable
  validate: createValidate(transforms),

  // Boolean specific
  checked: (errorMessage?: string) =>
    field([...transforms, isTheSame(true, errorMessage)])
})
