import { m } from '@paraglide/messages';
import { Spinner } from '../ui/spinner';

export default function LoadingPage() {
  return (
    <div className='w-screen h-screen flex flex-col items-center justify-center gap-4'>
      <Spinner className='size-32' />
      <p>{m.loading()}</p>
    </div>
  )
}
