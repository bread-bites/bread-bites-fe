import { getTextByID, updateText, updateTextSchema, updateTextSchemaType } from '@/api/text';
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

export const Route = createFileRoute('/(header)/_header/_auth/text/$id/update')({
  component: RouteComponent,
  loader: async ({ params }) => (await getTextByID({ data: params.id })).data,
});

const formOption = formOptions({
  validators: {
    onChange: updateTextSchema
  },
})

function RouteComponent() {
  const data = Route.useLoaderData();
  const navigate = Route.useNavigate();
  const updateTextEndpoint = useServerFn(updateText);
  const { show } = useModal();

  const { mutateAsync } = useMutation({
    mutationKey: [QUERY_KEY.TEXT],
    mutationFn: async (data: updateTextSchemaType) => await updateTextEndpoint({ data: objectToFormData(data) }),
    onSuccess: () => {
      show({
        title: 'Success',
        type: 'success',
        message: 'Yay, your copypasta is successfully updated 😀',
        okAction: {
          label: 'Nice',
          onClick: () => navigate({ to: '/text' })
        }
      });
      getContext().queryClient.invalidateQueries({ queryKey: [QUERY_KEY.TEXT] });
    },
    onError: (e: AxiosCustomError) => usualErrorHandler(show, e)
  });

  const form = useAppForm({
    ...formOption,
    defaultValues: {
      id: data.id,
      description: data.description || "",
      title: data.title,
      content: data.content,
      tags: data.tags,
      source: data.source,
      ageRating: data.ageRating,
    } satisfies updateTextSchemaType,
    onSubmit: async ({ value }) => {
      await mutateAsync(value);
    }
  })

  return (
    <form.AppForm>
      <form.FormContainer className='flex gap-4 flex-col p-4'>
        <Typography variant='h4' className='font-bold'>Update Text</Typography>
        <Box className='flex flex-col gap-2'>
          <Typography variant='h6'>1. Cook</Typography>
          <Divider />
        </Box>
        <form.AppField name='content'>
          {
            (field) => <field.FormTextArea minRows={15} label='Content' />
          }
        </form.AppField>
        <Box className='flex flex-col gap-2'>
          <Typography variant='h6'>2. Additional Info</Typography>
          <Divider />
        </Box>
        <form.AppField name='title'>
          {
            (field) => <field.FormTextField label='Title' />
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
            ({ values, isValid }) => isValid && values.content ? (
              <Box className='flex flex-col gap-4 bg-gray-700/30 p-4 rounded'>
                <Box className='flex justify-center whitespace-pre-line border-gray-400/30 border-2 rounded p-2 text-sm text-justify'>
                  {values.content}
                </Box>
                <Box className='flex flex-col'>
                  <Typography variant='body1'><strong>Title:</strong> {values.title}</Typography>
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