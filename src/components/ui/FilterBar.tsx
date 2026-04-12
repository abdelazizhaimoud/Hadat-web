import './filter-bar.css'
import type { FC } from 'react'

type Option = { value: string; label: string }

type Props = {
  value: string
  onChange: (v: string) => void
  options?: Option[]
}

const defaultOptions: Option[] = [
  { value: 'hosted', label: 'Hosted' },
  { value: 'membre', label: 'Membre' },
  { value: 'both', label: 'Both' },
]

const FilterBar: FC<Props> = ({ value, onChange, options = defaultOptions }) => {
  return (
    <div className="filter-bar">
      <div className="filter-seg" role="tablist" aria-label="Activity filter">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`fb-btn ${value === opt.value ? 'active' : ''}`}
            aria-pressed={value === opt.value}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="filter-actions">
        <button type="button" className="fb-reset" onClick={() => onChange('both')}>
          Reset
        </button>
      </div>
    </div>
  )
}

export default FilterBar
