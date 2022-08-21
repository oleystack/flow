import { createValidate, Validatable } from './traits/validatable'
import { isTheSame } from './traits/equalable'
import { createTransform, Transformable } from './traits/transformable'
import { Comparable, isNoneOf, isOneOf } from './traits/comparable'
import { checkCondition, Conditionable } from './traits/conditionable'
import {
  isGreaterThan,
  isGreaterThanOrEquals,
  isInt,
  isLessThan,
  isLessThanOrEquals
} from './helpers/numeric'

export interface NumberField
  extends Validatable<number>,
    Comparable<number, NumberField>, // As long as it's not a Integer it cannot be safely compared
    Conditionable<number, NumberField>,
    Transformable<number> {
  lessThan: (min: number, errorMessage?: string) => NumberField
  lessThanOrEquals: (min: number, errorMessage?: string) => NumberField
  greaterThan: (max: number, errorMessage?: string) => NumberField
  greaterThanOrEquals: (max: number, errorMessage?: string) => NumberField
  integer: (errorMessage?: string) => NumberField
}

export const field: Field<number, NumberField> = (transforms) => ({
  __type: 'number',

  // Comparable
  oneOf: (values: WaitableValue<number[]>, errorMessage?: string) =>
    field([...transforms, isOneOf(values, errorMessage)]),

  noneOf: (values: WaitableValue<number[]>, errorMessage?: string) =>
    field([...transforms, isNoneOf(values, errorMessage)]),

  equals: (value: WaitableValue<number>, errorMessage?: string) =>
    field([...transforms, isTheSame(value, errorMessage)]),

  // Transformable
  ...createTransform(transforms),

  // Conditionable
  meets: (condition: WaitableConditionFn<number>, errorMessage?: string) =>
    field([...transforms, checkCondition(condition, errorMessage)]),

  // Validatable
  ...createValidate(transforms),

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
