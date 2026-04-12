import type { ChangeEvent } from 'react'

type FormSelectOption = {
  value: string
  label: string
}

type FormSelectProps = {
  label: string
  name: string
  value: string
  options: FormSelectOption[]
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void
  required?: boolean
  wrapperClassName?: string
  labelClassName?: string
  selectClassName?: string
}

function FormSelect({
  label,
  name,
  value,
  options,
  onChange,
  required,
  wrapperClassName = 'activity-field',
  labelClassName = 'activity-label',
  selectClassName = 'activity-select',
}: FormSelectProps) {
  return (
    <label className={wrapperClassName}>
      <span className={labelClassName}>{label}</span>
      <select
        className={selectClassName}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

export default FormSelect
