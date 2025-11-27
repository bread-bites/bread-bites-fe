import { AGE_RATING_ENUM, AGE_RATING_SELECT } from '@/constants/age-rating';
import { useAppForm } from '@/hooks/form-hook';
import { Box, Button, Chip, Skeleton, Tooltip, Typography } from '@mui/material';
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

const searchParamSchema = z.object({
  tag: z.array(z.string()).optional(),
  ageRating: z.enum(AGE_RATING_ENUM).optional(),
  pageSize: z.number().optional()
});
type searchParamSchemaType = z.infer<typeof searchParamSchema>;

export const Route = createFileRoute('/(header)/_header/image/')({
  component: RouteComponent,
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
    <Box className='flex flex-col relative'>
      {/* Search area */}
      <form.AppForm>
        <form.FormContainer className='flex w-full flex-col gap-4 sticky top-0 pt-5 z-50 bg-background-default p-4'>
          <Box className='flex w-full gap-4'>
            <form.AppField name='ageRating'>
              {
                (field) => <field.FormSelect<number> label='Age Rating' className='min-w-36!' options={AGE_RATING_SELECT} />
              }
            </form.AppField>
            <form.AppField name='tag'>
              {
                (field) => <field.FormTagInput className='grow' />
              }
            </form.AppField>
            <form.FormSubmitButton className=''>Search</form.FormSubmitButton>
          </Box>
          <Box className='flex gap-2'>
            {
              data && (
                <>
                  <Typography>{data.pages[0].pagination.totalData} images</Typography>
                  <Typography>|</Typography>
                  <Typography>Loaded {data.pages.length ?? 0} / {Math.ceil(data.pages[0].pagination.totalData / data.pages[0].pagination.pageSize)} pages</Typography>
                </>
              )
            }
          </Box>
        </form.FormContainer>
      </form.AppForm>

      {/* Result area (infinite query) */}
      <Box className='p-2 pt-0 flex flex-col gap-4 justify-center items-center'>
        {
          !data ? (
            <Box className='w-full flex flex-col gap-4'>
              <Skeleton variant='rounded' className='w-full h-64!' />
            </Box>
          ) : (
            <Box className='w-full flex justify-center'>
              <Masonry columns={{
                xl: Math.min(6, data.pages[0].pagination.totalData),
                lg: Math.min(5, data.pages[0].pagination.totalData),
                md: Math.min(4, data.pages[0].pagination.totalData),
                sm: Math.min(2, data.pages[0].pagination.totalData)
              }}
                spacing={2}
                defaultHeight={450}
                defaultColumns={4}
                defaultSpacing={2}
              >
                {
                  data.pages.flatMap(x => x.data).map(image => (
                    <Box className='flex flex-col bg-white/10 rounded gap-4 p-4' key={image.id}>
                      <img src={image.image} alt={image.name} />
                      <Box>
                        <Tooltip title='Sauce'>
                          <Typography className='text-xs! wrap-break-word'>🍅: {image.source ?? '-'}</Typography>
                        </Tooltip>
                        <Tooltip title='Description'>
                          <Typography className='text-xs! wrap-break-word'>📃: {image.description ?? '-'}</Typography>
                        </Tooltip>
                      </Box>
                      <Box className='flex flex-wrap gap-2'>
                        {
                          image.tags.map(tag => (
                            <form.Subscribe key={tag} selector={x => x.values.tag}>
                              {
                                (tagValue) => (
                                  <Chip
                                    label={tag}
                                    size='small'
                                    onClick={() => {
                                      if (!(tagValue ?? []).includes(tag)) form.setFieldValue('tag', [...(tagValue ?? []), tag])
                                    }}
                                    sx={{ borderRadius: '6px' }}
                                  />
                                )
                              }
                            </form.Subscribe>
                          ))
                        }
                      </Box>
                      <Box className='flex gap-2'>
                        <ImageDownloadButton link={image.image} myImage={image.myImage} />
                        {
                          image.myImage && <ImageDeleteButton image={image.image} id={image.id} />
                        }
                        {
                          image.myImage && <ImageUpdateButton id={image.id} />
                        }
                      </Box>
                    </Box>
                  ))
                }
              </Masonry>
            </Box>
          )
        }
        {
          hasNextPage && (
            <Box className='w-full flex p-2'>
              <Button
                className='grow'
                fullWidth
                color='primary'
                variant='contained'
                loading={isFetching}
                onClick={() => fetchNextPage()}
              >Gimme more</Button>
            </Box>
          )
        }
        {
          !hasNextPage && !isFetching && (
            <Box className='w-full p-2'>
              <Typography className=' text-center italic text-white/20'>You've reached the bottom</Typography>
            </Box>
          )
        }
      </Box>
    </Box>
  )
}

