// Import dependencies
import axios, { AxiosPromise, AxiosResponse } from 'axios'
import { setupCache } from 'axios-cache-adapter'
import { BASE_URL, CACHE_AGE_IN_MINUTES, E_API_PATH } from '../enum/api';
import {
  TGetPokemonDataResponse,
  TGetPokemonEvolutionChainResponse,
  TGetPokemonListCallback,
  TGetPokemonListParam,
  TGetPokemonListResponse,
  TGetPokemonSpeciesResponse,
} from '../interfaces/api';

// Create `axios-cache-adapter` instance
const cache = setupCache({
  maxAge: CACHE_AGE_IN_MINUTES * 60 * 1000
})

// Create `axios` instance passing the newly created `cache.adapter`
const api = axios.create({
  adapter: cache.adapter
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

const getPokemonData = (url: string) => baseGetApi<TGetPokemonDataResponse>(url);

const getPokemonSpecies = (url: string) => baseGetApi<TGetPokemonSpeciesResponse>(url);

const getPokemonEvolutionChain = (url: string) => baseGetApi<TGetPokemonEvolutionChainResponse>(url);

export {
  getPokemonData,
  getPokemonEvolutionChain,
  getPokemonList,
  getPokemonSpecies,
};
