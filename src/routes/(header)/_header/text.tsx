import { getText } from '@/api/text';
import TextCopyButton from '@/components/app/text/TextCopyButton';
import { AGE_RATING_ENUM, convertStringIntToAgeRating } from '@/constants/age-rating';
import { QUERY_KEY } from '@/constants/query-key';
import { useAppForm } from '@/hooks/form-hook';
import Masonry from '@mui/lab/Masonry';
import { useInfiniteQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start';
import clsx from 'clsx';
import { useState } from 'react';
import z from 'zod';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { m } from '@paraglide/messages';
import TextDetailButton from '@/components/app/text/TextDetailButton';
import { TextResponse } from '@/model/text';
import MainMenuSearchFields from '@/components/common/MainMenuSearchFields';
import { LOCAL_STORAGE_KEY } from '@/constants/local-storage';
import { getLocalStorage, setLocalStorage } from '@/utilities/frontend-api';
import { createHead } from '@/utilities/head';

export const Route = createFileRoute('/(header)/_header/text')({
  component: RouteComponent,
  head: () => createHead(m.text()),
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
    ageRating: defaultAgeRating ?? convertStringIntToAgeRating(getLocalStorage(LOCAL_STORAGE_KEY.AGE_RATING) ?? '') ?? AGE_RATING_ENUM.GENERAL,
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

  const handleOnTextSizeChange = (value: 'xs' | 'sm' | 'md') => {
    setSize(value);
    setLocalStorage(LOCAL_STORAGE_KEY.TEXT_SIZE, value);
  }

  return (
    <div className='flex flex-col relative'>
      <form.AppForm>
        <MainMenuSearchFields form={form} fields={{ ageRating: 'ageRating', tag: 'tag' }}>
          <div className='flex items-center justify-between gap-4'>
            {data && (
              <div className='flex items-center text-xs text-muted-foreground/60'>
                {m.result_text_total({ totalData: data.pages[0].pagination.totalData })} • {m.result_text_page({ pageLoaded: data.pages.length, totalPages: Math.ceil(data.pages[0].pagination.totalData / data.pages[0].pagination.pageSize) })}
              </div>
            )}
            <div className='flex items-center gap-2 ml-auto'>
              <span className='text-xs text-muted-foreground/60'>{m.text_size_label()}</span>
              <ToggleGroup
                defaultValue={[getLocalStorage(LOCAL_STORAGE_KEY.TEXT_SIZE) ?? 'xs']}
                className='border border-white/10'
                onValueChange={(value) => value[0] && handleOnTextSizeChange(value[0] as unknown as 'xs' | 'sm' | 'md')}
              >
                <ToggleGroupItem value='xs' className='h-8 px-3 text-xs'>
                  {m.text_size_tiny()}
                </ToggleGroupItem>
                <ToggleGroupItem value='sm' className='h-8 px-3 text-xs'>
                  {m.text_size_small()}
                </ToggleGroupItem>
                <ToggleGroupItem value='md' className='h-8 px-3 text-xs'>
                  {m.text_size_medium()}
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        </MainMenuSearchFields>
      </form.AppForm>

      {/* Result area (infinite query) with enhanced styling */}
      <div className='px-6 pt-2 pb-8 flex flex-col gap-6 justify-center items-center'>
        {
          !data ? (
            <div className='w-full flex flex-col gap-4 flex-wrap'>
              {[...Array(4)].map((_, index) => (
                <Skeleton key={index} className='h-48 rounded-md' />
              ))}
            </div>
          ) : (
            <div className='w-full flex justify-center'>
              <Masonry columns={{
                xl: 3,
                md: 2,
                sm: 1
              }}
                spacing={1}
                defaultColumns={4}
                defaultSpacing={2}
              >
                {
                  data.pages.flatMap(x => x.data).map(text => (
                    <TextCard key={text.id} text={text} size={size} />
                  ))
                }
              </Masonry>
            </div>
          )
        }
        {
          hasNextPage && (
            <div className='w-full flex'>
              <Button
                className='grow bg-linear-to-r from-muted/50 to-muted/30 hover:from-primary/20 hover:to-primary/10 border border-white/10 hover:border-primary/50 transition-all duration-300'
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

function TextCard({ text, size }: { text: TextResponse, size: 'xs' | 'sm' | 'md' }) {
  const [isRevealed, setIsRevealed] = useState(text.ageRating !== AGE_RATING_ENUM.EXPLICIT);

  return (
    <div
      className={clsx(
        'group flex flex-col rounded-sm gap-4 p-3 border-2 bg-card/50 backdrop-blur-sm',
        {
          'border-white/10': text.ageRating === AGE_RATING_ENUM.GENERAL,
          'border-amber-400/50': text.ageRating === AGE_RATING_ENUM.MATURE,
          'border-red-400/50': text.ageRating === AGE_RATING_ENUM.EXPLICIT,
        }
      )}
      key={text.id}
    >
      {!isRevealed ? (
        <div className='flex flex-col items-center justify-center py-12 gap-4'>
          <p className='text-sm text-muted-foreground'>{m.text_explicit_warning()}</p>
          <Button
            variant='destructive'
            size='sm'
            onClick={() => setIsRevealed(true)}
          >
            {m.text_explicit_reveal()}
          </Button>
        </div>
      ) : (
        <>
          <div className={clsx('border-2 border-gray-400/30 rounded-sm text-justify p-2 whitespace-pre-line', {
            'text-xs': size === 'xs',
            'text-sm': size === 'sm',
            'text-md': size === 'md',
          })}>
            {text.content}
          </div>
          <div className='flex gap-2'>
            <TextCopyButton content={text.content} myText={text.myText} />
            <TextDetailButton id={text.id} />
          </div>
        </>
      )}
    </div>
  )
}
