import { PropsWithChildren } from 'react';
import { button } from './styles.css';

type Props = PropsWithChildren & React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>>;

export const Button: Props = ({ children, className, ...props}) => <button className={`${button} ${className}`} {...props}>{children}</button>;
