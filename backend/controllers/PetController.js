const Pet = require("../models/Pet")

//helper
const getToken = require('../helpers/getToken')
const getUserByToken = require('../helpers/getUserByToken')
const ObjectId  = require('mongoose').Types.ObjectId

module.exports = class PetController {
    // create a pet 
    static async create(req, res){
        
        const { name, age, weight, color }  = req.body

        const available = true

        const images = req.files


        //validations
        if(!name)  {
            res.status(422).json({message: "O nome é obrigatório!"})
            return
        }
        if(!age)  {
            res.status(422).json({message: "A idade é obrigatória!"})
            return
        }
        if(!weight)  {
            res.status(422).json({message: "O peso é obrigatório!"})
            return
        }
        if(!color)  {
            res.status(422).json({message: "A cor é obrigatória!"})
            return
        }

        if(images.length === 0)  {
            res.status(422).json({message: "A imagem é obrigatória!"})
            return
        }

        // get pet owner
        const token = getToken(req)
        const user = await getUserByToken(token)

        // create a pet
        const pet = new Pet({
            name,
            age,
            weight, 
            color,
            image: [],
            user: {
                _id: user._id,
                name: user.name,
                image: user.image,
                phone: user.phone,
            }
        })

        images.map((image)=>{
            pet.image.push(image.filename)
        })

        try {

            const newPet =  await pet.save()
            res.status(201).json({message: 'Pet cadastrado com suceso',
                newPet
            })

        } catch(e)  {
            res.status(500).json({message: e})
        }

    }

    static async getAll(req, res) {

        const pets = await Pet.find().sort('createdAt')

        res.status(200).json({pets: pets})

    }

    static async getAllUserPets(req, res) {

        // get user from token
        const token = getToken(req)
        const user =  getUserByToken(token)

        const pets = await Pet.find({ 'user._id:': user._id }).sort('createdAt')

        res.status(200).json({pets: pets})
    }

    static async getAllUserAdoptions(req, res) {
        // get user from token
        const token = getToken(req)
        const user =  await getUserByToken(token)

        const pets = await Pet.find({ 'adopter._id': user._id }).sort('createdAt')
        
        res.status(200).json({pets: pets})
    }

    static async getPetById(req, res) {
        const id = req.params.id 

        if(!ObjectId.isValid(id)) {
            res.status(422).json({message: "Id  inválido"})
            return
        }

        // check if pet exits
        try  {
            const pet = await Pet.findOne({_id: id})

            if(!pet) {
                res.status(404).json({message: "Pet não encontrado"})
                return
            }

            res.status(200).json({pet:pet})
            
        }  catch (e) {

            res.status(500).json({message: e})
        }
        
    }

    static async removePetById(req, res) {

        const id = req.params.id

        // checck if id is valid
        if(!ObjectId.isValid(id)) {
            res.status(422).json({message: 'ID inválido'})
            return
        }

        //check if pet exist
        const pet = await Pet.findOne({_id: id})

        if(!pet) {
            res.status(404).json({message: "Pet não encontrado"})
            return
        }

        // check if logged inn user registered the pet
        const token = getToken(req)
        const user = await getUserByToken(token)

        if(pet.user._id.toString() !== user._id.toString()) {

            res.status(422).json({message: 'Houve um problema em processar a sua solicitação, tente novamente mais tarde! '})
            return

        }

        try {

            await Pet.findByIdAndDelete(id)

            res.status(200).json({message: "Pet removido com suecesso"})

        } catch(e) {

            res.status(500).json({message: e})

        }

    }

    static async updatePet(req, res) {
        const id  = req.params.id 

        const { name, age, weight, color, available }  = req.body

        const images = req.files

        const updatedData = {}

        //checck if pet exists
        const pet = await Pet.findOne({_id: id})

        if(!pet) {
            res.status(404).json({message: "Pet não encontrado"})
            return
        }

        // check if logged inn user registered the pet
        const token = getToken(req)
        const user = await getUserByToken(token)
        
        if(pet.user._id.toString() !== user._id.toString()) {
        
            res.status(422).json({message: 'Houve um problema em processar a sua solicitação, tente novamente mais tarde! '})
            return
        
        }
        //validations
        if(!name)  {
            res.status(422).json({message: "O nome é obrigatório!"})
            return
        } else {
            updatedData.name = name
        }
        if(!age)  {
            res.status(422).json({message: "A idade é obrigatória!"})
            return
        } else {
            updatedData.age = age
        }
        if(!weight)  {
            res.status(422).json({message: "O peso é obrigatório!"})
            return
        } else {
            updatedData.weight = weight
        }
        if(!color)  {
            res.status(422).json({message: "A cor é obrigatória!"})
            return
        } else {
            updatedData.color = color
        }
        
        if(images.length === 0)  {
            res.status(422).json({message: "A imagem é obrigatória!"})
            return
        } else {
            updatedData.images = []
            images.map((image)=> {
                updatedData.images.push(image.filename)
            })
        }

        try {
            await Pet.findByIdAndUpdate(id, updatedData)

            res.status(200).json({message: 'Pet atualizado com sucesso!'})
        } catch (e) {

            res.status(500).json({message: e})

        }


    }

    static async schedule(req, res)  {

        const id = req.params.id

        //checck if pet exists
        const pet = await Pet.findOne({_id: id})

        if(!pet) {
            res.status(404).json({message: "Pet não encontrado"})
            return
        } 

        // check if logged inn user registered the pet
        const token = getToken(req)
        const user = await getUserByToken(token)
         
        if(pet.user._id.equals(user._id)) {
         
            res.status(422).json({message: 'Você não pode agendar uma visita com o seu própio pet! '})
            return
         
        }

        // check if user has already scheduled a visit
        if(pet.adopter) {
            if(pet.adopter._id.equals(user._id))  {
                res.status(422).json({message: 'Você já agendou uma visita a esse pet! '})
                return
            }
        }

        // add user to pet
        pet.adopter = {
            _id: user._id,
            name: user.name,
            image:  user.image
        }
        
        try {

            await Pet.findByIdAndUpdate(id, pet)

            res.status(200).json({message: `A visita foi agendada com suceso, entre em contato com ${pet.user.name} pelo teefone ${pet.user.phone}`})

        } catch(e) {

            res.status(500).json({message: e})

        }
        
    }

    static async concludeAdoption(req, res) {

        const id = req.params.id

        //checck if pet exists
        const pet = await Pet.findOne({_id: id})

        if(!pet) {
            res.status(404).json({message: "Pet não encontrado"})
            return
        } 


        // check if logged inn user registered the pet
        const token = getToken(req)
        const user = await getUserByToken(token)
        
        if(pet.user._id.toString() !== user._id.toString()) {
        
            res.status(422).json({message: 'Houve um problema em processar a sua solicitação, tente novamente mais tarde! '})
            return
        
        }

        pet.available = false

        try {

            await Pet.findByIdAndUpdate(id, pet)

            res.status(200).json({message: 'Parabéns! O ciclo de adoção foi finalizado com sucesso!'})


        } catch(e) {

            res.status(500).json({message: e})

        }



    }
}