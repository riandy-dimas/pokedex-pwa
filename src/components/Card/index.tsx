import './styles.css'

import { TPokemonType } from '../../interfaces/pokemon';
import { ReactComponent as PokeBallLogo } from '../../assets/pokeball.svg';
import TypeTag from '../TypeTag'

type TCard = {
  name: string
  number: number
  src: string | null,
  types: TPokemonType[]
}

const Card = ({
  name,
  number,
  src,
  types,
}: TCard) => {
  const paddedNumber = `${number}`.padStart(3, '0');
  const type = types[0];
  
  return <figure className={`card card--${type}`}>
    <PokeBallLogo className='card--pokeball' />
    <img loading='lazy' className='card--image' src={src || ''} alt={`${number}, ${name}`} />
    <div className='card--detail'>
      <figcaption className='card--name'>{ name }</figcaption>
      <ul className='card--types'>
        {
          types.map((type) => <TypeTag key={type} type={type} />)
        }
      </ul>
      <h5 className='card--number'>#{paddedNumber}</h5>
    </div>
  </figure>;
};

export default Card;
