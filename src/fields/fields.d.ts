type ValidatorFn<T> = (value: T) => Promise<boolean> | boolean

type TransformFn<In, Out> = (value: In) => Promise<Out> | Out

type FieldTransformsArray<T> = [
  ...TransformFn<unknown, unknown>[],
  TransformFn<any, T>
]

type ValidateFnResult<T> =
  | { isValid: true; value: T; errors: [] }
  | { isValid: false; value: unknown; errors: string[] }

type ValidateFn<T> = (value: unknown) => Promise<ValidateFnResult<T>>
