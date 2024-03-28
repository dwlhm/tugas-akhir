import * as React from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Plus } from "react-feather"
import { Button, Card } from "@/components/Elements"
import { AppProvider } from '@/providers/app'
import { AppRouter } from './routes'

function App() {

  return (
    <AppProvider>
		<AppRouter />
	</AppProvider>
  )
}

export default App
