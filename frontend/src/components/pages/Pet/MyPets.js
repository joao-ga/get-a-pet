import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import RoundedImage from '../../layout/RoundedImage'
import useFlashMessage from '../../../hooks/useFlashMessage'
import api from '../../../utils/api'
import styles from './Dashboards.module.css'

function MyPets() {
    const [pets, setPets] = useState([])
    const [token] = useState(localStorage.getItem('token') || '') 
    const {setFlashMessage} = useFlashMessage()

    useEffect(()=>{
        api.get('/pets/mypets', {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
            }
        })
        .then((response)=>{
            setPets(response.data.pets)
            console.log(`${process.env.REACT_APP_API}/image/pets/${response.data.pets[0].image[0]}`)
            
        })
        
    }, [token])


    async function reomovePet(id) {
        let msgType = 'success'

        const data = await api.delete(`/pets/${id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
            }
        })
        .then((response) => {
            const updatedPets = pets.filter((pet) => pet._id  !== id)
            setPets(updatedPets)
            return response.data
        })
        .catch((err)=>{
            msgType = 'error'
            return err.response.data
        })

        setFlashMessage(data.message, msgType)
    }

    return(
        <section>
            <div className={styles.petslist_header}>
                <h1>Meus Pets</h1>
                <Link to="/pet/add">Cadastrar Pet</Link>
            </div>
            <div className={styles.petslist_container}>
                {pets.length > 0 &&                
                    pets.map((pet)=>(                        
                        <div key={pet._id} className={styles.petlist_row}>
                            <RoundedImage 
                                src={`${process.env.REACT_APP_API}/images/pets/${pet.image[0]}`} 
                                alt={pet.name} 
                                width='75px'
                            />
                            <span className="bold">{pet.name}</span>
                            <div className={styles.actions}>
                                {pet.available ? (
                                    <>
                                        {pet.adopter && (
                                            <button>Concluir adoção</button>
                                        )}
                                        <Link to={`/pet/edit/${pet._id}`}>Editar</Link>
                                        <button onClick={() => {
                                            reomovePet(pet._id)
                                        }} className={styles.conclude_btn}>Excluir</button>
                                    </>
                                ) : (
                                    <p>Pet já adotado</p>
                                )}
                            </div>
                            
                        </div>
                    )) 
                }                
                {pets.length === 0 && <p>Não há Pets cadastrados</p>}
            </div>
        </section>
    )
}

export default MyPets