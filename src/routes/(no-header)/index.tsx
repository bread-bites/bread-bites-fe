import { useAppForm } from '@/hooks/form-hook'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import z from 'zod'
import ImageIcon from '@mui/icons-material/Image';
import ArticleIcon from '@mui/icons-material/Article';
import { SignInButton } from '@clerk/clerk-react';
import { m } from "@paraglide/messages";
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

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
    <div className='w-full h-full min-h-[100svh] flex flex-col justify-center items-center p-32 max-md:p-12 gap-4'>
      {
        login && <p>Login first ah</p>
      }
      <h1 className='text-8xl! max-md:text-6xl! text-center font-bold dark'>{mainGreeting}</h1>
      <p className='text-2xl! max-md:text-lg! text-center'>{mainTypeHere}</p>
      <form.AppForm>
        <form.FormContainer className='flex gap-4 mt-6 max-md:flex-col w-full'>
          <form.AppField name='option'>
            {
              (field) => (
                <ToggleGroup onValueChange={(v) => field.handleChange(v[0] as "image" | "text")} value={[field.state.value]}>
                  <Tooltip>
                    <TooltipTrigger>
                      <ToggleGroupItem className="max-md:grow" value={SelectionType.Image}>
                        <ImageIcon />
                      </ToggleGroupItem>
                    </TooltipTrigger>
                    <TooltipContent>Image</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger>
                      <ToggleGroupItem className="max-md:grow" value={SelectionType.Text}>
                        <ArticleIcon />
                      </ToggleGroupItem>
                    </TooltipTrigger>
                    <TooltipContent>Text</TooltipContent>
                  </Tooltip>
                </ToggleGroup>
              )
            }
          </form.AppField>
          <form.AppField name='tag'>
            {
              // (field) => <field.FormTagInput size='medium' className='grow!' />
              (field) => <div className='w-full'>
                <field.FormNewTagInput />
              </div>
            }
          </form.AppField>
        </form.FormContainer>
      </form.AppForm>
      <div className='flex gap-8'>
        <SignInButton>
          <Button>{mainLogin}</Button>
        </SignInButton>
        <form.AppForm>
          <form.FormSubmitButton onClick={() => form.handleSubmit()} color='primary'>{mainSearchButton}</form.FormSubmitButton>
        </form.AppForm>
      </div>
    </div>
  )
}
