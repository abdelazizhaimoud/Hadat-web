import { useCallback, useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import type { Activity as BaseActivity } from '../../types/Activity'
import axiosInstance from '../../utils/axiosClient'
import { capitalize } from '../../utils/formats'
import { categories, status } from '../../constants/activity'
import Map from '../map/Map'
import FormField from '../ui/FormField'
import FormSelect from '../ui/FormSelect'
import ParticipantsList from '../ui/ParticipantsList'

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
    const [isSubmiting,setIsSubmiting] = useState<boolean>(false)
    const [isRemoving, setIsRemoving] = useState<Record<number, boolean>>({})
    const [location,setLocation] = useState<[number,number]>([activity.latitude,activity.longitude])
    const [toggleMap,setToggleMap] = useState<boolean>(false)
    const categoryOptions = categories.map((cat) => ({
        value: cat,
        label: capitalize(cat),
    }))
    const statusOptions = status.map((sta) => ({
        value: sta,
        label: capitalize(sta),
    }))
    const canEdit = activity.hosted
    const fetchActivity = useCallback(async () => {
            setLoading(true)
            try {
                const response = await axiosInstance.get(`/activities/${params.id}`)
                const fetchedActivity = response.data.activity
                setActivity(fetchedActivity)
                setLocation([fetchedActivity.latitude,fetchedActivity.longitude])
            } finally {
                setLoading(false)
            }
    }, [params.id])

    useEffect(()=>{
        void fetchActivity()
    },[fetchActivity])

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name,value} = e.target
        setActivity({...activity,[name]: value})
    }
    const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if ((location[0] === activity.latitude && location[1] === activity.longitude) || toggleMap ){
            console.log("save a location first")
        }else{
            setIsSubmiting(true)
                        try {
                                await axiosInstance.put(`/activities/${activity.id}`,{activity: {...activity,latitude: location[0],longitude: location[1]}})
                        } finally {
                                setIsSubmiting(false)
                        }
        }
    }
    const handleRemove = async (membreId: number, activityId: number) => {
        setIsRemoving((prev) => ({...prev,[membreId]: true}))
        try {
                await axiosInstance.delete(`/activities/remove/${membreId}`,{params: {activityId: activityId}})
                void fetchActivity()
        } finally {
                setIsRemoving((prev) => ({...prev,[membreId]: false}))
        }
    }

        if (loading) {
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
                {canEdit ? (
                    <article className='activity-form-card'>
                        <header className='activity-hero activity-hero--compact'>
                            <p className='activity-hero__eyebrow'>Activity editor</p>
                            <h1 className='activity-hero__title'>Edit activity</h1>
                            <p className='activity-hero__subtitle'>
                                Update details, change the schedule, and manage the participant list.
                            </p>
                        </header>

                        <form className='activity-form' onSubmit={handleUpdate}>
                            <div className='activity-grid'>
                                <FormField
                                    label='Title'
                                    name='title'
                                    value={activity.title}
                                    onChange={handleChange}
                                />

                                <FormSelect
                                    label='Category'
                                    name='category'
                                    value={activity.category}
                                    options={categoryOptions}
                                    onChange={handleChange}
                                />

                                <FormSelect
                                    label='Status'
                                    name='status'
                                    value={activity.status}
                                    options={statusOptions}
                                    onChange={handleChange}
                                />

                                <FormField
                                    label='City'
                                    name='city'
                                    value={activity.city}
                                    onChange={handleChange}
                                />

                                <FormField
                                    label='Date and time'
                                    type='date'
                                    name='date_time'
                                    value={activity.date_time}
                                    onChange={handleChange}
                                />

                                <FormField
                                    label='Max participants'
                                    type='number'
                                    name='max_participants'
                                    value={activity.max_participants}
                                    onChange={handleChange}
                                />
                            </div>

                            <section className='activity-panel activity-panel--location'>
                                <div className='activity-panel__header'>
                                    <div>
                                        <h2 className='activity-panel__title'>Location</h2>
                                        <p className='activity-panel__subtitle'>Adjust the map marker before saving your updates.</p>
                                    </div>

                                    <button
                                        className='activity-button activity-button--accent'
                                        type='button'
                                        onClick={() => setToggleMap((prev) => !prev)}
                                    >
                                        {toggleMap ? 'Save location' : 'Change location'}
                                    </button>
                                </div>

                                <p className='activity-panel__hint'>
                                    Current coordinates: {location[0].toFixed(5)}, {location[1].toFixed(5)}
                                </p>

                                {toggleMap && (
                                    <div className='activity-map-panel'>
                                        <Map create={true} setLocation={setLocation} position={location} />
                                    </div>
                                )}
                            </section>

                            <section className='activity-panel activity-panel--participants'>
                                <h2 className='activity-panel__title'>Participants</h2>
                                {activity.participants && activity.participants.length > 0 ? (
                                    <ParticipantsList
                                        participants={activity.participants}
                                        editable
                                        isRemoving={isRemoving}
                                        onRemove={(participantId) => handleRemove(participantId, activity.id)}
                                    />
                                ) : (
                                    <div className='activity-state'>No participants yet.</div>
                                )}
                            </section>

                            <div className='activity-actions activity-actions--sticky'>
                                <button className='activity-button activity-button--primary' type='submit' disabled={isSubmiting}>
                                    {isSubmiting ? 'Updating...' : 'Update activity'}
                                </button>
                            </div>
                        </form>
                    </article>
                ) : (
                    <div className='activity-state activity-state--denied'>
                        You cannot edit this activity.
                    </div>
                )}
            </div>
        </section>
    )
}

export default EditActivity
