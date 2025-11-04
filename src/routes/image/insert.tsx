import { useAppForm } from '@/hooks/form-hook';
import { Box, Typography } from '@mui/material'
import { formOptions } from '@tanstack/react-form';
import { createFileRoute } from '@tanstack/react-router'
import z from 'zod';

export const Route = createFileRoute('/image/insert')({
  component: RouteComponent,
});

const formSchema = z.object({
  name: z.string().min(1, "Give a name for better searching").max(50),
  description: z.string().max(4000),
  image: z.file().mime(["image/jpeg", "image/png", "image/webp"]).max(1024 * 50),
  tag: z.array(z.string()).min(1)
});
type formSchemaType = z.infer<typeof formSchema>;

const formOption = formOptions({
  defaultValues: {
    description: '',
    name: '',
    tag: [] as string[],
    image: undefined as unknown as File
  } satisfies formSchemaType,
  validators: {
    onChange: formSchema
  },
})

function RouteComponent() {
  
  const form = useAppForm({
    ...formOption,
    onSubmit: ({ value }) => {

    }
  })

  return (
    <Box>
      <Typography variant='h4' className='font-bold'>Insert Image</Typography>
      <form.AppForm>
        <form.FormContainer className='flex gap-4 flex-col'>
          <form.AppField name='name'>
            {
              (field) => <field.FormTextField label='Name'/>
            }
          </form.AppField>
          <form.AppField name='description'>
            {
              (field) => <field.FormTextArea label='Description'/>
            }
          </form.AppField>
        </form.FormContainer>
      </form.AppForm>
    </Box>
  )
}