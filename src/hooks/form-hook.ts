import { createFormHook } from '@tanstack/react-form'

import { fieldContext, formContext } from './form-context'
import FormContainer from '@/components/form/FormContainer'
import FormTextField from '@/components/form/FormTextField'
import FormTextArea from '@/components/form/FormTextArea'
import FormUploadImage from '@/components/form/FormUploadImage'
import FormSubmitButton from '@/components/form/FormSubmitButton'
import FormSelect from '@/components/form/FormSelect'
import FormNewTagInput from '@/components/form/FormNewTagInput'
import FormAgeRating from '@/components/form/FormAgeRating'

export const { useAppForm } = createFormHook({
  fieldComponents: {
    FormTextField,
    FormTextArea,
    FormUploadImage,
    FormSelect,

    FormNewTagInput,
    FormAgeRating
  },
  formComponents: {
    FormContainer,
    FormSubmitButton
  },
  fieldContext,
  formContext,
})
