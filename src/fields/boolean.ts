import { Equalable, isTheSame } from './traits/equalable'

import { createTransform, Transformable } from './traits/transformable'
import { createValidate, Validatable } from './traits/validatable'

export interface BooleanField
  extends Validatable<boolean>,
    Equalable<boolean, BooleanField>,
    Transformable<boolean> {
  // Instead of "meets" function
  checked: (errorMessage?: string) => BooleanField
}

export const field: Field<boolean, BooleanField> = (transforms) => ({
  __type: 'boolean',

  // Transformable
  ...createTransform(transforms),

  // Equalable
  equals: (value: WaitableValue<boolean>, errorMessage?: string) =>
    field([...transforms, isTheSame(value, errorMessage)]),

  // Validatable
  ...createValidate(transforms),

  // Boolean specific
  checked: (errorMessage?: string) =>
    field([...transforms, isTheSame(true, errorMessage)])
})
