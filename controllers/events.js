const { response } = require('express');
const Evento = require('../models/Events');


const getEventos = async (req, res = response) => {

    //const {  email, password } = req.body;

    try {

        const eventos = await Evento.find().populate('user', 'name');

        res.json({
            msg: 'get events',
            ok: true,
            eventos
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'error !!! :(',

        })
    }
}

const crearEvento = async (req, res = response) => {
    console.log('body', req.body);

    const evento = new Evento(req.body);

    evento.user = req.uid;


    try {

        const eventoDB = await evento.save();

        if (eventoDB) {
            res.status(201).json({
                msg: 'registro guardado',
                ok: true,
                eventoDB
            });
        }

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'error !!! :(',

        })
    }

}


const actualizarEvento = async (req, res = response) => {

    const { id } = req.params;
    const { uid, name } = req;
    console.log('id', id);
    console.log('uid', uid);
    console.log('name', name);

    try {

        const evento = await Evento.findById(id);

        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'evento no existe por ese id'
            });
        }

        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de editar este evento'
            });
        }
        const nuevoEvento = {
            ...req.body,
            user: uid
        }
        const eventoActualizado = await Evento.findByIdAndUpdate(id, nuevoEvento, { new: true });

        res.json({
            msg: 'evento update',
            ok: true,
            eventoActualizado

        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'error !!! :(',

        })
    }


}

const eliminarEvento = async (req, res = response) => {

    const { id } = req.params;
    const { uid, name } = req;

    try {
        const evento = await Evento.findById(id);

        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'evento no existe por ese id'
            });
        }

        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de eliminar este evento'
            });
        }
       
        await Evento.findByIdAndDelete(id);

        res.json({
            msg: 'delete ok ',
            ok: true,
            //token

        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'error !!! :(',

        })
    }
}




    module.exports = {
        getEventos,
        crearEvento,
        actualizarEvento,
        eliminarEvento
    }