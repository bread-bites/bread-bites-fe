import { useAppForm } from '@/hooks/form-hook'
import { Alert, Box, Button, ToggleButton, ToggleButtonGroup, Tooltip, Typography } from '@mui/material'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import z from 'zod'
import ImageIcon from '@mui/icons-material/Image';
import ArticleIcon from '@mui/icons-material/Article';
import { SignInButton } from '@clerk/clerk-react';
import { m } from "@paraglide/messages";

const searchParamSchema = z.object({ login: z.boolean().optional() });

export const Route = createFileRoute('/(no-header)/')({
  component: RouteComponent,
  validateSearch: (d) => searchParamSchema.parse(d),
  loader: async () => ({
    mainGreeting: m.main_greeting(),
    mainTypeHere: m.main_type_here(),
    mainLogin: m.main_login(),
    mainSearchButton: m.main_search_button()
  })
});

const SelectionType = {
  Image: 'image',
  Text: 'text'
} as const
const formSchema = z.object({ tag: z.array(z.string()).optional(), option: z.enum(SelectionType) })

function RouteComponent() {
  const navigation = useNavigate();
  const { login } = Route.useSearch();
  const { mainGreeting, mainTypeHere, mainLogin, mainSearchButton } = Route.useLoaderData();

  const form = useAppForm({
    defaultValues: {
      option: SelectionType.Image,
      tag: []
    } as z.infer<typeof formSchema>,
    validators: {
      onChangeAsync: formSchema
    },
    onSubmit: ({ value }) => {
      navigation({
        to: value.option === SelectionType.Image ? '/image' : '/text',
        search: { tag: value.tag },
      })
    }
  });

  return (
    <Box className='w-full h-full min-h-[100svh] flex flex-col justify-center items-center p-32 max-md:p-12 gap-4'>
      {
        login && <Alert severity='error'>Login first ah</Alert>
      }
      <Typography variant='h1' className='text-8xl! max-md:text-6xl! text-center' fontWeight={700}>{mainGreeting}</Typography>
      <Typography className='text-2xl! max-md:text-lg! text-center'>{mainTypeHere}</Typography>
      <form.AppForm>
        <form.FormContainer className='flex gap-4 mt-6 max-md:flex-col w-full'>
          <form.AppField name='option'>
            {
              (field) => (
                <ToggleButtonGroup size='large' exclusive value={field.state.value} onChange={(_, value) => {
                  field.handleChange(value);
                }}>
                  <Tooltip title='Reaction Images'>
                    <ToggleButton className="max-md:grow" value={SelectionType.Image}>
                      <ImageIcon />
                    </ToggleButton>
                  </Tooltip>
                  <Tooltip title='Copypasta'>
                    <ToggleButton className="max-md:grow" value={SelectionType.Text}>
                      <ArticleIcon />
                    </ToggleButton>
                  </Tooltip>
                </ToggleButtonGroup>
              )
            }
          </form.AppField>
          <form.AppField name='tag'>
            {
              (field) => <field.FormTagInput size='medium' className='grow!' />
            }
          </form.AppField>
        </form.FormContainer>
      </form.AppForm>
      <Box className='flex gap-8'>
        <SignInButton>
          <Button variant='contained' color='success'>{mainLogin}</Button>
        </SignInButton>
        <form.AppForm>
          <form.FormSubmitButton onClick={() => form.handleSubmit()} color='primary'>{mainSearchButton}</form.FormSubmitButton>
        </form.AppForm>
      </Box>
    </Box>
  )
}
