import { useFormContext } from '@/hooks/form-context';
import React from 'react';
import { Button } from '../ui/button';
import { Spinner } from '../ui/spinner';

export default function FormSubmitButton({ children, className, onClick } : { children: React.ReactNode, className?: string, onClick?: () => void }) {
  const form = useFormContext();
  return (
    <Button
      type="submit"
      variant={form.state.isSubmitting ? 'disabled_grey' : 'success'}
      disabled={form.state.isSubmitting}
      className={className}
      onClick={() => { onClick?.() }}
    >
      {form.state.isSubmitting && <Spinner className="mr-2" />}
      {!form.state.isSubmitting && children}
    </Button>
  )
}
