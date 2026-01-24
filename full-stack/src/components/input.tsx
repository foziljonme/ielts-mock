import * as React from 'react'
import { CircleAlert } from 'lucide-react'

import { cn } from './utils'
import { FieldError } from 'react-hook-form'
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip'

function Input({
  className,
  type,
  error,
  ...props
}: React.ComponentProps<'input'> & { error?: FieldError }) {
  return (
    <div className="relative w-full">
      <input
        type={type}
        data-slot="input"
        className={cn(
          'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base bg-input-background transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          error && 'pr-10',
          className,
        )}
        aria-invalid={error ? 'true' : 'false'}
        {...props}
      />
      {error && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <Tooltip>
            <TooltipTrigger asChild>
              <CircleAlert className="h-4 w-4 text-destructive cursor-pointer" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{error.message}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      )}
    </div>
  )
}

export { Input }
