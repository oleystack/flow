// import { describe, expect, test } from 'vitest'
// import { render, screen } from '@testing-library/react'

// describe('Form declaration', () => {
//   test('should be defined with no errors', () => {
//     const MyForm = form({
//       username: field.string.max(12).transform((value) => value),
//       age: field.number.max(12).transform((value) => value)
//     })

//     const Parent = () => {
//       const onSubmit = React.useCallback(
//         async ({ values, errors, isValid }) => {},
//         []
//       )

//       return (
//         <MyForm onSubmit={onSubmit}>
//           <MyForm.username>
//             {(props, field, form) => (
//               <div>
//                 <input {...props} />
//                 {!field.isValid && <p>{field.error}</p>}
//                 {form.isLoading && <p>Loading...</p>}
//               </div>
//             )}
//           </MyForm.username>

//           <input type={'submit'} />
//         </MyForm>
//       )
//     }

//     render(<h4>Content</h4>)

//     expect(screen.getByText(/Content/i)).toBeDefined()
//   })
// })
