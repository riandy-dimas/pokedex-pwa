import { TPokemonType } from '../../interfaces/pokemon';
import { MAX_STAT } from '../../enum/pokemon';
import './styles.css';

type TProgressBar = {
  accent: TPokemonType
  label: string
  value: number
}
const ProgressBar = ({
  accent,
  label,
  value,
}: TProgressBar) => {
  return <figure className='progress-bar'>
    <figcaption className='progress-bar__info'>
      <span className='progress-bar__label'>{ label }</span>
      <span className={`progress-bar__value color color--${accent}`}>{ value }</span>
    </figcaption>
    <span className='progress-bar__bar-wrapper'>
      <span className={`progress-bar__bar-value color color--${accent}`} style={{ width: `${(value / MAX_STAT) * 100}%` }} />
    </span>
  </figure>;
};

export default ProgressBar;
