import './styles.css'
import { ReactComponent as BackIcon } from '../../assets/back_icon.svg';

type TBackButton = {
  text?: string
  onClick: () => void
}
const BackButton = ({
  text = '⟵',
  onClick,
}: TBackButton) => {
  return <button className='back-button' onClick={() => onClick()}>
    <BackIcon />  
  </button>;
};

export default BackButton;
