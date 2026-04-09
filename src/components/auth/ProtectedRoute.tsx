import React, { useState, useEffect } from 'react'
import { useAppDispatch } from '../../app/hooks'
import axiosInstance from '../../utils/axiosClient'
import { logout, setUser } from '../../features/auth/authSlice'
import { Navigate, Outlet } from 'react-router-dom'

function ProtectedRoute() {
    const [loading,setLoading] = useState<boolean>(true)
    const [isAuth,setIsAuth] = useState<boolean>(false)
    const userStorage = localStorage.getItem('user')
    const dispatch = useAppDispatch()

    const getUser = async () => {
        const response = await axiosInstance.get('/user')
        return response.data
    }

    useEffect(() => {
    const loadUser = async () => {
        if (userStorage){
            console.log('storage user')
            const parsedUser = JSON.parse(userStorage)
            dispatch(setUser(parsedUser))
            setIsAuth(true)
            setLoading(false)
            return
        }

        try {
            console.log('fetched user')
            const user = await getUser();
            localStorage.setItem("user", JSON.stringify(user));
            dispatch(setUser(user))
            setIsAuth(true)
        } 
        catch (error) {
            console.log('no user')
            localStorage.removeItem("user");
            localStorage.removeItem("auth-token");
            dispatch(logout());
        }
        setLoading(false)
    };

    loadUser();
    }, []);

    if (loading) return <span>Loading ...</span>
    if (!isAuth) return <Navigate to='/login' replace />
    return <Outlet />
}

export default ProtectedRoute
