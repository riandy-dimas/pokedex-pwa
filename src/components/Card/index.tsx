import './styles.css'

import { TPokemonType } from '../../interfaces/pokemon';

type TCard = {
  name: string
  number: number
  src: string,
  type: TPokemonType
}

const Card = ({
  name,
  number,
  src,
  type
}: TCard) => {
  const paddedNumber = `${number}`.padStart(3, '0');
  return <figure className={`card card--${type}`}>
    <img className='card--image' src={src} alt={`${number}, ${name}`} />
    <div className='card--detail'>
      <figcaption className='card--name'>{ name }</figcaption>
      <h5 className='card--number'>#{paddedNumber}</h5>
    </div>
  </figure>;
};

export default Card;
