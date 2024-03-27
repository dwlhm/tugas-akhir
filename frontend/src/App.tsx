import * as React from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Plus } from "react-feather"
import { Button, Card } from "./components/Elements"

export type ButtonProps = React

function App() {

  return (
    <>
			<Button onClick={() => console.log("Clicked")}>Ini Button</Button>
			<Button variant="secondary" onClick={() => console.log("Clicked")}>Ini Button Secondary</Button>
			<Button icon={<Plus />} onClick={() => console.log("Clicked")}>Ini Button w/ Icon</Button>
			<Button variant="danger" icon={<Plus />} onClick={() => console.log("Clicked")}>Ini Button danger</Button>
			<Button variant="overlay" icon={<Plus />} onClick={() => console.log("Clicked")}>Tambah</Button>
			<Card>Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.</Card>
		</>
  )
}

export default App
