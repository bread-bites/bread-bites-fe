import { getText } from '@/api/text';
import TextCopyButton from '@/components/app/text/TextCopyButton';
import TextDeleteButton from '@/components/app/text/TextDeleteButton';
import TextUpdateButton from '@/components/app/text/TextUpdateButton';
import { AGE_RATING_ENUM, AGE_RATING_SELECT } from '@/constants/age-rating';
import { QUERY_KEY } from '@/constants/query-key';
import { useAppForm } from '@/hooks/form-hook';
import Masonry from '@mui/lab/Masonry';
import { Box, Button, Chip, Skeleton, ToggleButton, ToggleButtonGroup, Tooltip, Typography } from '@mui/material';
import { useInfiniteQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start';
import clsx from 'clsx';
import { useState } from 'react';
import z from 'zod';

export const Route = createFileRoute('/(header)/_header/text')({
  component: RouteComponent,
});

const searchParamSchema = z.object({
  tag: z.array(z.string()).optional(),
  ageRating: z.enum(AGE_RATING_ENUM).optional(),
  pageSize: z.number().optional()
});
type searchParamSchemaType = z.infer<typeof searchParamSchema>;

function RouteComponent() {
  const [size, setSize] = useState<'xs' | 'sm' | 'md'>('xs')
  const { tag: defaultTag, ageRating: defaultAgeRating } = Route.useSearch() as z.infer<typeof searchParamSchema>;
  const defaultValue: searchParamSchemaType = {
    pageSize: 20,
    ageRating: defaultAgeRating ?? AGE_RATING_ENUM.GENERAL,
    tag: defaultTag ?? [],
  }

  const getTextEndpoint = useServerFn(getText);
  const navigate = useNavigate();

  const form = useAppForm({
    defaultValues: defaultValue,
    validators: {
      onChange: searchParamSchema
    },
    onSubmit: ({ value }) => {
      navigate({
        to: '/text',
        search: value
      });
    }
  });

  const { data, hasNextPage, fetchNextPage, isFetching } = useInfiniteQuery({
    queryKey: [QUERY_KEY.TEXT, defaultValue],
    queryFn: async ({ pageParam }) => await getTextEndpoint({
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
          <Box className='flex justify-between items-center'>
            {
              data ? (
                <Box className='flex gap-2 flex-row'>
                  <Typography>{data.pages[0].pagination.totalData} copypastas</Typography>
                  <Typography>|</Typography>
                  <Typography>Loaded {data.pages.length ?? 0} / {Math.ceil(data.pages[0].pagination.totalData / data.pages[0].pagination.pageSize)} pages</Typography>
                </Box>
              ) : <Box>Loading...</Box>
            }
            <Box className='flex gap-4 items-center'>
              <Typography>Font Size</Typography>
              <ToggleButtonGroup value={size} size='small' exclusive onChange={(_, value) => setSize(value)}>
                <ToggleButton value='xs'>
                  Tiny
                </ToggleButton>
                <ToggleButton value='sm'>
                  Small
                </ToggleButton>
                <ToggleButton value='md'>
                  Medium
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
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
                xl: Math.min(3, data.pages[0].pagination.totalData),
                md: Math.min(2, data.pages[0].pagination.totalData),
                sm: Math.min(1, data.pages[0].pagination.totalData)
              }}
                spacing={2}
                defaultHeight={450}
                defaultColumns={4}
                defaultSpacing={2}
              >
                {
                  data.pages.flatMap(x => x.data).map(text => (
                    <Box className='flex flex-col bg-white/10 rounded gap-4 p-4' key={text.id}>
                      <Box className={clsx('border-2 border-gray-400/30 rounded-sm text-justify p-2 whitespace-pre-line', {
                        'text-xs' : size === 'xs',
                        'text-sm' : size === 'sm',
                        'text-md' : size === 'md',
                      })}>
                        {text.content}
                      </Box>
                      <Box>
                        <Tooltip title='Sauce'>
                          <Typography className='text-xs! wrap-break-word'>🍅: {text.source ?? '-'}</Typography>
                        </Tooltip>
                        <Tooltip title='Description'>
                          <Typography className='text-xs! wrap-break-word'>📃: {text.description ?? '-'}</Typography>
                        </Tooltip>
                      </Box>
                      <Box className='flex flex-wrap gap-2'>
                        {
                          text.tags.map(tag => (
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
                        <TextCopyButton content={text.content} myText={text.myText} />
                        {
                          text.myText && <TextDeleteButton content={text.content} id={text.id} />
                        }
                        {
                          text.myText && <TextUpdateButton id={text.id} />
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
