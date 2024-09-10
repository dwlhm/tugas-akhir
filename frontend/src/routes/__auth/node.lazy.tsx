import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/__auth/node')({
  component: () => <div>Hello /__auth/node!</div>
})