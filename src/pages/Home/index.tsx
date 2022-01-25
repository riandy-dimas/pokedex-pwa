import './styles.css';

import PokemonCard from '../../components/Card'
import Clickable from '../../components/utility/Clickable'
import { getPokemonList, getPokemonDataByUrl } from '../../services/baseApi';

import { useCallback, useEffect, useState } from 'react';
import { TGetPokemonDataResponse, TGetPokemonListResponse } from '../../interfaces/api';
import { AxiosPromise } from 'axios';

type TPokemonList = {
  id: number
  name: string
  types: TGetPokemonDataResponse['types']
  sprites: TGetPokemonDataResponse['sprites']
}[]
const Home = () => {
  const [pokemonList, setPokemonList] = useState<TPokemonList>([]);

  const fetchPokemonData = useCallback((response: TGetPokemonListResponse) => {
    const { results } = response;
    const promises: AxiosPromise<TGetPokemonDataResponse>[] = [];

    results.forEach(({ url }) => {
      promises.push(getPokemonDataByUrl(url));
    })

    Promise
      .all(promises)
      .then((result) => {
        const pokemons: TPokemonList = result.map(({ data }) => data);
        pokemons.sort((a, b) => a.id - b.id);
        setPokemonList(pokemons);
      })    
  }, []);

  useEffect(() => {
    getPokemonList({ limit: 20, offset: 0 }, fetchPokemonData)
  }, [fetchPokemonData]);

  console.log(pokemonList);

  return <div className='home page'>
    <header className='home__header'>
      <h1>Pokédex</h1>
      <p className='home__subtitle'>Search for a Pokémon by name or using its National Pokédex number.</p>
    </header>
    <main className='home__content'>
      {
        pokemonList.map(({ name, id, types, sprites }) => (
          <Clickable key={id} url={`${name}`}>
            <PokemonCard
              name={name}
              number={id}
              types={types.map(({ type: { name } }) => name)}
              src={sprites.other['official-artwork'].front_default}
            />
          </Clickable>
        ))
      }
    </main>
  </div>;
};

export default Home;
