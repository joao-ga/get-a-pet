const mongoose = require('mongoose')

async function main() {
    await mongoose.connect("mongodb+srv://jbiazonferreira:vQGETdXLaAwX82kL@get-pet.s887is1.mongodb.net/?retryWrites=true&w=majority&appName=get-pet");
    console.log("Conectado ao banco");
}

main().catch((err)=> console.log(err))

module.exports = mongoose
