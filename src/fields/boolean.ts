import { transform } from './helpers/transform'
import { validateFn } from './helpers/validate'
import { isTheSame } from './helpers/compare'

import { field as genericField, GenericField } from './generic'
import { field as numberField, NumberField } from './number'
import { field as stringField, StringField } from './string'

export interface BooleanField {
  // Casts
  toNumber: (
    transformation: TransformFn<boolean, number>,
    errorMessage?: string
  ) => NumberField

  toString: (
    transformation: TransformFn<boolean, string>,
    errorMessage?: string
  ) => StringField

  // Shared
  to: <Out>(
    transformation: TransformFn<boolean, Out>,
    errorMessage?: string
  ) => GenericField<Out>

  equals: (value: boolean, errorMessage?: string) => BooleanField

  validate: ValidateFn<boolean>

  // Boolean specific
  checked: (errorMessage?: string) => BooleanField
}

export const field = (
  transforms: FieldTransformsArray<boolean>
): BooleanField => ({
  // Casts
  toNumber: (
    transformation: TransformFn<boolean, number> = (value) => Number(value),
    errorMessage?: string
  ) => numberField([...transforms, transform(transformation, errorMessage)]),

  toString: (
    transformation: TransformFn<boolean, string> = (value) => String(value),
    errorMessage?: string
  ) => stringField([...transforms, transform(transformation, errorMessage)]),

  // Shared
  to: <Out>(transformation: TransformFn<boolean, Out>, errorMessage?: string) =>
    genericField([...transforms, transform(transformation, errorMessage)]),

  equals: (value: boolean, errorMessage?: string) =>
    field([...transforms, isTheSame(value, errorMessage)]),

  validate: validateFn(transforms),

  // Boolean specific
  checked: (errorMessage?: string) =>
    field([...transforms, isTheSame(true, errorMessage)])
})
