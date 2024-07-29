const { response } = require('express');
const Usuario = require('../models/Usuario')
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async(req, res = response) => {

    // let usuario = new Usuario(req.body);

    try {
        const { email, password } = req.body;

       let  usuario = await Usuario.findOne({ email });
        console.log('query ',usuario);
    
        if(usuario){
            return res.status(400).json({
                ok: false,
                msg: 'el usuario ya existe'
            })
        }
        usuario = new Usuario(req.body);
        //encriptar password
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);


        await usuario.save();

        const token = await generarJWT(usuario.id, usuario.name)
    
        if (req.body) {
            res.status(201).json({
                msg: 'registro',
                ok: true,
                uid: usuario.id,
                name: usuario.name,
                token
            });
        }
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'error !!! :(',

        })
    }

}

const loginUsuario = async(req, res = response) => {

    const {  email, password } = req.body;

    try {
        let  usuario = await Usuario.findOne({ email });
        console.log('query ',usuario);
    
        if(!usuario){
            return res.status(400).json({
                ok: false,
                msg: 'el usuario no existe :('
            })
        }

        // confirmar password
        const validPassword = bcrypt.compareSync(password, usuario.password);

        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'password incorrecto :('
            })
        }

        // generar token 

       const token = await generarJWT(usuario.id, usuario.name)


        res.json({
            msg: 'login',
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'error !!! :(',

        })
    }

   
}

const renewToken = async(req, res = response) => {
    const { uid, name } = req;

    // generar nuevo token
    const token = await generarJWT(uid, name);

    res.json({
        msg: 'renew',
        token

    });
}



module.exports = {
    crearUsuario,
    loginUsuario,
    renewToken
}