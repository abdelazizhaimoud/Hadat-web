import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { Activity } from '../../types/Activity'
import axiosInstance from '../../utils/axiosClient'
import Map from '../map/Map'

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
            <span className={`activity-status activity-status--${activity.status}`}>
              {activity.status}
            </span>
          </header>

          <div className='activity-details__grid'>
            <div className='activity-details__card'>
              <div className='activity-details__row'>
                <span className='activity-details__label'>Category</span>
                <span className='activity-details__value'>{activity.category}</span>
              </div>
              <div className='activity-details__row'>
                <span className='activity-details__label'>City</span>
                <span className='activity-details__value'>{activity.city}</span>
              </div>
              <div className='activity-details__row'>
                <span className='activity-details__label'>Date and time</span>
                <span className='activity-details__value'>{activity.date_time}</span>
              </div>
              <div className='activity-details__row'>
                <span className='activity-details__label'>Participants</span>
                <span className='activity-details__value'>{activity.joined_count} / {activity.max_participants}</span>
              </div>
              <div className='activity-details__row'>
                <span className='activity-details__label'>Host</span>
                <span className='activity-details__value'>{activity.host?.name ?? 'Unknown'}</span>
              </div>
            </div>

            <div className='activity-map-panel activity-map-panel--accent'>
              <Map position={[activity.latitude,activity.longitude]} />
            </div>
          </div>

          <section className='activity-participants activity-panel activity-panel--participants'>
            <h2 className='activity-panel__title'>Participants</h2>
            {activity.participants && activity.participants.length > 0 ? (
              <div className='activity-participants__list activity-participants__list--details'>
                {activity.participants.map(ele => (
                  <div key={ele.id} className='activity-participants__item'>
                    {ele.name}
                  </div>
                ))}
              </div>
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
