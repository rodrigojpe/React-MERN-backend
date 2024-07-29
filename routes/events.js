
const { Router } = require('express');
const router = Router();
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validaJWT } = require('../middlewares/valida-jwt');
const { isDate } = require('../helpers/isDate');


const { getEventos,crearEvento,actualizarEvento,eliminarEvento } = require('../controllers/events');


router.get('/', getEventos);

router.use(validaJWT);

router.post('/',[
    check('title','El titulo es obligatorio').not().isEmpty(),
    check('start','Fecha de inicio es obligatoria').not().isEmpty(),
    check('end','Fecha de finalizacion es obligatoria').not().isEmpty(),
    check('start','Fecha de inicio es obligatoria').custom(isDate),
    check('end', 'Fecha de finalizacion es obligatoria').custom(isDate),
],validarCampos, crearEvento)

router.put('/:id', actualizarEvento);

router.delete('/:id', eliminarEvento);

module.exports = router;