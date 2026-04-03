import { getImageByID, updateImage, updateImageSchema, updateImageSchemaType } from '@/api/image';
import { AGE_RATING_ENUM, AGE_RATING_SELECT } from '@/constants/age-rating';
import { QUERY_KEY } from '@/constants/query-key';
import { useAppForm } from '@/hooks/form-hook';
import useModal, { usualErrorHandler } from '@/hooks/modal-hook-provider';
import { getContext } from '@/integrations/tanstack-query/root-provider';
import { AxiosCustomError } from '@/model/axios-error';
import { objectToFormData } from '@/utilities/frontend-api';
import { Alert, Box, Divider, Typography } from '@mui/material'
import { formOptions } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start';

export const Route = createFileRoute('/(header)/_header/_auth/image/$id/update')({
  component: RouteComponent,
  loader: async ({ params }) => (await getImageByID({ data: params.id })).data,
});

const formOption = formOptions({
  validators: {
    onChange: updateImageSchema
  },
})

function RouteComponent() {
  const data = Route.useLoaderData();
  const navigate = Route.useNavigate();
  const updateImageEndpoint = useServerFn(updateImage);
  const { show } = useModal();

  const { mutateAsync } = useMutation({
    mutationKey: [QUERY_KEY.IMAGE],
    mutationFn: async (data: updateImageSchemaType) => await updateImageEndpoint({ data: objectToFormData(data) }),
    onSuccess: () => {
      show({
        title: 'Success',
        type: 'success',
        message: 'Yay, your reaction image is successfully updated 😀',
        okAction: {
          label: 'Nice',
          onClick: () => navigate({ to: '/image' })
        }
      });
      getContext().queryClient.invalidateQueries({ queryKey: [QUERY_KEY.IMAGE] });
    },
    onError: (e: AxiosCustomError) => usualErrorHandler(show, e)
  });

  const form = useAppForm({
    ...formOption,
    defaultValues: {
      id: data.id,
      description: data.description || "",
      name: data.name,
      tags: data.tags,
      source: data.source,
      ageRating: data.ageRating,
    } satisfies updateImageSchemaType,
    onSubmit: async ({ value }) => {
      await mutateAsync(value);
    }
  })

  return (
    <form.AppForm>
      <form.FormContainer className='flex gap-4 flex-col p-4'>
        <Typography variant='h4' className='font-bold'>Update Image</Typography>
        <Box className='flex flex-col gap-2'>
          <Typography variant='h6'>1. Check Your Image</Typography>
          <Divider />
        </Box>
        <Box className='flex justify-center items-center'>
          <img src={data.image} alt={data.id} className='h-40' />
        </Box>
        <Box className='flex flex-col gap-2'>
          <Typography variant='h6'>2. Additional Info</Typography>
          <Divider />
        </Box>
        <form.AppField name='name'>
          {
            (field) => <field.FormTextField label='Name' />
          }
        </form.AppField>
        <form.AppField name='description'>
          {
            (field) => <field.FormTextArea label='Description' />
          }
        </form.AppField>
        <form.AppField name='tags'>
          {
            (field) => <field.FormTagInput label='Tags' />
          }
        </form.AppField>
        <form.AppField name='source'>
          {
            (field) => <field.FormTextField label='Source' />
          }
        </form.AppField>
        <form.AppField name='ageRating'>
          {
            (field) => <field.FormSelect label='Age Rating' options={AGE_RATING_SELECT} />
          }
        </form.AppField>
        <form.Subscribe selector={x => x.values.ageRating}>
          {
            (ageRating) => (
              <>
                {
                  ageRating === AGE_RATING_ENUM.EXPLICIT && (
                    <Alert severity='error'>
                      Explicit content will be blurred by default and only viewable by changing the filter (which is GENERAL by default) in user settings.
                    </Alert>
                  )
                }
                {
                  ageRating === AGE_RATING_ENUM.MATURE && (
                    <Alert severity='warning'>
                      Mature content will just be marked as Mature. Users will be able to see it by changing the filter (which is GENERAL by default) in user settings.
                    </Alert>
                  )
                }
              </>
            )
          }
        </form.Subscribe>
        <Box className='flex flex-col gap-2'>
          <Typography variant='h6'>3. Review your Submission</Typography>
          <Divider />
        </Box>
        <form.Subscribe selector={x => ({ values: x.values, isValid: x.isFormValid })}>
          {
            ({ values, isValid }) => isValid ? (
              <Box className='flex max-md:flex-col gap-4 bg-gray-700/30 p-4 rounded'>
                <Box className='flex flex-col'>
                  <Box className='flex justify-center'>
                    <img src={data.image} alt={data.id} className='h-40' />
                  </Box>
                </Box>
                <Box className='flex flex-col'>
                  <Typography variant='body1'><strong>Name:</strong> {values.name}</Typography>
                  <Typography variant='body1'><strong>Description:</strong> {values.description}</Typography>
                  <Typography variant='body1'><strong>Tags:</strong> {values.tags.join(', ')}</Typography>
                  <Typography variant='body1'><strong>Source:</strong> {values.source}</Typography>
                  <Typography variant='body1'><strong>Age Rating:</strong> {values.ageRating}</Typography>
                </Box>
              </Box>
            ) : (
              <Alert severity='error'>Please recheck your submission. Something is not quite right 🤔.</Alert>
            )
          }
        </form.Subscribe>
        <Box className='flex flex-col gap-2'>
          <Typography variant='h6'>4. Submit!</Typography>
          <Divider />
        </Box>
        <form.FormSubmitButton>Submit</form.FormSubmitButton>
      </form.FormContainer>
    </form.AppForm>
  );
}