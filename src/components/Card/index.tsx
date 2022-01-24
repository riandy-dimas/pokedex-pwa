import './styles.css'

type TCard = {
  name: string
  number: number
  src: string,
}

const Card = ({
  name,
  number,
  src,
}: TCard) => {
  const paddedNumber = `${number}`.padStart(3, '0');
  return <figure className='card'>
    <img className='card--image' src={src} alt={`${number}, ${name}`} />
    <div className='card--detail'>
      <figcaption className='card--name'>{ name }</figcaption>
      <h5 className='card--number'>{paddedNumber}</h5>
    </div>
  </figure>;
};

export default Card;
