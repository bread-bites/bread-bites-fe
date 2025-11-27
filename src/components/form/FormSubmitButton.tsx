import { useFormContext } from '@/hooks/form-context';
import { Button, ButtonProps } from '@mui/material';
import React from 'react';

export default function FormSubmitButton({ children, color, className, onClick } : { children: React.ReactNode, color?: ButtonProps['color'], className?: string, onClick?: () => void }) {
  const form = useFormContext();
  return (
    <Button
      type="submit"
      variant='contained'
      color={color ?? 'success'}
      size='small'
      disabled={form.state.isSubmitting}
      className={className}
      onClick={() => { onClick?.() }}
    >
      {children}
    </Button>
  )
}
