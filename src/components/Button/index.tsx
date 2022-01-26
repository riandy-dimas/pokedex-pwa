import React from 'react';
import './styles.css';

type TButton = {
  className?: string
  children: React.ReactNode
  onClick?: () => void
  type?: 'submit' | 'reset'
}
const Button = ({
  className,
  onClick = () => {},
  children,
  type
}: TButton) => {
  return <button className={`button ${className}`} type={type} onClick={() => onClick()}>{ children }</button>;
};

export default Button;
