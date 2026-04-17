import { useAppForm } from '@/hooks/form-hook'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import z from 'zod'
import { SignedOut, SignInButton } from '@clerk/clerk-react';
import { m } from "@paraglide/messages";
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { FileTextIcon, ImageIcon } from 'lucide-react';
import RefinedAlert from '@/components/ui/refined-alert';

const searchParamSchema = z.object({ login: z.boolean().optional() });

export const Route = createFileRoute('/(no-header)/')({
  component: RouteComponent,
  validateSearch: (d) => searchParamSchema.parse(d)
});

const SelectionType = {
  Image: 'image',
  Text: 'text'
} as const
const formSchema = z.object({ tag: z.array(z.string()).optional(), option: z.enum(SelectionType) })

function RouteComponent() {
  const navigation = useNavigate();
  const { login } = Route.useSearch();

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
        search: { tag: value.tag?.length ? value.tag : undefined },
      })
    }
  });

  return (
    <div className='w-full h-full min-h-svh flex flex-col justify-center items-center p-32 max-md:p-12 gap-4'>
      {
        login && <RefinedAlert variant='destructive'>{m.main_please_login()}</RefinedAlert>
      }
      <h1 className='text-8xl! max-md:text-6xl! text-center font-bold dark'>{m.main_greeting()}</h1>
      <p className='text-2xl! max-md:text-lg! text-center'>{m.main_type_here()}</p>
      <form.AppForm>
        <form.FormContainer className='flex gap-4 mt-6 max-md:flex-col w-full max-md:items-center'>
          <form.AppField name='option'>
            {
              (field) => (
                <ToggleGroup className='gap-2 max-md:justify-center' onValueChange={(v) => field.handleChange(v[0] as "image" | "text")} value={[field.state.value]}>
                  <Tooltip>
                    <TooltipTrigger render={<div></div>}>
                      <ToggleGroupItem className="max-md:grow" value={SelectionType.Image}>
                        <ImageIcon size={28} />
                      </ToggleGroupItem>
                    </TooltipTrigger>
                    <TooltipContent>{m.image()}</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger render={<div></div>}>
                      <ToggleGroupItem className="max-md:grow" value={SelectionType.Text}>
                        <FileTextIcon size={28} />
                      </ToggleGroupItem>
                    </TooltipTrigger>
                    <TooltipContent>{m.text()}</TooltipContent>
                  </Tooltip>
                </ToggleGroup>
              )
            }
          </form.AppField>
          <form.AppField name='tag'>
            {
              (field) => <div className='w-full'>
                <field.FormNewTagInput />
              </div>
            }
          </form.AppField>
        </form.FormContainer>
      </form.AppForm>
      <div className='flex gap-8'>
        <SignedOut>
          <SignInButton>
            <Button>{m.main_login()}</Button>
          </SignInButton>
        </SignedOut>
        <form.AppForm>
          <form.FormSubmitButton onClick={() => form.handleSubmit()}>{m.main_search_button()}</form.FormSubmitButton>
        </form.AppForm>
      </div>
    </div>
  )
}
