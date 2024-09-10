import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/__auth/user')({
  component: () => <div>Hello /__auth/user!</div>
})