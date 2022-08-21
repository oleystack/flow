import { checkCondition, Conditionable } from './traits/conditionable'
import { createTransform, Transformable } from './traits/transformable'
import { createValidate, Validatable } from './traits/validatable'

export interface GenericField<T>
  extends Validatable<T>,
    Conditionable<T, GenericField<T>>,
    Transformable<T> {}

type GenericFieldSignature = <T>(
  transforms: FieldWaitableTransformsArray<T>
) => GenericField<T>

export const field: GenericFieldSignature = <T>(
  transforms: FieldWaitableTransformsArray<T>
) => ({
  __type: 'generic',

  // Transformable
  ...createTransform(transforms),

  // Conditionable
  meets: (condition: WaitableConditionFn<T>, errorMessage?: string) =>
    field([...transforms, checkCondition(condition, errorMessage)]),

  // Validatable
  ...createValidate(transforms)
})
