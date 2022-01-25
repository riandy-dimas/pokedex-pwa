import { ReactComponent as PokeBallLogo } from '../../../assets/pokeball.svg';
import './styles.css';

type TPageLoader = {
  active?: boolean
}
const PageLoader = ({
  active = true
}: TPageLoader) => {
  if (!active) return null;

  return <div className='page-loader'>
    <PokeBallLogo />
    Loading..
  </div>;
};

export default PageLoader;
