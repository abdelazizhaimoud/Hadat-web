import { useState } from 'react'
import axiosInstance from '../../utils/axiosClient'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useAppDispatch } from '../../app/hooks'
import { setUser, setToken } from '../../features/auth/authSlice'

interface Credentials {
    email: string,
    password: string
}

function Login() {
    const [credentials, setCredentials] = useState<Credentials>({email:"",password:""})
    const [disabledSubmit, setDisabledSubmit] = useState<boolean>(false)
    const dispatch = useAppDispatch()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name,value} = e.target
        setCredentials((prev)=> ({
            ...prev,
            [name]: value
        }))

    }
const handleLogin = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    setDisabledSubmit(true)
    try{
        const response = await axiosInstance.post('/login',credentials);

        if(response.status == 200){
            const token = response.data.token
            const user = response.data.user
            localStorage.setItem('auth-token',token)
            localStorage.setItem('user',JSON.stringify(user))
            dispatch(setUser(user))
            dispatch(setToken(token))
            console.log('logged in')
            window.dispatchEvent(new Event('logged'))
        }
    }catch(error){
        if(axios.isAxiosError(error)){
            if(error.response){
                switch(error.response.status){
                    case 422:
                        console.log('validation error')
                        break
                    case 401:
                        console.log('wrong credentials')
                        break
                    case 403:
                        console.log('access forbidden.')
                        break
                    default:
                        console.log("unexpected error occurred.")
                }
            }else{
                console.log('failed to connect to the server.')
            }
        }else{
            console.log('non-axios error.')
        }
    }finally{
        setDisabledSubmit(false)
    }
}
  return (
    <form className='auth-form' onSubmit={handleLogin}>
        <h1 className='auth-title'>Login</h1>

        <div className='auth-field'>
            <label className='auth-label' htmlFor='login-email'>Email</label>
            <input
                id='login-email'
                className='auth-input'
                type='email'
                name='email'
                value={credentials.email}
                onChange={handleChange}
                autoComplete='email'
                required
            />
        </div>

        <div className='auth-field'>
            <label className='auth-label' htmlFor='login-password'>Password</label>
            <input
                id='login-password'
                className='auth-input'
                type='password'
                name='password'
                value={credentials.password}
                onChange={handleChange}
                autoComplete='current-password'
                required
            />
        </div>

        <div className='auth-actions'>
            <button
                className='auth-button auth-button--primary'
                type='submit'
                disabled={disabledSubmit}
            >
                Login
            </button>

            <div className='auth-meta'>
                you don't have an account?{' '}
                <Link className='auth-link' to='/signup'>
                    create one!
                </Link>
            </div>
        </div>
    </form>
  )
}

export default Login
