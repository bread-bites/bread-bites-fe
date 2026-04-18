import { insertText, insertTextSchema, insertTextSchemaType } from '@/api/text';
import RefinedAlert from '@/components/ui/refined-alert';
import { Separator } from '@/components/ui/separator';
import { AGE_RATING_ENUM, AGE_RATING_ENUM_TYPE_VALUE, getAgeRatingLabel } from '@/constants/age-rating';
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
import { createFileRoute, redirect } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start';

export const Route = createFileRoute('/(header)/_header/_auth/text/insert')({
  component: RouteComponent,
  head: () => createHead(m.insert_text_title()),
  beforeLoad: ({ context }) => {
    if (!context.userID) throw redirect({ to: '/', search: { login: true } });
  }
});

const formOption = formOptions({
  defaultValues: {
    description: '',
    title: '',
    content: '',
    tags: [] as string[],
    source: '',
    ageRating: AGE_RATING_ENUM.GENERAL as unknown as AGE_RATING_ENUM_TYPE_VALUE,
  } satisfies insertTextSchemaType,
  validators: {
    onChange: insertTextSchema
  },
})

function RouteComponent() {
  const navigate = Route.useNavigate();
  const insertTextEndpoint = useServerFn(insertText);
  const { show } = useModal();

  const { mutateAsync } = useMutation({
    mutationKey: [QUERY_KEY.TEXT],
    mutationFn: async (data: insertTextSchemaType) => await insertTextEndpoint({ data: objectToFormData(data) }),
    onSuccess: () => {
      show({
        title: m.success(),
        type: 'success',
        message: m.content_success(),
        okAction: {
          label: m.ok(),
          onClick: () => navigate({ to: '/text' })
        }
      });
      getContext().queryClient.invalidateQueries({ queryKey: [QUERY_KEY.TEXT] });
    },
    onError: (e: AxiosCustomError) => usualErrorHandler(show, e)
  });

  const form = useAppForm({
    ...formOption,
    onSubmit: async ({ value }) => {
      await mutateAsync(value);
    }
  })

  return (
    <form.AppForm>
      <form.FormContainer className='flex gap-4 flex-col p-4'>
        <p className='font-bold text-3xl'>{m.insert_text_title()}</p>
        <div className='flex flex-col gap-2'>
          <p className='text-lg font-semibold'>1. {m.insert_text_upload()}</p>
          <Separator />
        </div>
        <form.AppField name='content'>
          {
            (field) => <field.FormTextArea minRows={15} label={m.text()} topLabel />
          }
        </form.AppField>
        <div className='flex flex-col gap-2'>
          <p className='text-lg font-semibold'>2. {m.insert_text_info()}</p>
          <Separator />
        </div>
        <form.AppField name='title'>
          {
            (field) => <field.FormTextField label={m.title()} topLabel />
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
          <p className='text-lg font-semibold'>3. {m.insert_text_review()}</p>
          <Separator />
        </div>
        <form.Subscribe selector={x => ({ values: x.values, isValid: x.isFormValid })}>
          {
            ({ values, isValid }) => isValid && values.content ? (
              <div className='flex flex-col gap-4 bg-gray-700/30 p-4 rounded'>
                <div className='flex justify-center whitespace-pre-line border-gray-400/30 border-2 rounded p-2 text-sm text-justify'>
                  {values.content}
                </div>
                <div className='flex flex-col'>
                  <p><strong>{m.title()}:</strong> {values.title}</p>
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
          <p className='text-lg font-semibold'>4. {m.insert_text_submit()}</p>
          <Separator />
        </div>
        <form.FormSubmitButton>{m.insert_text_submit()}</form.FormSubmitButton>
      </form.FormContainer>
    </form.AppForm>
  );
}