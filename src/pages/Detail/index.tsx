import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import './styles.css';

import { BASE_URL, E_API_PATH } from '../../enum/api';
import { TGetPokemonDataResponse, TGetPokemonSpeciesResponse } from '../../interfaces/api';
import { getPokemonData, getPokemonDataById, getPokemonEvolutionChain, getPokemonSpecies } from '../../services/baseApi';
import { ReactComponent as PokeBallLogo } from '../../assets/pokeball.svg';
import Tabs from '../../components/Tabs';
import TypeTag from '../../components/TypeTag';
import BackButton from '../../components/BackButton';
import DescriptionList from '../../components/DescriptionList';
import ProgressBar from '../../components/ProgressBar';
import PageLoader from '../../components/utility/PageLoader';
import { TPokemonType } from '../../interfaces/pokemon';
import { getFlatEvolutionChain, getPokemonAbility, getPokemonWeight, getProperStatName } from '../../utils/converter';
import { getFlavorTextByLanguage, getPokemonIdByUrl } from '../../utils/helper';
import { AxiosPromise } from 'axios';

type TEvolutionData = {
  from: { name: string, url: string, src: string, id: number },
  to: { name: string, url: string, src: string, id: number },
  minLevel: number,
}
const Detail = () => {
  const params = useParams();
  const [pokemonData, setPokemonData] = useState<TGetPokemonDataResponse>();
  const [speciesData, setSpeciesData] = useState<TGetPokemonSpeciesResponse>();
  const [evolutionData, setEvolutionData] = useState<TEvolutionData[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const promises = useRef<AxiosPromise[]>([]);

  useEffect(() => {
    const getPokemonPromise = getPokemonData(`${BASE_URL}${E_API_PATH.GET_POKEMON_LIST}/${params.pokemonName}`)
    getPokemonPromise.then((response) => {
      setPokemonData(response.data);
    })

    promises.current.push(getPokemonPromise);
  }, [params.pokemonName])

  useEffect(() => {
    if (!pokemonData?.species.url) return;

    const getSpeciesPromise = getPokemonSpecies(pokemonData.species.url)
    getSpeciesPromise.then((response) => {
      setSpeciesData(response.data);
    })
    promises.current.push(getSpeciesPromise)
  }, [pokemonData?.species.url])

  useEffect(() => {
    if (!speciesData?.evolution_chain.url) return;

    getPokemonEvolutionChain(speciesData.evolution_chain.url)
    .then((responseEvolution) => {

      const { flatEvolutionChain, uniquePokemonURLList } = getFlatEvolutionChain(responseEvolution.data.chain);

      /** Get all of the pokemon image sprites, from it's evolution chain(s) */
      const uniquePokemonPromises: AxiosPromise<TGetPokemonDataResponse>[] = [];
      uniquePokemonURLList.forEach((url) => {
        const pokemonId = getPokemonIdByUrl(url);
        
        const uniquePokemonPromise = getPokemonDataById(pokemonId);
        uniquePokemonPromises.push(uniquePokemonPromise);
      })

      Promise.all(uniquePokemonPromises)
        .then((responseGetPokemon) => {
          const imgData: {[id: number]: string} = {};
          
          /** Convert the result of the image sprites, grouped by pokemon name as an object */
          responseGetPokemon.forEach(({ data: { name, sprites, id } }) => {
            imgData[id] = sprites.front_default || '';
          })

          /** Map the flattened evolution chain with it's respective image sprite */
          const data: TEvolutionData[] = flatEvolutionChain.map(({from, to, minLevel}) => ({
            from: { ...from, src: imgData[from.id] },
            to: { ...to, src: imgData[to.id] },
            minLevel: minLevel ?? -1,
          }));
          setEvolutionData(data);
        })
    })
  }, [speciesData?.evolution_chain.url])

  useEffect(() => {
    Promise.all(promises.current).then(() => setIsLoading(false));
  }, [])

  const pokemonNumber: string = pokemonData ? `${pokemonData.id}`.padStart(3, '0') : '000';
  const pokemonName: string = pokemonData ? pokemonData.name : '-';
  const pokemonType: TPokemonType = pokemonData ? pokemonData.types[0].type.name : 'normal';
  const pokemonHeaderImage: string = pokemonData ? pokemonData.sprites.other['official-artwork'].front_default: '';
  const description = getFlavorTextByLanguage(speciesData?.flavor_text_entries || [])

  if (isLoading && !evolutionData) {
    return <PageLoader />
  }

  return <div className='detail page'>
    <header className={`detail__header detail__header--${pokemonType}`}>
      <BackButton onClick={() => navigate('/', { replace: true })} />
      <PokeBallLogo className='detail__pokeball' />
      <h4 className='detail__pokemon-number'>#{ pokemonNumber }</h4>
      <h1 className='detail__pokemon-name'>{ pokemonName }</h1>
      <img className='detail__pokemon-header-image' src={pokemonHeaderImage} alt={`${pokemonName}`} />
    </header>
    <main className='detail__content'>
      <Tabs
        accentType={pokemonType}
        tabs={[
          {
            tabName: 'about',
            tabContent: <article>
              <p>{ description }</p>
              <ul className='detail__type-tags'>
                {
                  pokemonData?.types.map(({ type }) => <TypeTag key={type.name} type={type.name} />)
                }
              </ul>
              {
                pokemonData &&
                <>
                  <h2 className={`detail__section-title color color--${pokemonType}`}>Pokédex Data</h2>
                  <DescriptionList
                    accent={pokemonType}
                    descriptions={[
                      {
                        term: 'height',
                        define: `${pokemonData.height/10} m`,
                      },
                      {
                        term: 'weight',
                        define: `${getPokemonWeight(pokemonData.weight).kg} kg (${getPokemonWeight(pokemonData.weight).lb} lbs)`,
                      },
                      {
                        term: 'abilities',
                        define: `${getPokemonAbility(pokemonData.abilities.map(({ ability }) => ability.name))}`,
                      },
                    ]}
                  />
                </>
              }
            </article>
          },
          {
            tabName: 'stats',
            tabContent: <article className='detail__tab-stats'>
              {
                pokemonData &&
                <>
                  <h2 className={`detail__section-title color color--${pokemonType}`}>Base Stats</h2>
                  {
                    pokemonData.stats.map(({ base_stat, stat: { name } }) => <ProgressBar
                      key={name}
                      accent={pokemonType}
                      label={getProperStatName(name)}
                      value={base_stat}
                    />)
                  }
                </>
              }
            </article>
          },
          {
            tabName: 'evolution',
            tabContent: <article>
              {
                pokemonData &&
                  <h2 className={`detail__section-title color color--${pokemonType}`}>Evolution</h2>
              }
              {
                evolutionData &&
                <ul className={`detail__tab-evolution-list color color--${pokemonType}`}>
                  {
                    evolutionData.map(({ from, to, minLevel }) => (
                      <li className='detail__tab-evolution-item' key={`${from.name}-${to.name}`}>
                        <figure>
                          <img src={from.src} alt={from.name} />
                          <figcaption data-currentpokemon={from.id === pokemonData?.id}>{from.name}</figcaption>
                        </figure>
                        <span>{ (minLevel >= 0) && <>Level { minLevel }</> }</span>
                        <figure>
                          <img src={to.src} alt={to.name} />
                          <figcaption data-currentpokemon={to.id === pokemonData?.id}>{to.name}</figcaption>
                        </figure>
                      </li>)
                    )
                  }
                </ul>
              }
            </article>
          }
        ]}
      />
    </main>
  </div>;
};

export default Detail;
