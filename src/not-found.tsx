import { m } from "@paraglide/messages";
import { Link } from "@tanstack/react-router";
import { Button } from "./components/ui/button";

export function NotFoundPage() {
  return (
    <div className='flex flex-col items-center justify-center h-screen gap-4'>
      <h1 className='text-8xl font-bold'>🔎</h1>
      <h1 className='text-4xl font-bold'>{m.not_found_header()}</h1>
      <p className='text-lg text-muted-foreground'>{m.not_found_message()}</p>

      <Link to='/' className='text-blue-500 underline'>
        <Button variant='default'>{ m.back()}</Button>
      </Link>
    </div>
  )
}