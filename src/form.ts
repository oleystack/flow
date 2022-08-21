import {
  castToBoolean,
  castToNumber,
  isString,
  isStringOrNumber
} from './fields/helpers/cast'
import { trim } from './fields/helpers/text'

import { field as numberField } from './fields/number'
import { field as booleanField } from './fields/boolean'
import { field as stringField } from './fields/string'

export const field = {
  /**
   * Create a string field.
   * Trimming is done by default.
   * @param errorMessage
   * @returns StringField
   */
  string: (errorMessage?: string) =>
    stringField([isString(errorMessage), trim(errorMessage)]),

  /**
   * Create a number field.
   *
   * NOTE: Because this library is strongly focused on forms, we implicitly cast strings to numbers.
   * String trimming is done by default.
   * @param errorMessage
   * @returns NumberField
   */
  number: (errorMessage?: string) =>
    numberField([
      isStringOrNumber(errorMessage),
      // Trimming is not necessary because we are casting to number.
      castToNumber(errorMessage)
    ]),

  /**
   * Create a boolean field.
   * @param errorMessage
   * @returns BooleanField
   */
  bool: (errorMessage?: string) => booleanField([castToBoolean(errorMessage)])
}

// const test = <B>(a: () => B) => ({ fields: {} as B })
// const MyForm = test(() => {
//   return {
//     b: field.string(),
//     a: field
//       .string()
//       .whenOthers<MyForm>((fields) =>
//         fields.b.is((bValue) => aValue === bValue)
//       )
//   }
// })
