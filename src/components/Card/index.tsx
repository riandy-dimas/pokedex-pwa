import './styles.css'

import useImageOnLoad from '../../hooks/useImageOnLoad';
import { TPokemonType } from '../../interfaces/pokemon';
import { ReactComponent as PokeBallLogo } from '../../assets/pokeball.svg';
import TypeTag from '../TypeTag'
import { CSSProperties } from 'react';

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
  const { handleImageOnLoad, css } = useImageOnLoad();

  const style: { [key: string]: CSSProperties } = {
    wrap: {
      position: 'relative',
      width: 120,
      height: 120,
      margin: 'auto',
    },
    image: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: `100%`,
      height: `100%`,
    },
  }

  const paddedNumber = `${number}`.padStart(3, '0');
  const type = types[0];
  
  return <figure className={`card card--${type}`}>
    <PokeBallLogo className='card--pokeball' />
    <div style={style.wrap}>
      <img
          style={{ ...style.image, ...css.thumbnail }}
          src="https://via.placeholder.com/150?text=..."
          alt="thumbnail"
        />
        {/* Full size image */}
        <img
          onLoad={handleImageOnLoad}
          style={{ ...style.image, ...css.fullSize }}
          src={src || ''}
          loading='lazy' className='card--image'
          alt={`${number}, ${name}`}
        />      
    </div>
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
