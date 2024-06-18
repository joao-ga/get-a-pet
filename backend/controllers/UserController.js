const createUserToken = require('../helpers/createUserToken')
const getToken = require('../helpers/getToken')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = class UserController {
    static async register(req, res) {
        const { name, email, phone, password, confirmPassword } = req.body

        //validations
        if(!name) {
            res.status(422).json({message: "O nome é obrigatório"})
            return
        }
        if(!email) {
            res.status(422).json({message: "O e-mail é obrigatório"})
            return
        }
        if(!phone) {
            res.status(422).json({message: "O telefone é obrigatório"})
            return
        }
        if(!password) {
            res.status(422).json({message: "A senha é obrigatória"})
            return
        }
        if(!confirmPassword) {
            res.status(422).json({message: "A confirmação de senha é obrigatória"})
            return
        }

        // password validation
        if(password !== confirmPassword) {
            res
                .status(422)
                .json({
                    message: "A senha e a confirmação de senha precisam ser iguais!"
                })
            return
        }

        // user exist validation
        const userExist = await User.findOne({email: email})
        if(userExist) {
            res.status(422).json({message: "Por favor utilize outro e-mail!"})
            return
        }

        // decrypt password
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        // create user
        const user = new User({
            name: name,
            email: email,
            phone: phone,
            password: passwordHash,
        })

        try {
            // save user in db
            const newUser = await user.save()

            await createUserToken(newUser, req, res)

        } catch(e) {
            res.status(500).json({message: "Erro interno"})
            console.log(e)
        }
    }

    static async login(req, res) {
        const { email, password } = req.body

        // fields validation
        if(!email) {
            res.status(422).json({message: "O e-mail é obrigatório"})
            return
        }

        if(!password) {
            res.status(422).json({message: "A senha é obrigatória"})
            return
        }

        // user exist validation
        const user = await User.findOne({email: email})
        if(!user) {
            res.status(422).json({message: "Por favor utilize um e-mail existente!"})
            return
        }

        // check if password match with db password
        const checkPassword = await bcrypt.compare(password, user.password)

        if(!checkPassword) {
            res.status(422).json({message: "Senha inválida!"})
            return
        }

        await createUserToken(user, req, res)
    }

    static async checkUser(req, res) {

        let currentUser

        if(req.headers.authorization) {

            const token = getToken(req)
            const decoded = jwt.verify(token, 'nossoscret')

            currentUser = await User.findById(decoded.id)

            currentUser.password = undefined

        } else {
            currentUser = null
        }

        res.status(200).send(currentUser)
    }
}