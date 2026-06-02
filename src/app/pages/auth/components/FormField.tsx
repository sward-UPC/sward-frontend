import type { ElementType } from 'react'
import { cn } from '../../../components/ui/utils'

interface FormFieldProps {
  id: string
  type?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  icon?: ElementType
  right?: React.ReactNode
  disabled?: boolean
  autoComplete?: string
}

/** Input reutilizable con ícono opcional para formularios de autenticación. */
export function FormField({
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  icon: Icon,
  right,
  disabled,
  autoComplete = 'off',
}: FormFieldProps) {
  return (
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        className={cn(
          'w-full py-2.5 rounded-[12px] border border-input bg-card/80 text-sm',
          'placeholder:text-muted-foreground focus:outline-none focus:ring-2',
          'focus:ring-primary/25 focus:border-primary transition-all',
          Icon ? 'pl-9' : 'pl-3',
          right ? 'pr-10' : 'pr-3',
          disabled && 'opacity-50 cursor-not-allowed',
        )}
      />
      {right}
    </div>
  )
}
