import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import './styles.css';

import { BASE_URL, E_API_PATH } from '../../enum/api';
import { TGetPokemonDataResponse, TGetPokemonSpeciesResponse } from '../../interfaces/api';
import { getPokemonDataByName, getPokemonDataByUrl, getPokemonEvolutionChain, getPokemonSpeciesByName } from '../../services/baseApi';
import { ReactComponent as PokeBallLogo } from '../../assets/pokeball.svg';
import Tabs from '../../components/Tabs';
import TypeTag from '../../components/TypeTag';
import BackButton from '../../components/BackButton';
import DescriptionList from '../../components/DescriptionList';
import ProgressBar from '../../components/ProgressBar';
import { TPokemonType } from '../../interfaces/pokemon';
import { getFlatEvolutionChain, getPokemonWeight, getProperStatName } from '../../utils/converter';
import { getFlavorTextByLanguage } from '../../utils/helper';
import { AxiosPromise } from 'axios';

type TEvolutionData = {
  from: { name: string, url: string, src: string },
  to: { name: string, url: string, src: string },
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
    const getPokemonPromise = getPokemonDataByUrl(`${BASE_URL}${E_API_PATH.GET_POKEMON_LIST}/${params.pokemonName}`)
    getPokemonPromise.then((response) => {
      setPokemonData(response.data);
    })

    promises.current.push(getPokemonPromise);
  }, [params.pokemonName])

  useEffect(() => {
    if (!params.pokemonName) return;

    const getSpeciesPromise = getPokemonSpeciesByName(params.pokemonName)
    getSpeciesPromise.then((response) => {
      setSpeciesData(response.data);
    })
    promises.current.push(getSpeciesPromise)
  }, [params.pokemonName])

  useEffect(() => {
    if (!speciesData?.evolution_chain.url) return;

    getPokemonEvolutionChain(speciesData.evolution_chain.url)
    .then((responseEvolution) => {
      const evolutionPromises: AxiosPromise<TGetPokemonDataResponse>[] = [];

      const flatChain = getFlatEvolutionChain(responseEvolution.data.chain);
      flatChain.forEach(({ from, to }, idx) => {        
        const evolutionPromiseFrom = getPokemonDataByName(from.name);
        evolutionPromises.push(evolutionPromiseFrom);

        if (idx === flatChain.length - 1) {
          const evolutionPromiseTo = getPokemonDataByName(to.name);
          evolutionPromises.push(evolutionPromiseTo);
        }
      })

      Promise.all(evolutionPromises)
        .then((responseGetPokemon) => {
          const imgData: {[key: string]: string} = {};
          
          responseGetPokemon.forEach(({ data: { name, sprites } }) => {
            imgData[name] = sprites.front_default || '';
          })
          const data: TEvolutionData[] = flatChain.map(({from, to, minLevel}) => ({
            from: { ...from, src: imgData[from.name] },
            to: { ...to, src: imgData[to.name] },
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
    return <div className='detail page'>Loading...</div>
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
                        define: 'chlorophyll, overgrow',
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
                <>
                  <h2 className={`detail__section-title color color--${pokemonType}`}>Evolution</h2>

                </>
              }
              {
                evolutionData &&
                <ul className={`detail__tab-evolution-list color color--${pokemonType}`}>
                  {
                    evolutionData.map(({ from, to, minLevel }) => (
                      <li className='detail__tab-evolution-item' key={from.name}>
                        <figure>
                          <img src={from.src} alt={from.name} />
                          <figcaption data-currentpokemon={from.name === pokemonData?.name}>{from.name}</figcaption>
                        </figure>
                        <span>Level { minLevel }</span>
                        <figure>
                          <img src={to.src} alt={to.name} />
                          <figcaption data-currentpokemon={to.name === pokemonData?.name}>{to.name}</figcaption>
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
