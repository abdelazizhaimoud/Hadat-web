import React, { useState } from 'react'
import axiosInstance from '../../utils/axiosClient'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

interface Data{
    name: string,
    email: string,
    password: string,
}

function SignUp() {
    const [data, setData] = useState<Data>({name: "", email: "", password: ""})
    const [disabledSubmit, setDisabledSubmit] = useState<boolean>(false)
    const navigate = useNavigate()



    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name,value} = e.target
        setData({...data,[name]: value})
    }

    const handleSubmit = async(e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        setDisabledSubmit(true)

        try{
            const response = await axiosInstance.post('/signup', data)
            if (response.status == 201){
                console.log('user signed up successfully !')
                const token = response.data.token
                localStorage.setItem('auth-token',token)
                navigate('/home')
            }
        }catch (error){
            if (axios.isAxiosError(error)){
                if (error.response){
                    switch(error.response.status){
                        case 422:
                            console.log('validation error')
                            break
                        case 409:
                            console.log('duplicate field')
                            break
                        default:
                            console.log('an error occurred .')
                    }
                }else{
                    console.log('no response.')
                }
            }else{
                console.log('non-axios error.')
            }
        }finally{
            setDisabledSubmit(false)
        }
    }
  return (
    <form onSubmit={handleSubmit}>
        <div>name : </div><input type="text" name="name"  value={data.name} onChange={handleChange}/><br />
        <div>email : </div><input type="email" name="email"  value={data.email} onChange={handleChange}/><br />
        <div>password : </div><input type="password" name="password"  value={data.password} onChange={handleChange}/><br />
        <button type='submit' disabled={disabledSubmit}>Sign up</button>
    </form>
  )
}

export default SignUp
