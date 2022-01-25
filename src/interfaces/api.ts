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
  sprites: {
    back_default: string | null
    front_default: string | null
    other: {
      'official-artwork': {
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
