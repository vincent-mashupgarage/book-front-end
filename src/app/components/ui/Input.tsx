import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/app/lib/utils';

const inputVariants = cva(
  "flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-950 dark:border-gray-700 dark:text-gray-50 dark:placeholder:text-gray-500 dark:focus:ring-blue-400",
  {
    variants: {
      variant: {
        default: "border-gray-300 dark:border-gray-700",
        error: "border-red-500 focus:ring-red-500 dark:border-red-400 dark:focus:ring-red-400",
      },
      size: {
        default: "h-10",
        sm: "h-8 text-xs",
        lg: "h-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      variant: {
        default: "text-gray-700 dark:text-gray-300",
        error: "text-red-600 dark:text-red-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const inputVariant = error ? 'error' : variant;
    const labelVariant = error ? 'error' : 'default';
    
    return (
      <div className="w-full space-y-1">
        {label && (
          <LabelPrimitive.Root
            htmlFor={inputId}
            className={cn(labelVariants({ variant: labelVariant }))}
          >
            {label}
          </LabelPrimitive.Root>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(inputVariants({ variant: inputVariant, size, className }))}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
export { inputVariants, labelVariants };