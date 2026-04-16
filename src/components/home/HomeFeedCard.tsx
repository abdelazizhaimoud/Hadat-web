import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Activity } from '../../types/Activity';
import axiosInstance from '../../utils/axiosClient';
import { useAppSelector } from '../../app/hooks';
import InfoRow from '../ui/InfoRow';
import StatusBadge from '../ui/StatusBadge';

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
  const [isSubmitting,setIsSubmitting] = useState<Record<number,boolean>>({})
  const [isDeleting,setIsDeleting] = useState<Record<number,boolean>>({})

  const handleComment = async (id: number) => {
    const content = comment[id]?.trim()
    if (!content) return

    setIsSubmitting((prev) => ({...prev, [id]: true}))
    try {
      await axiosInstance.post(`/activities/${id}/comment`, { content })
      setComment((prev) => ({...prev, [id]: ""}))
      refresh()
    } catch (error) {
      console.log(error)
    } finally {
      setIsSubmitting((prev) => ({...prev, [id]: false}))
    }
  }
  
  const handleDeleteComment = async (id: number) => {
    setIsDeleting((prev) => ({...prev, [id]: true}))
    try {
      await axiosInstance.delete(`/activities/comments/${id}`)
      refresh()
    } catch (error) {
      console.log(error)
    } finally {
      setIsDeleting((prev) => ({...prev, [id]: false}))
    }
  }

  const canSubmitComment = Boolean(comment[activity.id]?.trim())

  return (
    <article className='home-card'>
      <div className='home-card__header'>
        <h3 className='home-card__title'>{activity.title}</h3>
        <StatusBadge status={activity.status} baseClassName='home-card__status' />
      </div>

      <div className='home-card__meta'>
        <InfoRow variant='meta' label='Date' value={activity.date_time} />
        <InfoRow variant='meta' label='City' value={activity.city} />
        <InfoRow variant='meta' label='Category' value={activity.category || 'General'} />
        <InfoRow variant='meta' label='Participants' value={`${activity.joined_count} / ${activity.max_participants}`} />
      </div>

      <section className='home-card__comments'>
        <h4 className='home-card__comments-title'>Comments</h4>

        {activity.comments && activity.comments.length > 0 ? (
          <div className='home-card__comment-list'>
            {activity.comments.map(com => (
              <div key={com.id} className='home-card__comment'>
                <div className='home-card__comment-body'>
                  <span className='home-card__comment-author'>{com.user.name}</span>
                  <span className='home-card__comment-content'>{com.content}</span>
                </div>
                {(activity.hosted || com.user_id === user?.id) && (
                  <button
                    className='home-card__comment-delete'
                    onClick={() => handleDeleteComment(com.id)}
                    disabled={isDeleting[com.id]}
                  >
                    {isDeleting[com.id] ? 'Deleting...' : 'Delete'}
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className='home-card__comment-empty'>No comments yet. Be the first one.</p>
        )}

        <form
          className='home-card__comment-form'
          onSubmit={(e) => {
            e.preventDefault()
            handleComment(activity.id)
          }}
        >
          <input
            className='home-card__comment-input'
            type='text'
            value={comment[activity.id] || ""}
            onChange={(e) => setComment((prev) => ({...prev,[activity.id]: e.target.value}))}
            placeholder='Write a comment'
          />
          <button
            className='home-card__comment-submit'
            type='submit'
            disabled={isSubmitting[activity.id] || !canSubmitComment}
          >
            {isSubmitting[activity.id] ? 'Posting...' : 'Comment'}
          </button>
        </form>
      </section>

      <div className='home-card__actions'>
        {onJoin && !activity.joined && (activity.joined_count < activity.max_participants) && (activity.status == "active") && (
          <button className='home-card__action home-card__action--primary' onClick={() => onJoin(activity.id)}>
            Join
          </button>
        )}

        {onLeave && activity.joined && (
          <button className='home-card__action home-card__action--ghost' onClick={() => onLeave(activity.id)}>
            Leave
          </button>
        )}

        {activity.hosted ? (
          <Link className='home-card__link home-card__link--primary' to={`/activity/${activity.id}/edit`}>
            Edit
          </Link>
        ) : (
          <Link className='home-card__link home-card__link--ghost' to={`/activity/${activity.id}`}>
            Details
          </Link>
        )}
      </div>
      
      {children && (
        <div className='home-card__extra'>
          {children}
        </div>
      )}
    </article>
  );
};

export default ActivityCard