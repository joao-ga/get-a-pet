const jwt = require('jsonwebtoken')

const User = require('../models/User')

// get user by token 

const getUserByToken = async (token) => {

    if(!token) {
        return res.status(401).json({message: "Acesso negado."})
    }

    const decoded = jwt.verify(token, "nossoscret")

    const userId = decoded.id

    const user = await User.findById(userId)

    return user

}

module.exports = getUserByToken