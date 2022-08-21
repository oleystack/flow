type WaitableValue<T> = (() => Promise<T>) | T

type WaitableTransformFn<In, Out> = (value: In) => Promise<Out> | Out

type WaitableConditionFn<T> = (value: T) => Promise<boolean> | boolean

type FieldValidatorResult<T> =
  | { isValid: true; value: T; errors: string[] }
  | { isValid: false; value: unknown; errors: string[] }

type FieldValidatorFn<T> = (value: unknown) => Promise<FieldValidatorResult<T>>

type FieldWaitableTransformsArray<T> = [
  ...WaitableTransformFn<unknown, unknown>[],
  WaitableTransformFn<any, T> // eslint-disable-line @typescript-eslint/no-explicit-any
]

type Field<T, Api> = (transforms: FieldWaitableTransformsArray<T>) => Api
