import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import './styles.css';

import { BASE_URL, E_API_PATH } from '../../enum/api';
import { TGetPokemonDataResponse } from '../../interfaces/api';
import { getPokemonDataByUrl, getPokemonSpeciesByName } from '../../services/baseApi';
import { ReactComponent as PokeBallLogo } from '../../assets/pokeball.svg';
import Tabs from '../../components/Tabs';
import { TPokemonType } from '../../interfaces/pokemon';

const Detail = () => {
  const params = useParams();
  const [pokemonData, setPokemonData] = useState<TGetPokemonDataResponse>();
  const [description, setDescription] = useState<string>('');

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
  const pokemonType: string = pokemonData ? pokemonData.types[0].type.name : '-';
  const pokemonHeaderImage: string = pokemonData ? pokemonData.sprites.other['official-artwork'].front_default: '';
  return <div className='detail page'>
    <header className={`detail__header detail__header--${pokemonType}`}>
      <PokeBallLogo className='detail__pokeball' />
      <h4 className='detail__pokemon-number'>#{ pokemonNumber }</h4>
      <h1 className='detail__pokemon-name'>{ pokemonName }</h1>
      <img className='detail__pokemon-header-image' src={pokemonHeaderImage} alt={`${pokemonName}`} />
    </header>
    <main className='detail__content'>
      <Tabs
        accentType={pokemonType as TPokemonType}
        tabs={[
          {
            tabName: 'about',
            tabContent: <article>{ description }</article>
          },
          {
            tabName: 'stats',
            tabContent: <article>This is Stats</article>
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
