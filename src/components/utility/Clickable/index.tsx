import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

type TClickable = {
  children: React.ReactNode
  url: string
}

const Clickable = ({
  children,
  url
}: TClickable) => {
  return <Link className='clickable' to={url}>
    { children }
  </Link>;
};

export default Clickable;
