import { useState, useEffect } from 'react'
import { useAppDispatch } from '../../app/hooks'
import axiosInstance from '../../utils/axiosClient'
import { logout, setUser } from '../../features/auth/authSlice'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'

function ProtectedRoute() {
    const [loading,setLoading] = useState<boolean>(true)
    const [isAuth,setIsAuth] = useState<boolean>(false)
    const dispatch = useAppDispatch()
    const location = useLocation()
    const navigate = useNavigate()

    const getUser = async () => {
        const response = await axiosInstance.get('/user')
        return response.data
    }

    useEffect(() => {
    const loadUser = async () => {
        try {
            console.log('fetched user')
            const user = await getUser();
            localStorage.setItem("user", JSON.stringify(user));
            dispatch(setUser(user))
            setIsAuth(true)
            if (location.pathname === '/login' || location.pathname === '/singup'){
                navigate('/home')
            }
        } 
        catch (error) {
            console.log('no user')
        }
        setLoading(false)
    };

    loadUser();
    }, []);

    useEffect(()=>{
        const handleUnauthorizedEvent = () => {
            console.log('received event')
            dispatch(logout())
            setIsAuth(false)
        }
        
        const handleLoggedEvent = () => {
            setIsAuth(true)
            console.log('received event')
            navigate('/home')
        }

        window.addEventListener('unauthorized', handleUnauthorizedEvent)
        window.addEventListener('logged', handleLoggedEvent)

        return () => {
            window.removeEventListener('unauthorized', handleUnauthorizedEvent)
            window.removeEventListener('logged', handleLoggedEvent)
        }
    },[])

    if (loading) return <span>Loading ...</span>
    if (!isAuth && location.pathname !== '/login' && location.pathname !== '/signup') return <Navigate to='/login' replace />
    return <Outlet />
}

export default ProtectedRoute
