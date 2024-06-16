import { PropsWithChildren } from 'react';
import styles from './styles.module.css'

type Props = PropsWithChildren & React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>>;

export const Button: Props = ({ children, className, ...props}) => <button className={`${styles.button} ${className}`} {...props}>{children}</button>;
