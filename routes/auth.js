
const { Router } = require('express');
const router = Router();
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validaJWT } = require('../middlewares/valida-jwt');

const { crearUsuario, loginUsuario, renewToken, forgotPassword, resetPassword } = require('../controllers/auth');


router.post('/new',
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        validarCampos
    ],
    crearUsuario);

router.post('/',[
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password debe contener minimo 6 caracteres').isLength(({ min : 6})),
    validarCampos
], loginUsuario);

router.get('/renew',validaJWT, renewToken);

router.post('/forgot-password',[
    check('email', 'El email es obligatorio').isEmail(),
    validarCampos
], forgotPassword);

router.post('/reset-password',[
    check('token', 'El token es obligatorio').not().isEmpty(),
    check('newPassword', 'La nueva contraseña debe tener mínimo 6 caracteres').isLength({ min: 6 }),
    validarCampos
], resetPassword);

module.exports = router;