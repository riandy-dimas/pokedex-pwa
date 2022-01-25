import { Fragment } from 'react';
import { TPokemonType } from '../../interfaces/pokemon';
import './styles.css';

type TDescriptionList = {
  accent: TPokemonType,
  descriptions: {
    term: string
    define: string
  }[]
}
const DescriptionList = ({
  accent,
  descriptions,
}: TDescriptionList) => {
  return <dl className='description-list'>
    {
      descriptions.map(({ term, define }) => <Fragment key={define}>
        <dt className='description-list__term'>{ term }</dt>
        <dd className={`description-list__define color color--${accent}`}>{ define }</dd>
      </Fragment>)
    }
  </dl>
  ;
};

export default DescriptionList;
