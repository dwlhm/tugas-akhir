import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/__auth/dashboard')({
  component: () => <div>Hello /__auth/dashboard!</div>
})