import * as React from "react"

import styles from "./Button.module.css"

const variants = {
 primary: "btn-primary",
 secondary: "btn-secondary",
 danger: "btn-danger",
}

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: keyof typeof variants,
	icon?: React.ReactElement,
} 

export const Button: React.FC<ButtonProps> = ({
	type = "button",
	variant = "primary",
	icon = undefined,
	...props
}) => {
	return(<button
		type={type}
		className={`${styles.btn} ${styles[variants[variant]]}`}
		{...props}
		><span>{props.children}</span>{icon}</button>)
}
