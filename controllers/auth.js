const { response } = require('express');
const Usuario = require('../models/Usuario')
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const { sendPasswordResetEmail } = require('../helpers/email');
const crypto = require('crypto');

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

const forgotPassword = async(req, res = response) => {
    const { email } = req.body;

    try {
        console.log('Buscando usuario con email:', email);
        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe un usuario con ese email'
            });
        }

        console.log('Usuario encontrado, generando token...');
        // Generar token de recuperación
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // 1 hora

        // Guardar token en el usuario
        usuario.resetPasswordToken = resetToken;
        usuario.resetPasswordExpires = resetTokenExpiry;
        await usuario.save();
        console.log('Token guardado en BD');

        // Enviar email real
        try {
            await sendPasswordResetEmail(email, resetToken);
            console.log('Email enviado correctamente');
        } catch (emailError) {
            console.log('Error enviando email:', emailError.message);
            // Continuar aunque falle el email
        }

        res.json({
            ok: true,
            msg: 'Correo de recuperación enviado'
        });

    } catch (error) {
        console.log('Error completo:', error);
        res.status(500).json({
            ok: false,
            msg: 'Error al procesar solicitud: ' + error.message
        });
    }
}

const resetPassword = async(req, res = response) => {
    const { token, newPassword } = req.body;

    try {
        const usuario = await Usuario.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Token inválido o expirado'
            });
        }

        // Encriptar nueva contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(newPassword, salt);
        
        // Limpiar tokens de reset
        usuario.resetPasswordToken = undefined;
        usuario.resetPasswordExpires = undefined;
        
        await usuario.save();

        res.json({
            ok: true,
            msg: 'Contraseña actualizada correctamente'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al actualizar contraseña'
        });
    }
}

module.exports = {
    crearUsuario,
    loginUsuario,
    renewToken,
    forgotPassword,
    resetPassword
}