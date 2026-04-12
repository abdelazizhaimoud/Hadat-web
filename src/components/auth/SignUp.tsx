import React, { useState } from 'react'
import axiosInstance from '../../utils/axiosClient'
import axios from 'axios'
import { Link } from 'react-router-dom'
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
                const user = response.data.user
                localStorage.setItem('auth-token',token)
                localStorage.setItem('user',user)
                window.dispatchEvent(new Event('logged'))
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
    <form className='auth-form' onSubmit={handleSubmit}>
        <h1 className='auth-title'>Sign up</h1>

        <div className='auth-field'>
            <label className='auth-label' htmlFor='signup-name'>Name</label>
            <input
                id='signup-name'
                className='auth-input'
                type='text'
                name='name'
                value={data.name}
                onChange={handleChange}
                autoComplete='name'
                required
            />
        </div>

        <div className='auth-field'>
            <label className='auth-label' htmlFor='signup-email'>Email</label>
            <input
                id='signup-email'
                className='auth-input'
                type='email'
                name='email'
                value={data.email}
                onChange={handleChange}
                autoComplete='email'
                required
            />
        </div>

        <div className='auth-field'>
            <label className='auth-label' htmlFor='signup-password'>Password</label>
            <input
                id='signup-password'
                className='auth-input'
                type='password'
                name='password'
                value={data.password}
                onChange={handleChange}
                autoComplete='new-password'
                required
            />
        </div>

        <div className='auth-actions'>
            <button
                className='auth-button auth-button--primary'
                type='submit'
                disabled={disabledSubmit}
            >
                Sign up
            </button>

            <div className='auth-meta'>
                already have an account?{' '}
                <Link className='auth-link' to='/login'>
                    login
                </Link>
            </div>
        </div>
    </form>
  )
}

export default SignUp
