import { getImageByID } from '@/api/image'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { AGE_RATING_ENUM, getAgeRatingLabel } from '@/constants/age-rating';
import { useAppForm } from '@/hooks/form-hook';
import { z } from 'zod';
import { m } from '@paraglide/messages';
import ImageDownloadButton from '@/components/app/image/ImageDownloadButton';
import ImageDeleteButton from '@/components/app/image/ImageDeleteButton';
import ImageUpdateButton from '@/components/app/image/ImageUpdateButton';
import Chip from '@/components/ui/chip';
import { Calendar } from 'lucide-react';

const searchParamSchema = z.object({
  tag: z.array(z.string()).optional(),
  ageRating: z.enum(AGE_RATING_ENUM).optional(),
});
type searchParamSchemaType = z.infer<typeof searchParamSchema>;

export const Route = createFileRoute('/(header)/_header/image_/$id')({
  component: RouteComponent,
  loader: async ({ params }) => (await getImageByID({ data: params.id })).data,
  validateSearch: (search) => searchParamSchema.parse(search),
})

function RouteComponent() {
  const data = Route.useLoaderData();
  const { tag: defaultTag, ageRating: defaultAgeRating } = Route.useSearch() as z.infer<typeof searchParamSchema>;
  const navigate = useNavigate();

  const defaultValue: searchParamSchemaType = {
    ageRating: defaultAgeRating ?? AGE_RATING_ENUM.GENERAL,
    tag: defaultTag ?? [],
  }

  const form = useAppForm({
    defaultValues: defaultValue,
    validators: {
      onChange: searchParamSchema
    },
    onSubmit: ({ value }) => {
      navigate({
        to: '/image',
        search: value
      });
    }
  });

  return (
    <div className='flex flex-col relative'>
      <form.AppForm>
        <div className='sticky top-0 z-50 pb-3 inset-0 bg-linear-to-b from-background via-background/95 to-background/80 backdrop-blur-xl border-b border-b-white/10'>
          <form.FormContainer className='relative flex w-full flex-col gap-3 px-6 pt-5 pb-4'>
            <div className='flex w-full gap-4 items-end'>
              <form.AppField name='ageRating'>
                {
                  (field) => <field.FormAgeRating className='w-full sm:w-50 shrink-0' />
                }
              </form.AppField>
              <form.AppField name='tag'>
                {
                  (field) => <field.FormNewTagInput className='grow min-w-0'/>
                }
              </form.AppField>
              <form.FormSubmitButton className='shrink-0'>
                {m.main_search_button()}
              </form.FormSubmitButton>
            </div>
          </form.FormContainer>
        </div>
      </form.AppForm>

      {/* Image Detail Content */}
      <div className='px-6 pt-6 pb-8 flex justify-center'>
        <div className='w-full max-w-4xl flex flex-col gap-6'>
          {/* Image Container */}
          <div className='relative rounded-lg overflow-hidden border border-white/10 bg-card/50 backdrop-blur-sm shadow-2xl'>
            <img 
              src={data.image} 
              alt={data.name} 
              className='w-full h-auto object-contain max-h-[70vh]'
            />
          </div>

          {/* Details Section */}
          <div className='flex flex-col gap-6 p-6 rounded-lg border border-white/10 bg-card/50 backdrop-blur-sm'>
            {/* Title and Age Rating */}
            <div className='flex items-start justify-between gap-4'>
              <h1 className='text-3xl font-bold text-foreground'>{data.name}</h1>
              <span className='shrink-0 px-3 py-1 rounded-md bg-secondary text-secondary-foreground text-sm font-medium'>
                {getAgeRatingLabel(data.ageRating)}
              </span>
            </div>

            {/* Meta Information */}
            <div className='flex flex-wrap gap-4 text-sm text-muted-foreground'>
              <div className='flex items-center gap-2'>
                <Calendar className='size-4' />
                <span>{new Date(data.uploadDate).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Source */}
            <div className='flex flex-col gap-2'>
              <h2 className='text-sm font-semibold text-muted-foreground'>🍅 { m.source() }</h2>
              <p className='text-base wrap-break-word'>{data.source ?? '-'}</p>
            </div>

            {/* Description */}
            {data.description && (
              <div className='flex flex-col gap-2'>
                <h2 className='text-sm font-semibold text-muted-foreground'>📃 { m.description() }</h2>
                <p className='text-base wrap-break-word whitespace-pre-wrap'>{data.description}</p>
              </div>
            )}

            {/* Tags */}
            <div className='flex flex-col gap-3'>
              <h2 className='text-sm font-semibold text-muted-foreground'>🏷️ { m.form_tags_label() }</h2>
              <div className='flex flex-wrap gap-2'>
                {
                  data.tags.map(tag => (
                    <form.Subscribe key={tag} selector={x => x.values.tag}>
                      {
                        (tagValue) => (
                          <Chip
                            label={tag}
                            onClick={() => {
                              if (!(tagValue ?? []).includes(tag)) {
                                form.setFieldValue('tag', [...(tagValue ?? []), tag])
                              }
                            }}
                          />
                        )
                      }
                    </form.Subscribe>
                  ))
                }
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex gap-3 pt-4 border-t border-white/10'>
              <ImageDownloadButton link={data.image} myImage={data.myImage} />
              {data.myImage && <ImageUpdateButton id={data.id} />}
              {data.myImage && <ImageDeleteButton image={data.image} id={data.id} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
