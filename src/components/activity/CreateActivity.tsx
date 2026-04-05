import { useState } from 'react';
import Header from '../home/Header'
import axiosInstance from '../../utils/axiosClient';
import type { Activity as BaseActivity } from '../../types/Activity';
import { categories } from '../../constants/activity';
import { capitalize } from '../../utils/formats';

type Activity = Omit<BaseActivity, "id" | "host_id" | "created_at" | "updated_at" | "joined" | "joined_count" | "hosted" | "status">
function CreateActivity() {
  const [activity, setActivity] = useState<Activity>({
    title: "",
    category: "sport",
    location: "",
    date_time: new Date().toISOString().split('T')[0],
    max_participants: 0,
  })
  
  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    try{
      const response = await axiosInstance.post('/activities',activity)
      if (response.status == 201){
        console.log("activity created")
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
          <span>location : </span><input type="text" name="location" value={activity.location} onChange={handleChange} /><br />
          <span>date_time : </span><input type="date" name="date_time" min={new Date().toISOString().split('T')[0]} value={activity.date_time} onChange={handleChange} /><br />
          <span>max_participants : </span><input type="number" name="max_participants" value={activity.max_participants} onChange={handleChange} /><br />
          <button type='submit'>Create activity</button>
        </form>
    </div>
  )
}

export default CreateActivity
