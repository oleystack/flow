import { castToString } from './helpers/cast'
import { checkCondition } from './helpers/condition'
import {
  isGreaterThan,
  isGreaterThanOrEquals,
  isInt,
  isLessThan,
  isLessThanOrEquals
} from './helpers/numeric'
import { transform } from './helpers/transform'
import { validateFn } from './helpers/validate'

import { field as stringField, StringField } from './string'
import { field as genericField, GenericField } from './generic'

export interface NumberField {
  toString: (errorMessage?: string) => StringField

  to: <Out>(
    transformation: TransformFn<number, Out>,
    errorMessage?: string
  ) => GenericField<Out>
  meets: (condition: ValidatorFn<number>, errorMessage?: string) => NumberField
  validate: ValidateFn<number>

  lessThan: (min: number, errorMessage?: string) => NumberField
  lessThanOrEquals: (min: number, errorMessage?: string) => NumberField
  greaterThan: (max: number, errorMessage?: string) => NumberField
  greaterThanOrEquals: (max: number, errorMessage?: string) => NumberField
  integer: (errorMessage?: string) => NumberField
}

export const field = (
  transforms: FieldTransformsArray<number>
): NumberField => ({
  // Casts
  toString: (errorMessage?: string) =>
    stringField([...transforms, castToString(errorMessage)]),

  // Shared
  to: <Out>(transformation: TransformFn<number, Out>, errorMessage?: string) =>
    genericField([...transforms, transform(transformation, errorMessage)]),

  meets: (condition: ValidatorFn<number>, errorMessage?: string) =>
    field([...transforms, checkCondition(condition, errorMessage)]),

  validate: validateFn(transforms),

  // Number specific
  lessThan: (min: number, errorMessage?: string) =>
    field([...transforms, isLessThan(min, errorMessage)]),

  lessThanOrEquals: (min: number, errorMessage?: string) =>
    field([...transforms, isLessThanOrEquals(min, errorMessage)]),

  greaterThan: (max: number, errorMessage?: string) =>
    field([...transforms, isGreaterThan(max, errorMessage)]),

  greaterThanOrEquals: (max: number, errorMessage?: string) =>
    field([...transforms, isGreaterThanOrEquals(max, errorMessage)]),

  integer: (errorMessage?: string) =>
    field([...transforms, isInt(errorMessage)])
})
