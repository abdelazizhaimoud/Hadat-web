import type { User } from '../../types/User'

type ParticipantsListProps = {
  participants: User[]
  editable?: boolean
  listClassName?: string
  isRemoving?: Record<number, boolean>
  onRemove?: (participantId: number) => void
}

function ParticipantsList({
  participants,
  editable = false,
  listClassName,
  isRemoving = {},
  onRemove,
}: ParticipantsListProps) {
  const resolvedListClassName = listClassName
    ? `activity-participants__list ${listClassName}`
    : 'activity-participants__list'

  return (
    <div className={resolvedListClassName}>
      {participants.map((participant) => (
        <div
          key={participant.id}
          className={`activity-participants__item${editable ? ' activity-participants__item--editable' : ''}`}
        >
          <span>{participant.name}</span>
          {editable && onRemove && (
            <button
              className='activity-button activity-button--danger'
              type='button'
              disabled={isRemoving[participant.id]}
              onClick={() => onRemove(participant.id)}
            >
              {isRemoving[participant.id] ? 'Removing...' : 'Remove'}
            </button>
          )}
        </div>
      ))}
    </div>
  )
}

export default ParticipantsList
