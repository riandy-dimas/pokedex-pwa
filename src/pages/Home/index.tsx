import { useCallback, useState, useRef } from 'react';
import useIntersectionObs from '../../hooks/useIntersectionObs';
import { TGetPokemonDataResponse, TGetPokemonListResponse } from '../../interfaces/api';
import { AxiosPromise } from 'axios';
import './styles.css';

import PokemonCard from '../../components/Card'
import CardLoader from '../../components/utility/CardLoader'
import Clickable from '../../components/utility/Clickable'
import { getPokemonList, getPokemonDataByUrl } from '../../services/baseApi';
import { GET_POKEMON_LIST_LIMIT } from '../../enum/api';

type TPokemonList = {
  id: number
  name: string
  types: TGetPokemonDataResponse['types']
  sprites: TGetPokemonDataResponse['sprites']
}[]
const Home = () => {
  const currentOffset = useRef<number>(0);
  const scrollerRef = useRef<HTMLUListElement | null>(null);

  const [pokemonList, setPokemonList] = useState<TPokemonList>([]);
  const [hasNext, setHasNext] = useState<boolean>(true);

  const fetchPokemonData = useCallback((response: TGetPokemonListResponse) => {
    const { results, next } = response;
    const promises: AxiosPromise<TGetPokemonDataResponse>[] = [];

    results.forEach(({ url }) => {
      promises.push(getPokemonDataByUrl(url));
    })

    Promise
      .all(promises)
      .then((result) => {
        const pokemons: TPokemonList = result.map(({ data }) => data);
        pokemons.sort((a, b) => a.id - b.id);
        
        setPokemonList((p) => [...p, ...pokemons]);
        currentOffset.current += results.length;

        if (!next) {
          setHasNext(false);
        }
      })    
  }, []);

  const handleIntersecting = useCallback(() => {
    if (!hasNext) {
      return;
    };

    getPokemonList({ limit: GET_POKEMON_LIST_LIMIT, offset: currentOffset.current }, fetchPokemonData)
  }, [currentOffset, fetchPokemonData, hasNext])

  useIntersectionObs({
    target: scrollerRef,
    onIntersecting: handleIntersecting,
  })

  return <div className='home page'>
    <header className='home__header'>
      <h1>Pokédex</h1>
      <p className='home__subtitle'>Search for a Pokémon by name or using its National Pokédex number.</p>
    </header>
    <main className='home__content'>
      <ul className='home__list'>
      {
        pokemonList.map(({ name, id, types, sprites }) => (
          <li className='home__list-item' key={id} >
            <Clickable url={`${name}`}>
              <PokemonCard
                name={name}
                number={id}
                types={types.map(({ type: { name } }) => name)}
                src={sprites.other['official-artwork'].front_default}
              />
            </Clickable>
          </li>
        ))
      }
      </ul>
      {
        hasNext &&
        <CardLoader ref={scrollerRef} amount={3} />
      }
    </main>
  </div>;
};

export default Home;
