import { useCallback, useState, useRef, useEffect } from 'react';
import useQuery from '../../hooks/useQueryParams';
import useIntersectionObs from '../../hooks/useIntersectionObs';
import { TGetPokemonDataResponse, TGetPokemonListResponse } from '../../interfaces/api';
import { AxiosPromise } from 'axios';
import './styles.css';

import PokemonCard from '../../components/Card'
import CardLoader from '../../components/utility/CardLoader'
import Clickable from '../../components/utility/Clickable'
import SearchBox from '../../components/SearchBox'
import PageLoader from '../../components/utility/PageLoader'
import { getPokemonList, getPokemonData } from '../../services/baseApi';
import { GET_POKEMON_LIST_LIMIT } from '../../enum/api';
import { useNavigate } from 'react-router-dom';
import { VALID_POKEMON_COUNT } from '../../enum/pokemon';
import { getPokemonIdByUrl } from '../../utils/helper';

type TPokemonList = {
  id: number
  name: string
  types: TGetPokemonDataResponse['types']
  sprites: TGetPokemonDataResponse['sprites']
}[]
const Home = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const currentOffset = useRef<number>(0);
  const scrollerRef = useRef<HTMLUListElement | null>(null);
  const pokeList = useRef<TGetPokemonListResponse['results']>([]);
  const query = useQuery();
  const navigate = useNavigate();

  useEffect(() => {
    getPokemonList({ limit: VALID_POKEMON_COUNT, offset: 0}, (response: TGetPokemonListResponse) => {
      pokeList.current = response.results;
      setIsLoading(false);
    })
  }, [])

  const filterPokemonByQuery = useCallback((query: string | number) => {
    /** If query is pokemon number */
    if (!isNaN(+query)) {
      const result = pokeList.current.filter(({ url }) => {
        const pokeId = getPokemonIdByUrl(url)
        return pokeId === query;
      })
      return result
    }

    /** If query is pokemon name */
    const result = pokeList.current.filter(({ name }) => {
      return name.toLowerCase()
        .indexOf(
          (query as string).toLowerCase()
        ) > -1;
    })
    return result
  }, [])

  const [pokemonList, setPokemonList] = useState<TPokemonList>([]);
  const [hasNext, setHasNext] = useState<boolean>(true);
  
  useEffect(() => {
    if (isLoading) return;
    
    const searchedPokemon = query.get('pokemon');
    if (!searchedPokemon) return;

    if (isNaN(+searchedPokemon) && searchedPokemon.length < 3) {
      alert('Must consists more than 3 characters!');
      return;
    }

    const filteredPokemon = filterPokemonByQuery(searchedPokemon);

    const filteredPokemonPromises: AxiosPromise<TGetPokemonDataResponse>[] = [];
    filteredPokemon.forEach(({ url }) => {
      filteredPokemonPromises.push(getPokemonData(url))
    })

    setHasNext(true);
    Promise.all(filteredPokemonPromises)
    .then((response) => {      
      const mappedResponse:TPokemonList = response.map(({ data }) => ({
        id: data.id,
        name: data.name,
        sprites: data.sprites,
        types: data.types,
      }))

      setHasNext(false);
      setPokemonList(mappedResponse);
    })
  }, [isLoading, query, filterPokemonByQuery])

  const fetchPokemonData = useCallback((response: TGetPokemonListResponse) => {
    const { results, next } = response;
    const promises: AxiosPromise<TGetPokemonDataResponse>[] = [];

    results.forEach(({ url }) => {
      promises.push(getPokemonData(url));
    })

    Promise
      .all(promises)
      .then((result) => {
        const pokemons: TPokemonList = result.map(({ data }) => data);
        pokemons.sort((a, b) => a.id - b.id);
        
        setPokemonList((p) => {
          const mergedList = [...p, ...pokemons];
          if (mergedList.length >= VALID_POKEMON_COUNT) {
            return mergedList.slice(0, VALID_POKEMON_COUNT)
          }
          return mergedList;
        });

        currentOffset.current += result.length;
        if (!next || currentOffset.current >= VALID_POKEMON_COUNT) {
          setHasNext(false);
        }
      })    
  }, []);

  const pokeQuery = query.get('pokemon') || '-';
  const isQueryValid = (isNaN(+pokeQuery) && pokeQuery.length > 2) || !isNaN(+pokeQuery);
  const handleIntersecting = useCallback(() => {
    if (!hasNext) {
      return;
    };
    if (isQueryValid) return;

    getPokemonList({ limit: GET_POKEMON_LIST_LIMIT, offset: currentOffset.current }, fetchPokemonData)
  }, [currentOffset, fetchPokemonData, hasNext, isQueryValid])

  useIntersectionObs({
    target: scrollerRef,
    onIntersecting: handleIntersecting,
    isLoading,
  })

  const handleResetQuery = useCallback(() => {
    setPokemonList([]);
    currentOffset.current = 0;
    navigate('/', { replace: true });
    setHasNext(true);
  }, [navigate])

  if (isLoading) {
    return <PageLoader />
  }
  
  return <div className='home page'>
    <header className='home__header'>
      <h1 className='home__title'>Pokédex</h1>
      <p className='home__subtitle'>Search for a Pokémon by name or using its National Pokédex number.</p>
    </header>
    <main className='home__content'>
      <SearchBox
        value={query.get('pokemon') || ''}
        onReset={handleResetQuery}
        placeholder='Type Pokémon name or number'
      />
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
      {
        pokemonList.length === 0 && !hasNext &&
        <h3 className='home__not-found'>Pokemon not found!</h3>
      }
    </main>
  </div>;
};

export default Home;
