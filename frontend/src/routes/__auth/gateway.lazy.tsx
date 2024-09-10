import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/__auth/gateway')({
  component: () => <div>Hello /__auth/gateway!</div>
})