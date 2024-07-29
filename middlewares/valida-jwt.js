const { response } = require("express");
const jwt = require('jsonwebtoken');

const validaJWT = (req, res = response, next ) => {

    const token = req.header('x-token');
    console.log(token);

    if(!token){
        return res.status(401).json({
            ok:false,
            msg:'No hay token en la peticion'
        });
    } 
    try {
        // verifica el token 
        const {uid, name } = jwt.verify(token, process.env.JWT_SECRET);

        req.uid = uid;
        req.name = name;
        
        
    } catch (error) {
        return res.status(401).json({
            ok:false,
            msg:'Token no valido'
        });
        
    }
  

    // const url = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
    // const config = {
    //     headers: {
    //         'Authorization': `Bearer ${token}`
    //     }
    // };

    // fetch(url, config)
    //     .then(resp => resp.json())
    //     .then(data => {
    //         if (!data.ok) {
    //             localStorage.removeItem('token');
    //             window.location.href = 'index.html';
    //         }
    //     })
    //     .catch(error => {
    //         console.log(error);
    //         localStorage.removeItem('token');
    //         window.location.href = 'index.html';
    //     });
    next();
}


module.exports = {
    validaJWT
}