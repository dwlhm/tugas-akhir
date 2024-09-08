import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/__auth')({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.user?.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href
        }
      })
    }
  },
  component: () => <div>Hello /__auth!</div>
})