import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { Activity } from '../../types/Activity'
import axiosInstance from '../../utils/axiosClient'
import Map from '../map/Map'

function ActivityDetails() {
    const params = useParams()
    const [activity,setActivity] = useState<Activity>()

    const fetchActivity = async () => {
        const response = await axiosInstance.get(`/activities/${params.id}`)
        setActivity(response.data.activity)
    }

    useEffect(()=>{
        fetchActivity()
    },[])

    if (!activity) return <div>loading ...</div>
  return (
    <div>
        id: {activity.id},
        title: {activity.title},
        category: {activity.category},
        city: {activity.city},
        date_time: {activity.date_time},
        max_participants: {activity.max_participants},
        location: <Map position={[activity.latitude,activity.longitude]} />
        host_id: {activity.host_id},
        joined: {activity.joined},
        participants: {activity.participants?.map(ele => <div> {ele.name} </div>)},
        host: {activity.host?.name},
    </div>
  )
}

export default ActivityDetails
