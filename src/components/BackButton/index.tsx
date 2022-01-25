import React from 'react';
import './styles.css'

type TBackButton = {
  text?: string
  onClick: () => void
}
const BackButton = ({
  text = '⟵',
  onClick,
}: TBackButton) => {
  return <button className='back-button' onClick={() => onClick()}>{text}</button>;
};

export default BackButton;
