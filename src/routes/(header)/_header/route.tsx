import Header from '@/components/Header'
import { Box } from '@mui/material'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(header)/_header')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Header />
      <Box className='min-h-full'>
        <Outlet/>
      </Box>
    </>
  )
}
