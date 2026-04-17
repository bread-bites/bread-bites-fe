import { m } from "@paraglide/messages";

export function NotFoundPage() {
  return (
    <div className='flex flex-col items-center justify-center h-screen gap-4'>
      <h1 className='text-8xl font-bold'>🔎</h1>
      <h1 className='text-4xl font-bold'>{m.not_found_header()}</h1>
      <p className='text-lg text-muted-foreground'>{m.not_found_message()}</p>
    </div>
  )
}