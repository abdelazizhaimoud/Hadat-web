import { useCallback, useEffect, useState } from "react"
import axiosInstance from "../../utils/axiosClient"
import axios from "axios"
import HomeFeedCard from "./HomeFeedCard"
import type { Activity } from "../../types/Activity"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { setHomeActivities } from "../../features/activities/activitiesSlice"

function HomeFeed() {
    const dispatch = useAppDispatch()
    const storeHomeActivities = useAppSelector((state) => state.activities.home)
    const activities: Activity[] = storeHomeActivities ?? []
    const [category,setCategory] = useState<string>("")
    const [search,setSearch] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const fetchActivities = useCallback(async () => {
        setIsLoading(true)
        try{
            const response = await axiosInstance.get('/activities', {
                params: {search, category}
            })
            if (response.status == 200){
                dispatch(setHomeActivities(response.data.activities))
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
        } finally {
            setIsLoading(false)
        }
    }, [category, dispatch, search])

    useEffect(() => {
        if (storeHomeActivities === null) { 
            void fetchActivities()
        }
    },[fetchActivities, storeHomeActivities])

    const join = async(id: number) => {
        try{
            await axiosInstance.post(`/activities/${id}/join`)
            void fetchActivities()
        }catch(error){
            console.log(error)
        }
    }
    
    const leave = async(id: number) => {
        try{
            await axiosInstance.delete(`/activities/${id}/leave`)
            void fetchActivities()
        }catch(error){
            console.log(error)
        }
    }

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        fetchActivities()
    }

    const showLoadingState = isLoading && storeHomeActivities === null
    const showEmptyState = !isLoading && storeHomeActivities !== null && activities.length === 0

  return (
    <section className='home-feed'>
        <form className='home-feed__controls' onSubmit={handleSearch}>
            <div className='home-feed__control'>
                <label className='home-feed__label' htmlFor='home-search'>Search</label>
                <input
                    id='home-search'
                    className='home-feed__input'
                    type='text'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder='Search by title'
                />
            </div>

            <div className='home-feed__control'>
                <label className='home-feed__label' htmlFor='home-category'>Category</label>
                <select
                    id='home-category'
                    className='home-feed__select'
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value=''>All categories</option>
                    <option value='sport'>Sport</option>
                    <option value='outdoor'>Outdoor</option>
                    <option value='travel'>Travel</option>
                </select>
            </div>

            <button
                className='home-feed__search-button'
                type='submit'
                disabled={isLoading}
            >
                {isLoading ? 'Searching...' : 'Search'}
            </button>
        </form>

        {showLoadingState && (
            <div className='home-feed__state home-feed__state--loading'>
                Loading activities...
            </div>
        )}

        {!showLoadingState && isLoading && (
            <div className='home-feed__state home-feed__state--updating'>
                Updating results...
            </div>
        )}

        {showEmptyState && (
            <div className='home-feed__state home-feed__state--empty'>
                No activities found for this search. Try another keyword or category.
            </div>
        )}

        {activities.length > 0 && (
            <div className='home-feed__list'>
                {activities.map(act => (
                    <HomeFeedCard
                        key={act.id}
                        onJoin={join}
                        refresh={fetchActivities}
                        onLeave={leave}
                        activity={act}
                    />
                ))}
            </div>
        )}
    </section>
  )
}

export default HomeFeed
