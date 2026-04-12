import { useCallback, useEffect } from 'react'
import axiosInstance from '../../utils/axiosClient'
import type { Activity } from '../../types/Activity'
import HomeFeedCard from '../home/HomeFeedCard'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { setDashboardActivities, setFilter } from '../../features/activities/activitiesSlice'


function Dashboard() {
  const dispatch = useAppDispatch()
  const storeDashboardActivities = useAppSelector((state) => state.activities.dashboard)
  const activities: Activity[] = storeDashboardActivities ?? []
  const filter = useAppSelector((state) => state.activities.filter)

  const fetchUserActivities = useCallback(async() => {
    try{
      const response = await axiosInstance.get('/activities/me', {
        params: {filter}
      })
      dispatch(setDashboardActivities(response.data.activities))
    }catch(error){
      console.log(error)
    }
  }, [dispatch, filter])
  useEffect(() => {
    if (storeDashboardActivities === null) {
            void fetchUserActivities()
    }
    },[fetchUserActivities, storeDashboardActivities])

  return (
    <div>
        <select name="filter" value={filter} onChange={(e) => dispatch(setFilter(e.target.value))}>
          <option value="hosted">Hosted</option>
          <option value="membre">Membre</option>
          <option value="both">Both</option>
        </select>
        <div>
          {activities.map(act => <HomeFeedCard key={act.id} refresh={fetchUserActivities} activity={act} />)}
        </div>
    </div>
  )
}

export default Dashboard
