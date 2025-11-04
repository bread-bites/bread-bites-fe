import { createFormHook } from '@tanstack/react-form'

import { fieldContext, formContext } from './form-context'
import FormContainer from '@/components/form/FormContainer'
import FormTextField from '@/components/form/FormTextField'
import FormTextArea from '@/components/form/FormTextArea'

export const { useAppForm } = createFormHook({
  fieldComponents: {
    FormTextField,
    FormTextArea
  },
  formComponents: {
    FormContainer
  },
  fieldContext,
  formContext,
})
