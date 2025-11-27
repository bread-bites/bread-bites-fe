import { useFormContext } from '@/hooks/form-context';
import { Box } from '@mui/material';
import React from 'react';

export default function FormContainer({ children, className } : { children: React.ReactNode, className?: string }) {
  const form = useFormContext();
  return (
    <Box
      className={className}
      component='form'
      onSubmit={e => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit()
      }}
    >
      {children}
    </Box>
  )
}
