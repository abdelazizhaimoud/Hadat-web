import React from 'react';
import { Link } from 'react-router-dom';
import type { Activity } from '../../types/Activity';

interface ActivityCardProps {
  activity: Activity;
  onJoin?: (id: number) => void;
  onLeave?: (id: number) => void;
  children?: React.ReactNode;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ 
  activity, 
  onJoin,
  onLeave,
  children 
}) => {

  return (
    <div style={{border: "solid"}}>
      <h3>{activity.title}</h3>
      
      <p className="date-time">
        {activity.date_time}
      </p>
      
      <p className="location">
        {activity.location}
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