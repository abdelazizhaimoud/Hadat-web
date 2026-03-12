import { useEffect, useState } from "react"
import axiosInstance from "../../utils/axiosClient"
import axios from "axios"
import HomeFeedCard from "./HomeFeedCard"
import type { Activity } from "../../types/Activity"

function HomeFeed() {
    const [activities, setActivities] = useState<Activity[]>([])

    const fetchActivities = async () => {
        try{
            const response = await axiosInstance.get('/activities')
            if (response.status == 200){
                console.log(response.data)
                setActivities(response.data.activities)
            }
        }catch (error){
            if (axios.isAxiosError(error)){
                if (error.response){
                    switch(error.response.status){
                        case 401:
                            console.log("access unauthorized.")
                            break
                        case 403:
                            console.log("access forbidden.")
                            break
                        default:
                            console.log("an error occured.")
                    }
                }else{
                    console.log("no response")
                }
            }else{
                console.log("non axios error")
            }
        }
    }
    useEffect(() => {
        fetchActivities()
    },[])
    useEffect(()=> console.log(activities),[activities])

    const join = async(id: number) => {
        try{
            const response = await axiosInstance.post(`/activities/${id}/join`)
            console.log(response)
            fetchActivities()
        }catch(error){
            console.log(error)
        }
    }
    
    const leave = async(id: number) => {
        try{
            const response = await axiosInstance.delete(`/activities/${id}/leave`)
            console.log(response)
            fetchActivities()
        }catch(error){
            console.log(error)
        }
    }

  return (
    <div>
      {activities.map(act => <HomeFeedCard onJoin={join} onLeave={leave} activity={{...act}} ></HomeFeedCard>)}
    </div>
  )
}

export default HomeFeed
