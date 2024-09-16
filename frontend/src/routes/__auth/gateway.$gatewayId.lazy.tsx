import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/__auth/gateway/$gatewayId')({
  component: () => <div>Hello /__auth/gateway/$gatewayId!</div>
})