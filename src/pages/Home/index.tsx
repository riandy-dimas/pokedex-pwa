import './styles.css';

import PokemonCard from '../../components/Card'
import Clickable from '../../components/utility/Clickable'

const DUMMY_LIST: {
  name: string
  number: number
}[] = [
  {
    name: 'bulbasaur',
    number: 1,
  },
  {
    name: 'ivysaur',
    number: 2,
  },
  {
    name: 'venusaur',
    number: 3,
  },
  {
    name: 'charmander',
    number: 4,
  },
  {
    name: 'charmeleon',
    number: 5,
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
        DUMMY_LIST.map(({ name, number }) => (
          <Clickable key={number} url={`${name}`}>
            <PokemonCard
              name={name}
              number={number}
              src='https://via.placeholder.com/475'
            />
          </Clickable>
        ))
      }
    </main>
  </div>;
};

export default Home;
