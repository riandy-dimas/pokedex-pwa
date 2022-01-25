import { E_STAT_NAME } from "../enum/pokemon"
import { TGetPokemonEvolutionChainResponse } from "../interfaces/api";

export const getPokemonWeight = (weightData: number) => ({
  kg: weightData / 10,
  lb: Math.round(((weightData / 10) * 2.205) * 10) / 10
})

export const getProperStatName = (statName: keyof typeof E_STAT_NAME) => {
  return E_STAT_NAME[statName] || statName;
}

export type TFlatEvolutionChain = {
  from: { name: string, url: string }
  to: { name: string, url: string }
  minLevel: number | null
}

export const getFlatEvolutionChain = (chain: TGetPokemonEvolutionChainResponse['chain']): TFlatEvolutionChain[] => {
  const result: TFlatEvolutionChain[] = [];

  let currentChain = chain;
  while(currentChain.evolves_to.length > 0) {
    result.push({
      from: currentChain.species,
      to: currentChain.evolves_to[0].species,
      minLevel: currentChain.evolves_to[0].evolution_details[0]?.min_level || null,
    })

    currentChain = currentChain.evolves_to[0];
  }

  return result;
}