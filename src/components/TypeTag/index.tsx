import { TPokemonType } from '../../interfaces/pokemon';
import './styles.css';

type TTypeTag = {
  type: TPokemonType
}
const TypeTag = ({
  type
}: TTypeTag) => {
  return <li className={`type-tag type-tag--${type}`}>{ type }</li>;
};

export default TypeTag;
