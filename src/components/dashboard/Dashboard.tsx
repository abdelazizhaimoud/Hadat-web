import { useEffect, useState } from 'react'
import axiosInstance from '../../utils/axiosClient'
import type { Activity } from '../../types/Activity'
import HomeFeedCard from '../home/HomeFeedCard'


function Dashboard() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [filter, setFilter] = useState<string>("hosted")


  const fetchUserActivities = async() => {
    try{
      const response = await axiosInstance.get('/activities/me', {
        params: {filter}
      })
      setActivities(response.data.activities)
    }catch(error){
      console.log(error)
    }
  }
  useEffect(()=>{
    fetchUserActivities()
  },[filter])
  return (
    <div>
        <select name="filter" onChange={(e) => setFilter(e.target.value)}>
          <option value="hosted" selected={true}>Hosted</option>
          <option value="membre">Membre</option>
          <option value="both">Both</option>
        </select>
        <div>
          {activities.map(act => <HomeFeedCard refresh={fetchUserActivities} activity={act} />)}
        </div>
    </div>
  )
}

export default Dashboard
