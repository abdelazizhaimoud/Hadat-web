import { Activity, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { Activity as BaseActivity } from '../../types/Activity'
import axiosInstance from '../../utils/axiosClient'
import { capitalize } from '../../utils/formats'
import { categories, status } from '../../constants/activity'
import Map from '../map/Map'

type Activity = Omit<BaseActivity, "created_at" | "updated_at" | "host" | "joined_count" | "joined" | "host_id" | "comments">
function EditActivity() {
    const params = useParams()
    const [activity,setActivity] = useState<Activity>({
        id: 0,
        title: "",
        category: "",
        city: "",
        date_time: "",
        latitude: 0.0,
        longitude: 0.0,
        max_participants: 0,
        status: "",
        hosted: false
    })
    const [loading,setLoading] = useState<boolean>(false)
    const [canEdit,setCanEdit] = useState<boolean>(false)
    const [isSubmiting,setIsSubmiting] = useState<boolean>(false)
    const [isRemoving, setIsRemoving] = useState<Record<number, boolean>>({})
    const [location,setLocation] = useState<[number,number]>([activity.latitude,activity.longitude])
    const [toggleMap,setToggleMap] = useState<boolean>(false)
    const fetchActivity = async () => {
        setLoading(true)
        const response = await axiosInstance.get(`/activities/${params.id}`)
        const fetchedActivity = response.data.activity
        setActivity(fetchedActivity)
        setLocation([fetchedActivity.latitude,fetchedActivity.longitude])
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
        if ((location[0] === activity.latitude && location[1] === activity.longitude) || toggleMap ){
            console.log("save a location first")
        }else{
            setIsSubmiting(true)
            const response = await axiosInstance.put(`/activities/${activity.id}`,{activity: {...activity,latitude: location[0],longitude: location[1]}})
            setIsSubmiting(false)
        }
    }
    const handleRemove = async (membreId: number, activityId: number) => {
        setIsRemoving((prev) => ({...prev,[membreId]: true}))
        const response = await axiosInstance.delete(`/activities/remove/${membreId}`,{params: {activityId: activityId}})
        setIsRemoving((prev) => ({...prev,[membreId]: false}))
        fetchActivity()
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
        <input type="text" name='city' value={activity.city} onChange={handleChange} />
        <input type="date" name='date_time' value={activity.date_time} onChange={handleChange} />
        <input type="number" name='max_participants' value={activity.max_participants} onChange={handleChange} /><br />
        <input type='button' onClick={() => setToggleMap((prev) => !prev)} value={toggleMap ? "Save" : "Change location"}></input> : <br />
        <div>{toggleMap ? <Map create={true} setLocation={setLocation} position={location} /> : void 0}</div>
        membres: <br />
        {activity.participants?.map((membre) => <div key={membre.id}><span>{membre.name}</span> <button disabled={isRemoving[membre.id]} onClick={() => handleRemove(membre.id,activity.id)}>remove</button><br /></div>)} 
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
