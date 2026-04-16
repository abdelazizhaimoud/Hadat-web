import type { ReactNode } from 'react'

type InfoRowProps = {
  label: string
  value: ReactNode
  variant?: 'details' | 'meta'
}

function InfoRow({ label, value, variant = 'details' }: InfoRowProps) {
  const isMeta = variant === 'meta'
  const rowClassName = isMeta ? 'home-card__meta-item' : 'activity-details__row'
  const labelClassName = isMeta ? 'home-card__meta-label' : 'activity-details__label'
  const valueClassName = isMeta ? '' : 'activity-details__value'

  return (
    <div className={rowClassName}>
      <span className={labelClassName}>{label}</span>
      <span className={valueClassName}>{value}</span>
    </div>
  )
}

export default InfoRow
