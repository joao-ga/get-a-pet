const jwt = require('jsonwebtoken')
const getToken = require('../helpers/getToken')

// midleware to validate token
const checkToken = (req, res, next) => {

    if(!req.headers.authorization) {
        return res.status(401).json({message: "Acesso negado."})
    }

    const token = getToken(req)

    if(!token) {
        return res.status(401).json({message: "Acesso negado."})
    }

    try{

        const verified = jwt.verify(token, "nossoscret")
        req.user = verified
        next()


    } catch(e) {
        return res.status(401).json({message: "Token inválido"})

    }


}

module.exports = checkToken