import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(header)/_header/docs')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(header)/_header/docs"!</div>
}
