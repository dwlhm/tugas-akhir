import * as React from "react"

import styles from "./Card.module.css"

export type CardProps = {
	size?: "full" | "square",
	className?: String
}

export const Card: React.FC<CardProps> = ({
 size = "full",
 className = "",
 ...props
}) => {
	return(<div className={`${styles.card} ${size} ${className}`} {...props}>
		{props.children}
	</div>)
}
