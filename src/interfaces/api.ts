import { E_STAT_NAME } from "../enum/pokemon";
import { TPokemonType } from "./pokemon";

export type TGetPokemonListParam = {
  limit: number
  offset: number
}
export type TGetPokemonListCallback = (result: TGetPokemonListResponse) => void;
export type TGetPokemonListResponse = {
  count: number
  next: string | null
  previous: string | null
  results: {
    name: string
    url: string
  }[]
}

export type TGetPokemonDataResponse = {
  id: number
  name: string
  height: number
  weight: number
  stats: {
    base_stat: number
    stat: {
      name: keyof typeof E_STAT_NAME
    }
  }[]
  sprites: {
    back_default: string | null
    front_default: string | null
    other: {
      'official-artwork': {
        front_default: string
      }
      dream_world: {
        front_default: string
      }
    }
  }
  types: {
    slot: number,
    type: {
      name: TPokemonType
      url: string
    }
  }[]
}

export type TGetPokemonSpeciesResponse = {
  id: number,
  flavor_text_entries: {
    flavor_text: string
  }[],
  evolution_chain: {
    url: string
  }
}


type TEvolutionChain = {
  species: {
    name: string
    url: string
  }
  evolution_details: {
    min_level: number
  }[]
  evolves_to: TEvolutionChain[]
}
export type TGetPokemonEvolutionChainResponse = {
  id: number
  chain: TEvolutionChain
}
