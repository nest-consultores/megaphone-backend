// import { check } from "express-validator"
// import { validateResult } from "../helpers/validateHelpers.js"

// const regex = /@megaphone\.cl$/
// const regexPassword = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// const validateCreateUser = [
//   check('name')
//     .exists()
//     .not()
//     .custom((value, {req}) => {
//       if(!value) {
//         throw new Error('El nombre no puede ir vacío')
//       }
//     }),

//     check('email')
//     .exists({checkFalsy: true, checkNull: true}).withMessage('El correo electrónico es obligatorio')
//     .isEmail().withMessage('El correo electrónico no es válido')
//     .custom((value, {req}) => {
//       if(!regex.test(value)) {
//         throw new Error('El correo asignado no corresponde a la institución')
//       }
//       return true;
//     }).withMessage('El correo electrónico no es válido para esta institución'),

//     check('role')
//     .exists()
//     .not()
//     .custom((value, {req}) => {
//       if(!value) {
//         throw new Error('El nombre no puede ir vacío')
//       }
//     })

//     // check('password')
//     // .exists({ checkFalsy: true, checkNull: true })
//     // .withMessage('La contraseña no puede ir vacía')
//     // .isLength({ min: 8 })
//     // .withMessage('La contraseña debe tener al menos 8 caracteres')
//     // .custom((value, {req}) => {
//     //   if(!regexPassword.test(value)) {
//     //     throw new Error('La contraseña debe contener letras, números y símbolos')
//     //   }
//     // })

//   ,(req, res,next) => {
//     validateResult(req, res, next)
//   }
// ]
