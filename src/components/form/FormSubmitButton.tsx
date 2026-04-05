import { useFormContext } from '@/hooks/form-context';
import React from 'react';
import { Button } from '../ui/button';

export default function FormSubmitButton({ children, className, onClick } : { children: React.ReactNode, className?: string, onClick?: () => void }) {
  const form = useFormContext();
  return (
    <Button
      type="submit"
      variant='success'
      disabled={form.state.isSubmitting}
      className={className}
      onClick={() => { onClick?.() }}
    >
      {children}
    </Button>
  )
}
