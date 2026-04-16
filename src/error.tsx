import { m } from "@paraglide/messages";

export function ErrorPage() {
  return (
    <div className='flex flex-col items-center justify-center h-screen gap-4'>
      <h1 className='text-8xl font-bold'>😭</h1>
      <h1 className='text-4xl font-bold'>{m.error_header()}</h1>
      <p className='text-lg text-muted-foreground'>{m.error_message()}</p>
    </div>
  )
}