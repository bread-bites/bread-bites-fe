import { useAppForm } from '@/hooks/form-hook';
import { createFileRoute } from '@tanstack/react-router'
import z from 'zod';

export const Route = createFileRoute('/(header)/_header/_auth/test')({
  component: RouteComponent,
});

const searchParamSchema = z.object({
  tag: z.array(z.string()).optional(),
});
type searchParamSchemaType = z.infer<typeof searchParamSchema>;

function RouteComponent() {
  const form = useAppForm({
    defaultValues: {
      tag: []
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
      <form.AppField name='tag'>
        {
          (field) => <field.FormNewTagInput label='Test Tag' />
        }
      </form.AppField>
    </form.AppForm>
  )
}
