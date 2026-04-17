import { AGE_RATING_ENUM } from "@/constants/age-rating";
import { withFieldGroup } from "@/hooks/form-hook";
import { m } from "@paraglide/messages";
import { z } from "zod";

const searchParamSchema = z.object({
  tag: z.array(z.string()).optional(),
  ageRating: z.enum(AGE_RATING_ENUM).optional(),
});
type searchParamSchemaType = z.infer<typeof searchParamSchema>;

const defaultValues: searchParamSchemaType = {
  ageRating: AGE_RATING_ENUM.GENERAL,
  tag: [],
}

const MainMenuSearchFields = withFieldGroup({
  defaultValues,
  props: {
    children: undefined
  } as {
    children?: React.ReactNode
  },
  render: ({ group, children }) => {
    return (
      <div className='md:sticky top-0 z-50 pb-3 inset-0 bg-linear-to-b from-background via-background/95 to-background/80 backdrop-blur-xl border-b border-b-white/10'>
        <group.FormContainer className='relative flex w-full flex-col gap-3 px-6 pt-5 pb-4'>
          <div className='flex w-full gap-4 items-end max-md:flex-col max-md:gap-2'>
            <group.AppField name='ageRating'>
              {
                (field) => <field.FormAgeRating className='max-md:w-full w-50 shrink-0' />
              }
            </group.AppField>
            <group.AppField name='tag'>
              {
                (field) => <field.FormNewTagInput className='grow min-w-0' />
              }
            </group.AppField>
            <group.FormSubmitButton className='shrink-0 max-md:w-full'>
              {m.main_search_button()}
            </group.FormSubmitButton>
          </div>
          {children}
        </group.FormContainer>
      </div>
    )
  }
});

export default MainMenuSearchFields;