import { useState, type FormEvent } from 'react';
import axiosInstance from '../../utils/axiosClient';
import type { Activity as BaseActivity } from '../../types/Activity';
import { categories } from '../../constants/activity';
import { capitalize } from '../../utils/formats';
import Map from '../map/Map';

type Activity = Omit<BaseActivity, "id" | "host_id" | "created_at" | "updated_at" | "joined" | "joined_count" | "hosted" | "status" | "comments">

const DefaultLocation: [number,number] = [33.5731, -7.5898]

function CreateActivity() {
  const today = new Date().toISOString().split('T')[0]
  const [activity, setActivity] = useState<Activity>({
    title: "",
    category: "sport",
    city: "",
    latitude: 0.0,
    longitude: 0.0,
    date_time: today,
    max_participants: 0,
  })
  const [location,setLocation] = useState<[number,number]>(DefaultLocation)
  const [toggleMap,setToggleMap] = useState<boolean>(false)
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try{
      if ((location[0] === DefaultLocation[0] && location[1] === DefaultLocation[1]) || toggleMap ){
        console.log("choose or save a location first")
      }else{
        const response = await axiosInstance.post('/activities',{...activity,latitude: location[0],longitude: location[1]})
        if (response.status == 201){
          console.log("activity created")
        }
      }
    }catch (error){
      console.log(error)
    }
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {name,value} = e.target
    setActivity((prev) => ({...prev, [name]: value}))
  }
  return (
    <section className='activity-page'>
      <div className='activity-shell'>
        <header className='activity-hero'>
          <p className='activity-hero__eyebrow'>Activity</p>
          <h1 className='activity-hero__title'>Create a new activity</h1>
          <p className='activity-hero__subtitle'>
            Set up the basics, pick a location on the map, and publish it when you are ready.
          </p>
        </header>

        <article className='activity-form-card'>
        <form className='activity-form' onSubmit={handleSubmit}>
          <div className='activity-grid'>
            <label className='activity-field'>
              <span className='activity-label'>Title</span>
              <input className='activity-input' type='text' name='title' value={activity.title} onChange={handleChange} />
            </label>

            <label className='activity-field'>
              <span className='activity-label'>Category</span>
              <select className='activity-select' name='category' value={activity.category} onChange={handleChange}>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{capitalize(cat)}</option>
                ))}
              </select>
            </label>

            <label className='activity-field'>
              <span className='activity-label'>City</span>
              <input className='activity-input' type='text' name='city' value={activity.city} onChange={handleChange} />
            </label>

            <label className='activity-field'>
              <span className='activity-label'>Date and time</span>
              <input className='activity-input' type='date' name='date_time' min={today} value={activity.date_time} onChange={handleChange} />
            </label>

            <label className='activity-field'>
              <span className='activity-label'>Max participants</span>
              <input className='activity-input' type='number' name='max_participants' value={activity.max_participants} onChange={handleChange} />
            </label>
          </div>

          <section className='activity-panel activity-panel--location'>
            <div className='activity-panel__header'>
              <div>
                <h2 className='activity-panel__title'>Location</h2>
                <p className='activity-panel__subtitle'>Choose a point on the map before saving the activity.</p>
              </div>

              <button
                className='activity-button activity-button--accent'
                type='button'
                onClick={() => setToggleMap((prev) => !prev)}
              >
                {toggleMap ? 'Save location' : (location[0] === DefaultLocation[0] && location[1] === DefaultLocation[1]) ? 'Choose location' : 'Modify location'}
              </button>
            </div>

            <p className='activity-panel__hint'>
              {location[0] === DefaultLocation[0] && location[1] === DefaultLocation[1]
                ? 'No custom location selected yet.'
                : `Selected coordinates: ${location[0].toFixed(5)}, ${location[1].toFixed(5)}`}
            </p>

            {toggleMap && (
              <div className='activity-map-panel'>
                <Map create={true} setLocation={setLocation} position={location} />
              </div>
            )}
          </section>

          <div className='activity-actions'>
            <button className='activity-button activity-button--primary' type='submit'>
              Create activity
            </button>
          </div>
        </form>
        </article>
      </div>
    </section>
  )
}

export default CreateActivity
