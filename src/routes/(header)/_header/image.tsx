import { AGE_RATING_ENUM, convertStringIntToAgeRating } from '@/constants/age-rating';
import { useAppForm } from '@/hooks/form-hook';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import { useInfiniteQuery } from '@tanstack/react-query';
import { QUERY_KEY } from '@/constants/query-key';
import { useServerFn } from '@tanstack/react-start';
import { getImage } from '@/api/image';
import Masonry from '@mui/lab/Masonry';
import ImageDownloadButton from '@/components/app/image/ImageDownloadButton';
import { m } from '@paraglide/messages';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import ImageDetailButton from '@/components/app/image/ImageDetailButton';
import { ImageResponse } from '@/model/image';
import { useState } from 'react';
import { clsx } from 'clsx';
import MainMenuSearchFields from '@/components/common/MainMenuSearchFields';
import { getLocalStorage } from '@/utilities/frontend-api';
import { LOCAL_STORAGE_KEY } from '@/constants/local-storage';
import { createHead } from '@/utilities/head';

const searchParamSchema = z.object({
  tag: z.array(z.string()).optional(),
  ageRating: z.enum(AGE_RATING_ENUM).optional(),
  pageSize: z.number().optional()
});
type searchParamSchemaType = z.infer<typeof searchParamSchema>;

export const Route = createFileRoute('/(header)/_header/image')({
  component: RouteComponent,
  head: () => createHead(m.image()),
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
    ageRating: defaultAgeRating ?? convertStringIntToAgeRating(getLocalStorage(LOCAL_STORAGE_KEY.AGE_RATING) ?? '') ?? AGE_RATING_ENUM.GENERAL,
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
        <MainMenuSearchFields form={form} fields={{ ageRating: 'ageRating', tag: 'tag' }}>
          {data && (
            <div className='flex items-center justify-center text-xs text-muted-foreground/60'>
              {m.result_image_total({ totalData: data.pages[0].pagination.totalData })} • {m.result_image_page({
                pageLoaded: (data.pages.length ?? 0).toString(),
                totalPages: Math.ceil(data.pages[0].pagination.totalData / data.pages[0].pagination.pageSize).toString()
              })}
            </div>
          )}
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
                xl: 6,
                lg: 5,
                md: 4,
                sm: 2,
                xs: 2
              }}
                spacing={1}
                defaultHeight={450}
                defaultColumns={4}
                defaultSpacing={2}
              >
                {
                  data.pages.flatMap(x => x.data).map(image => (
                    <ImageCard key={image.id} image={image} />
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

function ImageCard({ image }: { image: ImageResponse }) {
  const [isHidden, setIsHidden] = useState(image.ageRating === AGE_RATING_ENUM.EXPLICIT);

  return (
    <div
      className={clsx(
        'group flex flex-col rounded-sm gap-4 p-3 border-2 bg-card/50 backdrop-blur-sm',
        {
          'border-white/10': image.ageRating === AGE_RATING_ENUM.GENERAL,
          'border-amber-400/50': image.ageRating === AGE_RATING_ENUM.MATURE,
          'border-red-400/50': image.ageRating === AGE_RATING_ENUM.EXPLICIT,
        }
      )}
      key={image.id}
    >
      <div className='overflow-hidden rounded-sm'>
        <img
          src={image.image}
          alt={image.name}
          onClick={() => image.ageRating === AGE_RATING_ENUM.EXPLICIT && setIsHidden(!isHidden)}
          className={clsx('w-full h-auto object-cover', {
            'blur-sm cursor-pointer': isHidden,
          })}
        />
      </div>
      <div className='flex gap-2'>
        <ImageDownloadButton link={image.image} myImage={image.myImage} />
        <ImageDetailButton id={image.id} />
      </div>
    </div>
  )
}