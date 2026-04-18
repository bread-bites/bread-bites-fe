import { getImageByID, updateImage, updateImageSchema, updateImageSchemaType } from '@/api/image';
import RefinedAlert from '@/components/ui/refined-alert';
import { Separator } from '@/components/ui/separator';
import { AGE_RATING_ENUM, getAgeRatingLabel } from '@/constants/age-rating';
import { QUERY_KEY } from '@/constants/query-key';
import { useAppForm } from '@/hooks/form-hook';
import useModal, { usualErrorHandler } from '@/hooks/modal-hook-provider';
import { getContext } from '@/integrations/tanstack-query/root-provider';
import { AxiosCustomError } from '@/model/axios-error';
import { objectToFormData } from '@/utilities/frontend-api';
import { createHead } from '@/utilities/head';
import { m } from '@paraglide/messages';
import { formOptions } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start';

export const Route = createFileRoute('/(header)/_header/_auth/image/$id/update')({
  component: RouteComponent,
  head: () => createHead(m.update_image_title()),
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
        title: m.success(),
        type: 'success',
        message: m.content_update(),
        okAction: {
          label: m.ok(),
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
        <p className='font-bold text-3xl'>{m.update_image_title()}</p>
        <div className='flex flex-col gap-2'>
          <p className='text-lg font-semibold'>1. {m.update_image_recheck()}</p>
          <Separator />
        </div>
        <div className='flex justify-center items-center'>
          <img src={data.image} alt={data.id} className='max-h-60 rounded-sm' />
        </div>
        <div className='flex flex-col gap-2'>
          <p className='text-lg font-semibold'>2. {m.insert_image_info()}</p>
          <Separator />
        </div>
        <form.AppField name='name'>
          {
            (field) => <field.FormTextField label={m.name()} topLabel />
          }
        </form.AppField>
        <form.AppField name='description'>
          {
            (field) => <field.FormTextArea label={m.description()} topLabel />
          }
        </form.AppField>
        <form.AppField name='tags'>
          {
            (field) => <field.FormNewTagInput label={m.form_tags_label()} topLabel />
          }
        </form.AppField>
        <form.AppField name='source'>
          {
            (field) => <field.FormTextField label={m.source()} topLabel />
          }
        </form.AppField>
        <form.AppField name='ageRating'>
          {
            (field) => <field.FormAgeRating topLabel />
          }
        </form.AppField>
        <form.Subscribe selector={x => x.values.ageRating}>
          {
            (ageRating) => (
              <>
                {
                  ageRating === AGE_RATING_ENUM.EXPLICIT && (
                    <RefinedAlert variant='destructive' title={m.content_explicit_warning_title()}>
                      {m.content_explicit_warning_message()}
                    </RefinedAlert>
                  )
                }
                {
                  ageRating === AGE_RATING_ENUM.MATURE && (
                    <RefinedAlert variant='warning' title={m.content_mature_warning_title()}>
                      {m.content_mature_warning_message()}
                    </RefinedAlert>
                  )
                }
              </>
            )
          }
        </form.Subscribe>
        <div className='flex flex-col gap-2'>
          <p className='text-lg font-semibold'>3. {m.insert_image_review()}</p>
          <Separator />
        </div>
        <form.Subscribe selector={x => ({ values: x.values, isValid: x.isFormValid })}>
          {
            ({ values, isValid }) => isValid ? (
              <div className='flex max-md:flex-col gap-4 bg-gray-700/30 p-4 rounded'>
                <div className='flex flex-col'>
                  <div className='flex justify-center'>
                    <img src={data.image} alt={data.id} className='max-w-full max-h-60' />
                  </div>
                </div>
                <div className='flex flex-col'>
                  <p><strong>{m.name()}:</strong> {values.name}</p>
                  <p><strong>{m.description()}:</strong> {values.description}</p>
                  <p><strong>{m.form_tags_label()}:</strong> {values.tags.join(', ')}</p>
                  <p><strong>{m.source()}:</strong> {values.source}</p>
                  <p><strong>{m.age_rating()}:</strong> {getAgeRatingLabel(values.ageRating)}</p>
                </div>
              </div>
            ) : (
              <RefinedAlert title='' variant='destructive'>{m.content_error()}</RefinedAlert>
            )
          }
        </form.Subscribe>
        <div className='flex flex-col gap-2'>
          <p className='text-lg font-semibold'>4. {m.insert_image_submit()}</p>
          <Separator />
        </div>
        <form.FormSubmitButton>{m.insert_image_submit()}</form.FormSubmitButton>
      </form.FormContainer>
    </form.AppForm>
  );
}