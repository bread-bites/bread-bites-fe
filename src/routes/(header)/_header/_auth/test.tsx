import { useAppForm } from '@/hooks/form-hook';
import { createFileRoute } from '@tanstack/react-router'
import z from 'zod';

export const Route = createFileRoute('/(header)/_header/_auth/test')({
  component: RouteComponent,
});

const searchParamSchema = z.object({
  tag: z.array(z.string()).min(1, "Tag is required"),
  description: z.string().min(1, "Description is required")
});
type searchParamSchemaType = z.infer<typeof searchParamSchema>;

function RouteComponent() {
  const form = useAppForm({
    defaultValues: {
      tag: [],
      description: ''
    } as searchParamSchemaType,
    validators: {
      onChange: searchParamSchema
    },
    onSubmit: ({ value }) => {
      console.log(value);
    }
  });

  return (
    <form.AppForm>
      <form.FormContainer className='p-10 flex flex-col gap-5'>
        <form.AppField name='tag'>
          {
            (field) => <field.FormNewTagInput label='Test Tag' />
          }
        </form.AppField>
        <form.AppField name='description'>
          {
            (field) => <field.FormTextArea label='Description' />
          }
        </form.AppField>
      </form.FormContainer>
    </form.AppForm>
  )
}
