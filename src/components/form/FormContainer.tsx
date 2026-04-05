import { useFormContext } from '@/hooks/form-context';
import React from 'react';

export default function FormContainer({ children, className } : { children: React.ReactNode, className?: string }) {
  const form = useFormContext();
  return (
    <form
      className={className}
      onSubmit={e => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit()
      }}
    >
      {children}
    </form>
  )
}
