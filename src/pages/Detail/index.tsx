import { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import './styles.css';

import { BASE_URL, E_API_PATH } from '../../enum/api';
import { TGetPokemonDataResponse } from '../../interfaces/api';
import { getPokemonDataByUrl, getPokemonSpeciesByName } from '../../services/baseApi';
import { ReactComponent as PokeBallLogo } from '../../assets/pokeball.svg';
import Tabs from '../../components/Tabs';
import TypeTag from '../../components/TypeTag';
import BackButton from '../../components/BackButton';
import DescriptionList from '../../components/DescriptionList';
import ProgressBar from '../../components/ProgressBar';
import { TPokemonType } from '../../interfaces/pokemon';
import { getPokemonWeight, getProperStatName } from '../../utils/converter';

const Detail = () => {
  const params = useParams();
  const [pokemonData, setPokemonData] = useState<TGetPokemonDataResponse>();
  const [description, setDescription] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    getPokemonDataByUrl(`${BASE_URL}${E_API_PATH.GET_POKEMON_LIST}/${params.pokemonName}`)
    .then((response) => {
      setPokemonData(response.data);
    })
  }, [params.pokemonName])

  useEffect(() => {
    if (!params.pokemonName) return;

    getPokemonSpeciesByName(params.pokemonName)
    .then((response) => {
      setDescription(response.data.flavor_text_entries[0].flavor_text);
    })
  }, [params.pokemonName])

  const pokemonNumber: string = pokemonData ? `${pokemonData.id}`.padStart(3, '0') : '000';
  const pokemonName: string = pokemonData ? pokemonData.name : '-';
  const pokemonType: TPokemonType = pokemonData ? pokemonData.types[0].type.name : 'normal';
  const pokemonHeaderImage: string = pokemonData ? pokemonData.sprites.other['official-artwork'].front_default: '';
  return <div className='detail page'>
    <header className={`detail__header detail__header--${pokemonType}`}>
      <BackButton onClick={() => navigate(-1)} />
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
                  {
                    pokemonData.stats.map(({ base_stat, stat: { name } }) => <ProgressBar key={name} accent={pokemonType} label={getProperStatName(name)} value={base_stat} />)
                  }
                </>
              }
            </article>
          },
          {
            tabName: 'evolution',
            tabContent: <article>This is evolution</article>
          }
        ]}
      />
    </main>
  </div>;
};

export default Detail;
