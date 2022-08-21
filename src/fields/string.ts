import { isNoneOf, isOneOf, isTheSame } from './helpers/compare'
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
import { validateFn } from './helpers/validate'

import { field as numberField, NumberField } from './number'
import { field as genericField, GenericField } from './generic'
import { transform } from './helpers/transform'
import { checkCondition } from './helpers/condition'

export interface StringField {
  // String is comparable
  oneOf: (values: string[], errorMessage?: string) => StringField
  noneOf: (values: string[], errorMessage?: string) => StringField
  equals: (value: string, errorMessage?: string) => StringField

  // Casts
  toNumber: (errorMessage?: string) => NumberField

  // String specific
  regex: (pattern: string | RegExp, errorMessage?: string) => StringField
  email: (errorMessage?: string) => StringField
  url: (errorMessage?: string) => StringField
  startsWith: (value: string, errorMessage?: string) => StringField
  endWith: (value: string, errorMessage?: string) => StringField
  minLength: (minLength: number, errorMessage?: string) => StringField
  maxLength: (maxLength: number, errorMessage?: string) => StringField

  // Shared
  to: <Out>(
    transformation: TransformFn<string, Out>,
    errorMessage?: string
  ) => GenericField<Out>
  meets: (condition: ValidatorFn<string>, errorMessage?: string) => StringField
  validate: ValidateFn<string>
}

export const field = (
  transforms: FieldTransformsArray<string>
): StringField => ({
  // String is comparable
  oneOf: (values: string[], errorMessage?: string) =>
    field([...transforms, isOneOf(values, errorMessage)]),

  noneOf: (values: string[], errorMessage?: string) =>
    field([...transforms, isNoneOf(values, errorMessage)]),

  equals: (value: string, errorMessage?: string) =>
    field([...transforms, isTheSame(value, errorMessage)]),

  // Casts
  toNumber: (errorMessage?: string) =>
    numberField([...transforms, castToNumber(errorMessage)]),

  // String specific
  regex: (pattern: string | RegExp, errorMessage?: string) =>
    field([...transforms, testRegExp(pattern, errorMessage)]),

  email: (errorMessage?: string) =>
    field([...transforms, isEmail(errorMessage)]),

  url: (errorMessage?: string) => field([...transforms, isUrl(errorMessage)]),

  startsWith: (value: string, errorMessage?: string) =>
    field([...transforms, startsWith(value, errorMessage)]),

  endWith: (value: string, errorMessage?: string) =>
    field([...transforms, endsWith(value, errorMessage)]),

  minLength: (minLength: number, errorMessage?: string) =>
    field([...transforms, hasMinLength(minLength, errorMessage)]),

  maxLength: (maxLength: number, errorMessage?: string) =>
    field([...transforms, hasMaxLength(maxLength, errorMessage)]),

  // Shared
  to: <Out>(transformation: TransformFn<string, Out>, errorMessage?: string) =>
    genericField([...transforms, transform(transformation, errorMessage)]),

  meets: (condition: ValidatorFn<string>, errorMessage?: string) =>
    field([...transforms, checkCondition(condition, errorMessage)]),

  validate: validateFn(transforms)
})
