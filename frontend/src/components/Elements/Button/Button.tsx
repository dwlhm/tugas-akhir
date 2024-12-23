import * as React from "react";

import styles from "./Button.module.css";
import { ArrowLeft } from "react-feather";

const variants = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  danger: "btn-danger",
  overlay: "btn-overlay",
};

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  icon?: React.ReactElement;
  padding?: string
};

export const Button: React.FC<ButtonProps> = ({
  type = "button",
  variant = "primary",
  icon = undefined,
  ...props
}) => {
  return (
    <button
      type={type}
      className={`${styles.btn} ${styles[variants[variant]]} ${props.className}`}
      {...props}
    >
      {variant != "overlay" ? "" : icon}
      <span>{props.children}</span>
      {variant == "overlay" ? "" : icon}
    </button>
  );
};

export const BackButton: React.FC<ButtonProps> = () => (
  <button
    className="flex items-center gap-4 bg-white py-2 px-3 text-xs rounded border border-white hover:text-blue-900 hover:border-blue-900 hover:bg-blue-100"
    onClick={() => history.back()}
  >
    <ArrowLeft className="size-4 stroke-blue-900" />
    Kembali
  </button>
);

export const BasicButton: React.FC<ButtonProps> = ({
  type = "button",
  variant = "primary",
  icon = undefined,
  padding = "py-2 px-3",
  ...props
}) => {
  return (
    <button
      onClick={props.onClick}
      type={type}
      className={`flex items-center gap-4 text-xs rounded border hover:text-blue-900 hover:border-blue-900 hover:bg-blue-100 ${props.className} ${padding}`}
    >
      {icon && <span className="p-2 bg-blue-100 rounded">{icon}</span>}
      {props.children}
    </button>
  );
};
