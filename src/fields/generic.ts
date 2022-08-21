import { castToNumber, castToString } from './helpers/cast'
import { checkCondition } from './helpers/condition'
import { transform } from './helpers/transform'
import { validateFn } from './helpers/validate'

import { field as numberField, NumberField } from './number'
import { field as stringField, StringField } from './string'

export interface GenericField<T> {
  toNumber: (errorMessage?: string) => NumberField
  toString: (errorMessage?: string) => StringField

  to: <Out>(
    transformation: TransformFn<T, Out>,
    errorMessage?: string
  ) => GenericField<Out>
  meets: (condition: ValidatorFn<T>, errorMessage?: string) => GenericField<T>
  validate: ValidateFn<T>
}

export const field = <T>(
  transforms: FieldTransformsArray<T>
): GenericField<T> => ({
  // Casts
  toNumber: (errorMessage?: string) =>
    numberField([...transforms, castToNumber(errorMessage)]),

  toString: (errorMessage?: string) =>
    stringField([...transforms, castToString(errorMessage)]),

  // Shared
  to: <Out>(transformation: TransformFn<T, Out>, errorMessage?: string) =>
    field([...transforms, transform(transformation, errorMessage)]),

  meets: (condition: ValidatorFn<T>, errorMessage?: string) =>
    field([...transforms, checkCondition(condition, errorMessage)]),

  validate: validateFn(transforms)
})
