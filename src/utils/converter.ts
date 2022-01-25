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

/**
 * Get the flattened evolution chain of a single pokemon.
 * 
 * @param chain Pokémon evolution chain
 * @returns List of flatten evolution chain with it's unique name of the list
 */
export const getFlatEvolutionChain = (chain: TGetPokemonEvolutionChainResponse['chain']): {
  flatEvolutionChain: TFlatEvolutionChain[],
  uniquePokemonNameList: Set<string>,
} => {
  const flatEvolutionChain: TFlatEvolutionChain[] = [];
  const uniquePokemonNameList: Set<string> = new Set();

  /**
   * Helper method to get the evolution chain recursively.
   * 
   * @param currentChain Current pokemon evolution chain
   */
  const findEvolutionOf = (currentChain: TGetPokemonEvolutionChainResponse['chain']) => {
    for (let i = 0; i < currentChain.evolves_to.length; i++) {
      flatEvolutionChain.push({
        from: currentChain.species,
        to: currentChain.evolves_to[i].species,
        minLevel: currentChain.evolves_to[i].evolution_details[0]?.min_level || null,
      })

      /** Add target pokemon name to the unique name list */
      uniquePokemonNameList.add(currentChain.evolves_to[i].species.name);

      /** Re-process the evolution chain of the evoluted pokemon */
      findEvolutionOf(currentChain.evolves_to[i]);
    }
  }

  /** Add current pokemon name */
  uniquePokemonNameList.add(chain.species.name);

  /** Start the process with current pokemon */
  findEvolutionOf(chain);

  return { flatEvolutionChain, uniquePokemonNameList };
}