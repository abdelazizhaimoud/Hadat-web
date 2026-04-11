import { useState } from 'react';
import Header from '../home/Header'
import axiosInstance from '../../utils/axiosClient';
import type { Activity as BaseActivity } from '../../types/Activity';
import { categories } from '../../constants/activity';
import { capitalize } from '../../utils/formats';
import Map from '../map/Map';

type Activity = Omit<BaseActivity, "id" | "host_id" | "created_at" | "updated_at" | "joined" | "joined_count" | "hosted" | "status" | "comments">

const DefaultLocation: [number,number] = [33.5731, -7.5898]

function CreateActivity() {
  const [activity, setActivity] = useState<Activity>({
    title: "",
    category: "sport",
    city: "",
    latitude: 0.0,
    longitude: 0.0,
    date_time: new Date().toISOString().split('T')[0],
    max_participants: 0,
  })
  const [location,setLocation] = useState<[number,number]>(DefaultLocation)
  const [toggleMap,setToggleMap] = useState<boolean>(false)
  
  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
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
    <div>
        <Header></Header>
        <form onSubmit={handleSubmit}>
          <span>title : </span><input type="text" name="title" value={activity.title} onChange={handleChange} /><br />
          <span>category : </span>
            <select name="category" onChange={handleChange}>
              {categories.map(cat => (
                <option key={cat} value={cat}>{capitalize(cat)}</option>
              ))}
            </select>
          <br />
          <span>city : </span><input type="text" name="city" value={activity.city} onChange={handleChange} /><br />
          <span>location : </span>
          <input type='button' onClick={() => setToggleMap((prev) => !prev)} value={toggleMap ? "Save" : (location[0] === DefaultLocation[0] && location[1] === DefaultLocation[1]) ? "choose location" : "modify location"}></input> : <br />
          <div>{toggleMap ? <Map create={true} setLocation={setLocation} position={location} /> : void 0}</div>
          <span>date_time : </span><input type="date" name="date_time" min={new Date().toISOString().split('T')[0]} value={activity.date_time} onChange={handleChange} /><br />
          <span>max_participants : </span><input type="number" name="max_participants" value={activity.max_participants} onChange={handleChange} /><br />
          <button type='submit'>Create activity</button>
        </form>
    </div>
  )
}

export default CreateActivity
