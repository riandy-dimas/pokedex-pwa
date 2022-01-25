import React from 'react';
import './styles.css'

type TCardLoader = {
  amount?: number
}
const CardLoader = React.forwardRef<HTMLUListElement, TCardLoader>(({ amount = 1 }, ref) => {
  const generateComponents = () => {
    const result = []
    for(let i = 0; i < amount; i++) {
      result.push(
        <div key={`card-loader-${i}`} className='card-loader shimmer'>
          <div className='card-loader__wrapper'>
            <div className="card-loader__image" />
          </div>
        </div>
        )
      }
    return result;
  }

  return <ul ref={ref} className='card-loaders'>
    { generateComponents() }
  </ul>;
})
export default CardLoader;
  