
const { Router } = require('express');
const router = Router();
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validaJWT } = require('../middlewares/valida-jwt');

const { crearUsuario, loginUsuario, renewToken } = require('../controllers/auth');


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

module.exports = router;