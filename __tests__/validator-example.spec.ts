import { createScheme } from '../src/scheme'
import {
  increment,
  isChecked,
  isEmpty,
  isShorterThan,
  toNumber,
  validate
} from './validators.helper'

// 1. First define scheme
const scheme = createScheme()
  .with(Number, (_parent, fields, pipe) => ({
    increment: () => fields(Number, [...pipe, increment]),
    validate: (value: any) => validate(pipe, value)
  }))
  .with(String, (_parent, fields, pipe) => ({
    toNumber: () => fields(Number, [...pipe, toNumber]),
    isEmpty: () => fields(String, [...pipe, isEmpty]),
    isShorterThan: (maxLength: number) =>
      fields(String, [...pipe, isShorterThan(maxLength)]),
    validate: (value: any) => validate(pipe, value)
  }))
  .with(Boolean, (_parent, fields, pipe) => ({
    isChecked: () => fields(Boolean, [...pipe, isChecked]),
    validate: (value: any) => validate(pipe, value)
  }))

// 2. You can deifne your own facade
const validator = {
  number: scheme.getField(Number),
  text: scheme.getField(String),
  checkbox: scheme.getField(Boolean)
}

// 3. Use it
describe('Validator example', () => {
  it('Text to number', async () => {
    const validationResult = await validator.text
      .toNumber()
      .increment()
      .validate('123')

    expect(validationResult).toEqual({ isValid: true, result: 124 })
  })

  it('Checkbox', async () => {
    const validationResult = await validator.checkbox
      .isChecked()
      .validate(false)

    expect(validationResult).toEqual({
      isValid: false,
      error: 'Checkbox has to be checked'
    })
  })

  it('Checkbox to number', async () => {
    const validationResult = await validator.checkbox
      .isChecked()
      .transform(Number, (value) => Number(value))
      .increment()
      .increment()
      .increment()
      .validate(true)

    expect(validationResult).toEqual({ isValid: true, result: 4 })
  })

  it('Number to string', async () => {
    const validationResult = await validator.number
      .increment()
      .increment()
      .increment()
      .transform(String, (value) => `${value}`)
      .isShorterThan(4)
      .validate(100)

    expect(validationResult).toEqual({ isValid: true, result: '103' })
  })
})
