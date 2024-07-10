// api
import api from '../utils/api'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useFlashMessage from './useFlashMessage'

export default function useAuth() {
    const [authenticated, setAuthenticated] = useState(false)
    const { setFlashMessage } = useFlashMessage()
    const navigate = useNavigate()

    useEffect(()=> {
        const token = localStorage.getItem('token')

        if(token) {
            api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`
            setAuthenticated(true)
        }
    }, [])

    async function register(user) {
        let msgText = 'Cadastro realizado com sucesso!'
        let msgType = 'success'

        try {
            const response = await api.post('/users/register', user)
            const data = response.data

            await authUser(data)
        } catch (e) {
            msgText = e.response?.data?.message || 'Erro ao realizar o cadastro'
            msgType = 'error'
        }

        setFlashMessage(msgText, msgType)
    }

    async function authUser(data) {
        if (!data) {
            console.error('Nenhum dado recebido para autenticação')
            return
        }

        setAuthenticated(true)
        localStorage.setItem('token', JSON.stringify(data.token))
        navigate('/')
    }

    return { authenticated, register }
}
