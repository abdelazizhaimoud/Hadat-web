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
      
      <p className="participants">
        Max: {activity.max_participants} participants
      </p>
      
      <div className="actions">
        {onJoin && !activity.joined && (
          <button onClick={() => onJoin(activity.id)}>Join</button>
        )}
      </div>
      <div className="actions">
        {onLeave && activity.joined && (
          <button onClick={() => onLeave(activity.id)}>Leave</button>
        )}
      </div>
      <div><Link to={`/activity/${activity.id}`}>details</Link></div>
      
      {children && (
        <div>
          {children}
        </div>
      )}
    </div>
  );
};

export default ActivityCard