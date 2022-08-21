import { castToNumber } from './helpers/cast'
import {
  endsWith,
  hasMaxLength,
  hasMinLength,
  isEmail,
  isUrl,
  startsWith,
  testRegExp
} from './helpers/text'

import { field as numberField } from './number'
import { field as genericField } from './generic'
import { createValidate, Validatable } from './traits/validatable'
import { Comparable, isNoneOf, isOneOf } from './traits/comparable'
import { checkCondition, Conditionable } from './traits/conditionable'
import {
  transform,
  Transformable,
  TransformableToNumber
} from './traits/transformable'
import { isTheSame } from './traits/equalable'

export interface StringField
  extends Validatable<string>,
    Comparable<string, StringField>,
    Conditionable<string, StringField>,
    Transformable<string>,
    TransformableToNumber<string> {
  regex: (
    pattern: WaitableValue<string | RegExp>,
    errorMessage?: string
  ) => StringField
  email: (errorMessage?: string) => StringField
  url: (errorMessage?: string) => StringField
  startsWith: (
    value: WaitableValue<string>,
    errorMessage?: string
  ) => StringField
  endWith: (value: WaitableValue<string>, errorMessage?: string) => StringField
  minLength: (
    minLength: WaitableValue<number>,
    errorMessage?: string
  ) => StringField
  maxLength: (
    maxLength: WaitableValue<number>,
    errorMessage?: string
  ) => StringField
}

export const field: Field<string, StringField> = (transforms) => ({
  // Comparable
  oneOf: (values: WaitableValue<string[]>, errorMessage?: string) =>
    field([...transforms, isOneOf(values, errorMessage)]),

  noneOf: (values: WaitableValue<string[]>, errorMessage?: string) =>
    field([...transforms, isNoneOf(values, errorMessage)]),

  equals: (value: WaitableValue<string>, errorMessage?: string) =>
    field([...transforms, isTheSame(value, errorMessage)]),

  // Transformable
  toNumber: (
    transformation: WaitableTransformFn<string, number> = (value) =>
      Number(value),
    errorMessage?: string
  ) => numberField([...transforms, transform(transformation, errorMessage)]),

  to: <Out>(
    transformation: WaitableTransformFn<string, Out>,
    errorMessage?: string
  ) => genericField([...transforms, transform(transformation, errorMessage)]),

  // Conditionable
  meets: (condition: WaitableConditionFn<string>, errorMessage?: string) =>
    field([...transforms, checkCondition(condition, errorMessage)]),

  // Validatable
  validate: createValidate(transforms),

  // String specific
  regex: (pattern: WaitableValue<string | RegExp>, errorMessage?: string) =>
    field([...transforms, testRegExp(pattern, errorMessage)]),

  email: (errorMessage?: string) =>
    field([...transforms, isEmail(errorMessage)]),

  url: (errorMessage?: string) => field([...transforms, isUrl(errorMessage)]),

  startsWith: (value: WaitableValue<string>, errorMessage?: string) =>
    field([...transforms, startsWith(value, errorMessage)]),

  endWith: (value: WaitableValue<string>, errorMessage?: string) =>
    field([...transforms, endsWith(value, errorMessage)]),

  minLength: (minLength: WaitableValue<number>, errorMessage?: string) =>
    field([...transforms, hasMinLength(minLength, errorMessage)]),

  maxLength: (maxLength: WaitableValue<number>, errorMessage?: string) =>
    field([...transforms, hasMaxLength(maxLength, errorMessage)])
})
