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
import { getPokemonList, getPokemonDataByUrl } from '../../services/baseApi';
import { GET_POKEMON_LIST_LIMIT } from '../../enum/api';
import { useNavigate } from 'react-router-dom';

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
    getPokemonList({ limit: 1, offset: 0}, (response: TGetPokemonListResponse) => {
      getPokemonList({ limit: response.count, offset: 0 }, ({ results }) => {
        pokeList.current = results;
        setIsLoading(false);
      })
    })
  }, [])

  const filterPokemonByQuery = useCallback((query: string | number) => {
    /** If query is pokemon number */
    if (!isNaN(+query)) {
      const result = pokeList.current.filter(({ url }) => {
        const pokeId = url.split('/').slice(-2)[0];        
        return pokeId === query;
      })
      return result
    }

    /** If query is pokemon name */
    const result = pokeList.current.filter(({ name }) => {
      return name.indexOf(query as string) > -1;
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
      filteredPokemonPromises.push(getPokemonDataByUrl(url))
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

    const pokeQuery = query.get('pokemon') || '-';
    const isQueryValid = (isNaN(+pokeQuery) && pokeQuery.length > 2) || !isNaN(+pokeQuery);

    if (isQueryValid) return;

    getPokemonList({ limit: GET_POKEMON_LIST_LIMIT, offset: currentOffset.current }, fetchPokemonData)
  }, [currentOffset, fetchPokemonData, hasNext, query])

  useIntersectionObs({
    target: scrollerRef,
    onIntersecting: handleIntersecting,
    isLoading
  })

  const handleResetQuery = useCallback(() => {
    navigate('/', { replace: true });
    setPokemonList([]);
    setHasNext(true);
  }, [navigate])

  if (isLoading) {
    return <PageLoader />
  }
  
  return <div className='home page'>
    <header className='home__header'>
      <h1>Pokédex</h1>
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
