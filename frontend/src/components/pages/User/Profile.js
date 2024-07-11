import styles from './Profile.module.css'
import formStyles from  '../../form/Form.module.css'
import Input from '../../form/Input'
import { useState, useEffect } from 'react'

function Profile() {
    const [user, setUser] = useState({})

    function onFileChange(e) {

    }

    function handleChange(e) {

    }

    return(
        <section>
            <div className={styles.profile_header}>
                <h1>Perfil</h1>
                <p>Preview Imagem</p>
            </div>
            <form className={formStyles.form_container}>
                <Input text="imagem" type="file" name="image" handleOnChange={onFileChange} />
                <Input text="E-mail" type="email" name="email" placeholder="Digite o seu e-mail"  handleOnChange={handleChange} value={user.email || ''} />
                <Input text="Nome" type="text" name="name" placeholder="Digite o seu nome" handleOnChange={handleChange} value={user.name || ''}/>
                <Input text="Telefone" type="text" name="phone" placeholder="Digite o seu telefone" handleOnChange={handleChange} value={user.phone || ''}/>
                <Input text="Senha" type="password" name="password" placeholder="Digite o sua senha" handleOnChange={handleChange} />
                <Input text="Confirmação de Senha" type="password" name="confirmPassword" placeholder="Confirme sua senha" handleOnChange={handleChange} />
                <input type="submit" value="editar" />
            </form>
        </section>
    )
}

export default Profile