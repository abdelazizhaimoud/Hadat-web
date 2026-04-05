import { Activity, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { Activity as BaseActivity } from '../../types/Activity'
import axiosInstance from '../../utils/axiosClient'
import { capitalize } from '../../utils/formats'
import { categories, status } from '../../constants/activity'

type Activity = Omit<BaseActivity, "created_at" | "updated_at" | "host" | "participants" | "joined_count" | "joined" | "host_id">
function EditActivity() {
    const params = useParams()
    const [activity,setActivity] = useState<Activity>({
        id: 0,
        title: "",
        category: "",
        location: "",
        date_time: "",
        max_participants: 0,
        status: "",
        hosted: false
    })
    const [loading,setLoading] = useState<boolean>(false)
    const [canEdit,setCanEdit] = useState<boolean>(false)
    const [isSubmiting,setIsSubmiting] = useState<boolean>(false)

    const fetchActivity = async () => {
        setLoading(true)
        const response = await axiosInstance.get(`/activities/${params.id}`)
        setActivity(response.data.activity)
        setLoading(false)
    }

    useEffect(()=>{
        fetchActivity()
    },[])

    useEffect(()=>{
        setCanEdit(activity?.hosted || false)
    },[activity])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name,value} = e.target
        setActivity({...activity,[name]: value})
    }
    const handleUpdate = async () => {
        setIsSubmiting(true)
        const response = await axiosInstance.put(`/activities/${activity.id}`,{activity: activity})
        setIsSubmiting(false)
    }

    if (loading) return <div>loading ...</div>

  return (
    !loading && canEdit ? 
    <>
    <div>
        <input type="text" name='title' value={activity.title} onChange={handleChange} />
        <select name="category" value={activity.category} onChange={handleChange}>
            {categories.map(cat => (
                <option key={cat} value={cat}>{capitalize(cat)}</option>
            ))}
        </select>
        <select name="status" value={activity.status} onChange={handleChange}>
            {status.map(sta => (
                <option key={sta} value={sta}>{capitalize(sta)}</option>
            ))}
        </select>
        <input type="text" name='location' value={activity.location} onChange={handleChange} />
        <input type="date" name='date_time' value={activity.date_time} onChange={handleChange} />
        <input type="number" name='max_participants' value={activity.max_participants} onChange={handleChange} />
    </div>
    <button disabled={isSubmiting} onClick={handleUpdate}>Update</button>
    </>
    :
    <div>
        you cannot edit this activity
    </div>
    )
}

export default EditActivity
