import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Activity } from '../../types/Activity';
import axiosInstance from '../../utils/axiosClient';
import { useAppSelector } from '../../app/hooks';

interface ActivityCardProps {
  activity: Activity;
  onJoin?: (id: number) => void;
  onLeave?: (id: number) => void;
  refresh: () => void;
  children?: React.ReactNode;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ 
  activity,
  onJoin,
  onLeave,
  refresh,
  children
}) => {

  const user = useAppSelector((state) => state.auth.user)
  const [comment,setComment] = useState<Record<number,string>>({})
  const [isSubmiting,setIsSubmiting] = useState<Record<number,boolean>>({})
  const [isDeleting,setIsDeleting] = useState<Record<number,boolean>>({})

  const handleComment = async (id: number) => {
    setIsSubmiting((prev) => ({...prev, [id]: true}))
    const response = await axiosInstance.post(`/activities/${id}/comment`,{content: comment[id]})
    setIsSubmiting((prev) => ({...prev, [id]: false}))
    setComment((prev) => ({...prev,[id]: ""}))
    refresh()
  }
  
  const handleDeleteComment = async (id) => {
    setIsDeleting((prev) => ({...prev, [id]: true}))
    const response = await axiosInstance.delete(`/activities/comments/${id}`)
    setIsDeleting((prev) => ({...prev, [id]: false}))
    refresh()
  }

  return (
    <div style={{border: "solid"}}>
      <h3>{activity.title}</h3>
      
      <p className="date-time">
        {activity.date_time}
      </p>
      
      <p className="city">
        {activity.city}
      </p>
      
      <p className="category">
        {activity.category}
      </p>
      
      <p className="joined_count">
        joined count: {activity.joined_count} / {activity.max_participants}
      </p>

      <p className="status">
        status : {activity.status}
      </p>

      <div>comments : <br />
        {activity.comments?.map(com => <><span>{com.user.name} : </span><span>{com.content}</span>
        {(activity.hosted || com.user_id === user?.id) && <button onClick={() => handleDeleteComment(com.id)}>Delete</button>} <br /> </>)}
      </div>
      <span><input type="text" value={comment[activity.id] || ""} onChange={(e) => setComment((prev) => ({...prev,[activity.id]: e.target.value}))} />
      <button disabled={isSubmiting[activity.id]}  onClick={() => handleComment(activity.id)}>Comment</button></span>
      
      <div className="actions">
        {onJoin && !activity.joined && (activity.joined_count < activity.max_participants) && (activity.status == "active") && (
          <button onClick={() => onJoin(activity.id)}>Join</button>
        )}
      </div>
      <div className="actions">
        {onLeave && activity.joined && (
          <button onClick={() => onLeave(activity.id)}>Leave</button>
        )}
      </div>
      <div className="actions">
        {activity.hosted ? (
          <Link to={`/activity/${activity.id}/edit`}>Edit</Link>
        ) : (
          <Link to={`/activity/${activity.id}`}>Details</Link>
        )}
      </div>
      
      {children && (
        <div>
          {children}
        </div>
      )}
    </div>
  );
};

export default ActivityCard