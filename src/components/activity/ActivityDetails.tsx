import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { Activity } from '../../types/Activity'
import axiosInstance from '../../utils/axiosClient'

function ActivityDetails() {
    const params = useParams()
    const [Activity,setActivity] = useState<Activity>()

    const fetchActivity = async () => {
        const response = await axiosInstance.get(`/activities/${params.id}`)
        setActivity(response.data.activity)
    }

    useEffect(()=>{
        fetchActivity()
    },[])

    if (!Activity) return <div>loading ...</div>
  return (
    <div>
        id: {Activity.id},
        title: {Activity.title},
        category: {Activity.category},
        city: {Activity.city},
        date_time: {Activity.date_time},
        max_participants: {Activity.max_participants},
        host_id: {Activity.host_id},
        joined: {Activity.joined},
        participants: {Activity.participants?.map(ele => <div> {ele.name} </div>)},
        host: {Activity.host?.name},
    </div>
  )
}

export default ActivityDetails
