import { useEffect } from 'react'
import axiosInstance from '../../utils/axiosClient'
import Header from '../home/Header'

function Logout() {
  const handleLogout = async () => {
    try{
      const response = await axiosInstance.post('/logout')
      if (response.status == 200){
        console.log(response.data.message)
      }
    }catch (error){
      console.log(error)
    }finally{
      localStorage.removeItem('auth-token')
      localStorage.removeItem('user')
      window.dispatchEvent(new Event('unauthorized'))
    }
  }
  useEffect(()=>{
    handleLogout()
  },[])
  return (
    <div>
        <Header></Header>
      logging out .....
    </div>
  )
}

export default Logout
