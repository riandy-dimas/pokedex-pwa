import React from 'react';
import './styles.css';

type TClickable = {
  children: React.ReactNode
  url: string
}

const Clickable = ({
  children,
  url
}: TClickable) => {
  return <a className='clickable' href={url}>
    { children }
  </a>;
};

export default Clickable;
