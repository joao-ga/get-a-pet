import { useState } from "react"
import formStyles from './Form.module.css'
import Input from "./Input"
import Select from "./Select"

function PetForm({handleSubmit, petData, btnText}) {
    const [pet, setPet] = useState(petData || {})
    const [preview, setPreview] = useState([])
    const colors = ["Branco", "Preto", "Cinza", "Caramelo", "Preto e Branco"]

    function onFileChange(e) {
        setPreview(Array.from(e.target.files))
        setPet({...pet, images: [...e.target.files]})
    }

    function handleChange(e) {
        setPet({...pet, [e.target.name]: e.target.value})
    }

    function handleColor(e) {
        setPet({...pet, color: e.target.options[e.target.selectedIndex].text})
    }

    function submit(e) {
        e.preventDefault()
        console.log(pet)
        console.log('Image URL:', `${process.env.REACT_APP_API}/images/pets/${pet.image[0]}`)
        handleSubmit(pet)
    }

    return(
        
        <form onSubmit={submit} className={formStyles.form_container}>
            <div className={formStyles.preview_pet_images}>
                {preview.length > 0
                    ? preview.map((image, index) =>(
                        <img src={URL.createObjectURL(image)} alt={pet.name} key={`${pet.name}+${index}`}/>
                    )) : pet.images && pet.images.map((image, index) =>(
                        <img src={`${process.env.REACT_APP_API}/images/pets/${image}`} alt={pet.name} key={`${pet.name}+${index}`}/>
                    ))
                }
            </div>
            <Input text="Imagens do Pet" type="file" name="images" handleOnChange={onFileChange} multiple />
            <Input text="Nome do Pet" type="text" name="name" handleOnChange={handleChange} placeholder="Digite o nome" value={pet.name || ''}/>
            <Input text="Idede do Pet" type="text" name="age" handleOnChange={handleChange} placeholder="Digite a idade" value={pet.age || ''}/>
            <Input text="Pesso do Pet" type="number" name="weight" handleOnChange={handleChange} placeholder="Digite o peso" value={pet.weight || ''}/>
            <Select name="color" text="Selecione a cor" options={colors} handleOnChange={handleColor} value={pet.color || ''} />
            <input type="submit" value={btnText} />
        </form>
    )
}

export default PetForm