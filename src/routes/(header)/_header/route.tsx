import Header from '@/components/Header'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(header)/_header')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Header />
      <div className='min-h-full'>
        <Outlet/>
      </div>
    </>
  )
}
