import './styles.css';

import PokemonCard from '../../components/Card'
import Clickable from '../../components/utility/Clickable'
import { TPokemonType } from '../../interfaces/pokemon';

const DUMMY_LIST: {
  name: string
  number: number
  type: TPokemonType
}[] = [
  {
    name: 'bulbasaur',
    number: 1,
    type: 'grass',
  },
  {
    name: 'ivysaur',
    number: 2,
    type: 'grass',
  },
  {
    name: 'venusaur',
    number: 3,
    type: 'grass',
  },
  {
    name: 'charmander',
    number: 4,
    type: 'fire',
  },
  {
    name: 'charmeleon',
    number: 5,
    type: 'fire',
  },
]

const Home = () => {
  return <div className='home page'>
    <header className='home__header'>
      <h1>Pokédex</h1>
      <p className='home__subtitle'>Search for a Pokémon by name or using its National Pokédex number.</p>
    </header>
    <main className='home__content'>
      {
        DUMMY_LIST.map(({ name, number, type }) => (
          <Clickable key={number} url={`${name}`}>
            <PokemonCard
              name={name}
              number={number}
              type={type}
              src='https://via.placeholder.com/475'
            />
          </Clickable>
        ))
      }
    </main>
  </div>;
};

export default Home;
