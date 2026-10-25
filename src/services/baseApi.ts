// Import dependencies
import axios, { AxiosPromise, AxiosResponse } from 'axios'
import { setupCache } from 'axios-cache-interceptor'
import { BASE_URL, CACHE_AGE_IN_MINUTES, E_API_PATH } from '../enum/api';
import {
  TGetPokemonDataResponse,
  TGetPokemonEvolutionChainResponse,
  TGetPokemonListCallback,
  TGetPokemonListParam,
  TGetPokemonListResponse,
  TGetPokemonSpeciesResponse,
} from '../interfaces/api';

// Keep the existing in-memory cache lifetime with Axios 1's supported interceptor.
const api = setupCache(axios.create(), {
  ttl: CACHE_AGE_IN_MINUTES * 60 * 1000,
  interpretHeader: false,
  cacheTakeover: false,
})

const getPokemonList = ({
  limit,
  offset,
}: TGetPokemonListParam, callback: TGetPokemonListCallback) => {
  
  api({
    url: `${BASE_URL}${E_API_PATH.GET_POKEMON_LIST}?limit=${limit}&offset=${offset}`,
    method: 'get',
  })
  .then(async (response: AxiosResponse<TGetPokemonListResponse>) => {
    callback(response.data);
  })
  .catch((e: Error) => console.error(`Error fetching Pokemon List: ${e}`))
}

const baseGetApi = <T>(url: string):AxiosPromise<T> => {
  return api({
    url,
    method: 'get',
  })
}

const getPokemonDataById = (id: string) => {
  const url = `${BASE_URL}${E_API_PATH.GET_POKEMON_LIST}/${id}`;
  return baseGetApi<TGetPokemonDataResponse>(url);
}

const getPokemonData = (url: string) => baseGetApi<TGetPokemonDataResponse>(url);

const getPokemonSpecies = (url: string) => baseGetApi<TGetPokemonSpeciesResponse>(url);

const getPokemonEvolutionChain = (url: string) => baseGetApi<TGetPokemonEvolutionChainResponse>(url);

export {
  getPokemonData,
  getPokemonEvolutionChain,
  getPokemonList,
  getPokemonSpecies,
  getPokemonDataById,
};
