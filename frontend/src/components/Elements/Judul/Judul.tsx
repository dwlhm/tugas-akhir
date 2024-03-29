import styles from "./Judul.module.css"

export type JudulProps = {
    children: string,
    className?: string 
}

export const Judul = ({
    children,
    className = ""
}: JudulProps ) => {
    return(
        <h1
            className={`${styles.judul} ${className}`}
        >
            {children}
        </h1>
    )
}