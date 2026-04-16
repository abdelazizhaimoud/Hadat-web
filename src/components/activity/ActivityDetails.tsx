import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { Activity } from '../../types/Activity'
import axiosInstance from '../../utils/axiosClient'
import Map from '../map/Map'
import ParticipantsList from '../ui/ParticipantsList'
import InfoRow from '../ui/InfoRow'
import StatusBadge from '../ui/StatusBadge'

function ActivityDetails() {
    const params = useParams()
    const [activity,setActivity] = useState<Activity>()
    const [loading,setLoading] = useState<boolean>(true)

    useEffect(()=>{
        const fetchActivity = async () => {
          setLoading(true)
          try {
            const response = await axiosInstance.get(`/activities/${params.id}`)
            setActivity(response.data.activity)
          } finally {
            setLoading(false)
          }
        }

        void fetchActivity()
    },[params.id])

    if (loading || !activity) {
      return (
        <section className='activity-page'>
          <div className='activity-shell activity-shell--compact'>
            <div className='activity-state activity-state--loading'>Loading activity...</div>
          </div>
        </section>
      )
    }
  return (
    <section className='activity-page'>
      <div className='activity-shell'>
        <article className='activity-details'>
          <header className='activity-details__header'>
            <div>
              <p className='activity-hero__eyebrow'>Activity details</p>
              <h1 className='activity-details__title'>{activity.title}</h1>
            </div>
            <StatusBadge status={activity.status} baseClassName='activity-status' />
          </header>

          <div className='activity-details__grid'>
            <div className='activity-details__card'>
              <InfoRow label='Category' value={activity.category} />
              <InfoRow label='City' value={activity.city} />
              <InfoRow label='Date and time' value={activity.date_time} />
              <InfoRow label='Participants' value={`${activity.joined_count} / ${activity.max_participants}`} />
              <InfoRow label='Host' value={activity.host?.name ?? 'Unknown'} />
            </div>

            <div className='activity-map-panel activity-map-panel--accent'>
              <Map position={[activity.latitude,activity.longitude]} />
            </div>
          </div>

          <section className='activity-participants activity-panel activity-panel--participants'>
            <h2 className='activity-panel__title'>Participants</h2>
            {activity.participants && activity.participants.length > 0 ? (
              <ParticipantsList
                participants={activity.participants}
                listClassName='activity-participants__list--details'
              />
            ) : (
              <div className='activity-state'>No participants yet.</div>
            )}
          </section>
        </article>
      </div>
    </section>
  )
}

export default ActivityDetails
