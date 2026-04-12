type StatusBadgeProps = {
  status: string
  baseClassName: string
  className?: string
}

function StatusBadge({ status, baseClassName, className }: StatusBadgeProps) {
  const normalizedStatus = status || 'unknown'
  const modifierClassName = status ? `${baseClassName}--${status}` : ''
  const resolvedClassName = [baseClassName, modifierClassName, className]
    .filter(Boolean)
    .join(' ')

  return <span className={resolvedClassName}>{normalizedStatus}</span>
}

export default StatusBadge
