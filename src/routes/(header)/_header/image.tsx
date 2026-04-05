import { AGE_RATING_ENUM } from '@/constants/age-rating';
import { useAppForm } from '@/hooks/form-hook';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import { useInfiniteQuery } from '@tanstack/react-query';
import { QUERY_KEY } from '@/constants/query-key';
import { useServerFn } from '@tanstack/react-start';
import { getImage } from '@/api/image';
import Masonry from '@mui/lab/Masonry';
import ImageDownloadButton from '@/components/app/image/ImageDownloadButton';
import ImageDeleteButton from '@/components/app/image/ImageDeleteButton';
import ImageUpdateButton from '@/components/app/image/ImageUpdateButton';
import { m } from '@paraglide/messages';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Chip from '@/components/ui/chip';

const searchParamSchema = z.object({
  tag: z.array(z.string()).optional(),
  ageRating: z.enum(AGE_RATING_ENUM).optional(),
  pageSize: z.number().optional()
});
type searchParamSchemaType = z.infer<typeof searchParamSchema>;

export const Route = createFileRoute('/(header)/_header/image')({
  component: RouteComponent,
  loader: () => ({
    formAgeLabel: m.age_rating(),
    mainSearchButton: m.main_search_button()
  }),
  validateSearch: (search) => searchParamSchema.parse(search),
});

function RouteComponent() {
  const { tag: defaultTag, ageRating: defaultAgeRating } = Route.useSearch() as z.infer<typeof searchParamSchema>;
  const defaultValue: searchParamSchemaType = {
    pageSize: 20,
    ageRating: defaultAgeRating ?? AGE_RATING_ENUM.GENERAL,
    tag: defaultTag ?? [],
  }

  const getImageEndpoint = useServerFn(getImage);
  const navigate = useNavigate();

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

  const { data, hasNextPage, fetchNextPage, isFetching } = useInfiniteQuery({
    queryKey: [QUERY_KEY.IMAGE, defaultValue],
    queryFn: async ({ pageParam }) => await getImageEndpoint({
      data: {
        currentPage: pageParam,
        pageSize: defaultValue.pageSize ?? 50,
        ageRating: defaultValue.ageRating ?? AGE_RATING_ENUM.GENERAL,
        tag: defaultValue.tag ?? []
      }
    }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.pagination.isLastPage ? undefined : lastPage.pagination.currentPage + 1
  });

  return (
    <div className='flex flex-col relative'>
      <form.AppForm>
        <div className='sticky top-0 z-50 pb-3 inset-0 bg-gradient-to-b from-background via-background/95 to-background/80 backdrop-blur-xl border-b border-b-white/10'>
          <form.FormContainer className='relative flex w-full flex-col gap-3 px-6 pt-5 pb-4'>
            <div className='flex w-full gap-4 items-end'>
              <form.AppField name='ageRating'>
                {
                  (field) => <field.FormAgeRating className='w-full sm:w-[200px] flex-shrink-0' />
                }
              </form.AppField>
              <form.AppField name='tag'>
                {
                  (field) => <field.FormNewTagInput className='grow min-w-0'/>
                }
              </form.AppField>
              <form.FormSubmitButton className='flex-shrink-0'>
                {m.main_search_button()}
              </form.FormSubmitButton>
            </div>

            {/* Stats bar with subtle design */}
            {data && (
              <div className='flex items-center justify-center text-xs text-muted-foreground/60'>
                {m.result_image_total({ totalData: data.pages[0].pagination.totalData })} • {m.result_image_page({ 
                  pageLoaded: (data.pages.length ?? 0).toString(), 
                  totalPages: Math.ceil(data.pages[0].pagination.totalData / data.pages[0].pagination.pageSize).toString() 
                })}
              </div>
            )}
          </form.FormContainer>
        </div>
      </form.AppForm>

      {/* Result area (infinite query) with enhanced styling */}
      <div className='px-6 pt-2 pb-8 flex flex-col gap-6 justify-center items-center'>
        {
          !data ? (
            <div className='w-full flex flex-col gap-4 flex-wrap'>
              { [...Array(4)].map((_, index) => (
                <Skeleton key={index} className='h-48 rounded-md' />
              ))}
            </div>
          ) : (
            <div className='w-full flex justify-center'>
              <Masonry columns={{
                xl: Math.min(6, data.pages[0].pagination.totalData),
                lg: Math.min(5, data.pages[0].pagination.totalData),
                md: Math.min(4, data.pages[0].pagination.totalData),
                sm: Math.min(2, data.pages[0].pagination.totalData)
              }}
                spacing={3}
                defaultHeight={450}
                defaultColumns={4}
                defaultSpacing={2}
              >
                {
                  data.pages.flatMap(x => x.data).map(image => (
                    <div 
                      className='group flex flex-col rounded-sm gap-4 p-3 border border-white/10 bg-card/50 backdrop-blur-sm ' 
                      key={image.id}
                    >
                      <div className='overflow-hidden rounded-sm'>
                        <img 
                          src={image.image} 
                          alt={image.name} 
                          className='w-full h-auto object-cover'
                        />
                      </div>
                      <div>
                        <p className='text-xs! wrap-break-word'>🍅: {image.source ?? '-'}</p>
                        <p className='text-xs! wrap-break-word'>📃: {image.description ?? '-'}</p>
                      </div>
                      <div className='flex flex-wrap gap-2'>
                        {
                          image.tags.map(tag => (
                            <form.Subscribe key={tag} selector={x => x.values.tag}>
                              {
                                (tagValue) => (
                                  <Chip
                                    label={tag}
                                    onClick={() => {
                                      if (!(tagValue ?? []).includes(tag)) form.setFieldValue('tag', [...(tagValue ?? []), tag])
                                    }}
                                  />
                                )
                              }
                            </form.Subscribe>
                          ))
                        }
                      </div>
                      <div className='flex gap-2'>
                        <ImageDownloadButton link={image.image} myImage={image.myImage} />
                        {
                          image.myImage && <ImageDeleteButton image={image.image} id={image.id} />
                        }
                        {
                          image.myImage && <ImageUpdateButton id={image.id} />
                        }
                      </div>
                    </div>
                  ))
                }
              </Masonry>
            </div>
          )
        }
        {
          hasNextPage && (
            <div className='w-full flex px-4'>
              <Button
                className='grow rounded-xl bg-gradient-to-r from-muted/50 to-muted/30 hover:from-primary/20 hover:to-primary/10 border border-white/10 hover:border-primary/50 transition-all duration-300'
                variant='outline'
                disabled={isFetching}
                onClick={() => fetchNextPage()}
              >
                {isFetching ? m.result_more_loading() : m.result_more()}
              </Button>
            </div>
          )
        }
        {
          !hasNextPage && !isFetching && (
            <div className='w-full px-4 py-8'>
              <p className='text-center italic text-muted-foreground/40 text-sm'>
                {m.result_any_bottom()}
              </p>
            </div>
          )
        }
      </div>
    </div>
  )
}

