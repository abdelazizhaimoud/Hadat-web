import { useEffect, useState } from "react"
import type { User as BaseUser } from "../../types/User"
import axiosInstance from "../../utils/axiosClient"


type User = Omit<BaseUser, "id" | "avatar">
function Profile() {
    const [User,setUser] = useState<User>({
        name: "",
        email: "",
        bio: ""
    })
    const [isEditing,setIsEditing] = useState<boolean>(false)

    const fetchUser = async () => {
        const response = await axiosInstance.get('/user')
        console.log(response)
        setUser(response.data)
    }

    useEffect(()=>{
        fetchUser()
    },[])


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name,value} = e.target
        setUser((prev) => ({...prev, [name]: value}))

    }

    const handleProfileUpdate = async () => {
        const response = await axiosInstance.put('/user/update',User)
    }

    if (!User) return <span>Loading ...</span>
  return (
    <>
        {isEditing && <button onClick={() => [handleProfileUpdate(),setIsEditing((prev) => !prev)]}>Update</button>}
        {!isEditing && <button onClick={() => setIsEditing((prev) => !prev)}>Edit</button>}
        {!isEditing && <div>
            <span>name: {User.name}</span><br />
            <span>email: {User.email}</span><br />
            <span>bio: {User.bio}</span><br />
        </div>}

        {isEditing && <div>
            name: <input type="text" name="name" value={User.name} onChange={handleChange}/>
            email: <input type="text" name="email" value={User.email} onChange={handleChange}/>
            bio: <input type="text" name="bio" value={User.bio || ""} onChange={handleChange}/>
        </div>}
    </>
  )
}

export default Profile
