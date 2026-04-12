import type { ChangeEvent, HTMLInputTypeAttribute } from 'react'

type FormFieldProps = {
  label: string
  name: string
  value: string | number
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  type?: HTMLInputTypeAttribute
  min?: string | number
  placeholder?: string
  required?: boolean
  wrapperClassName?: string
  labelClassName?: string
  inputClassName?: string
}

function FormField({
  label,
  name,
  value,
  onChange,
  type = 'text',
  min,
  placeholder,
  required,
  wrapperClassName = 'activity-field',
  labelClassName = 'activity-label',
  inputClassName = 'activity-input',
}: FormFieldProps) {
  return (
    <label className={wrapperClassName}>
      <span className={labelClassName}>{label}</span>
      <input
        className={inputClassName}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        min={min}
        placeholder={placeholder}
        required={required}
      />
    </label>
  )
}

export default FormField
