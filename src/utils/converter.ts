import { E_STAT_NAME } from "../enum/pokemon"
import { TGetPokemonEvolutionChainResponse } from "../interfaces/api";
import { getPokemonIdByUrl } from "./helper";

export const getPokemonWeight = (weightData: number) => ({
  kg: weightData / 10,
  lb: Math.round(((weightData / 10) * 2.205) * 10) / 10
})

export const getPokemonAbility = (abilityNames: string[]) => {
  return abilityNames.map((name) => name.replaceAll('-', ' ')).join(', ')
}

export const getProperStatName = (statName: keyof typeof E_STAT_NAME) => {
  return E_STAT_NAME[statName] || statName;
}

export type TFlatEvolutionChain = {
  from: { name: string, id: number, url: string }
  to: { name: string, id: number, url: string }
  minLevel: number | null
}

/**
 * Get the flattened evolution chain of a single pokemon.
 * 
 * @param chain Pokémon evolution chain
 * @returns List of flatten evolution chain with it's unique URL and name of the list
 */
export const getFlatEvolutionChain = (chain: TGetPokemonEvolutionChainResponse['chain']): {
  flatEvolutionChain: TFlatEvolutionChain[],
  uniquePokemonURLList: Set<string>,
  uniquePokemonNameList: Set<string>,
} => {
  const flatEvolutionChain: TFlatEvolutionChain[] = [];
  const uniquePokemonURLList: Set<string> = new Set();
  const uniquePokemonNameList: Set<string> = new Set();

  /**
   * Helper method to get the evolution chain recursively.
   * 
   * @param currentChain Current pokemon evolution chain
   */
  const findEvolutionOf = (currentChain: TGetPokemonEvolutionChainResponse['chain']) => {
    for (let i = 0; i < currentChain.evolves_to.length; i++) {
      flatEvolutionChain.push({
        from: {
          ...currentChain.species,
          id: +getPokemonIdByUrl(currentChain.species.url),
        },
        to: {
          ...currentChain.evolves_to[i].species,
          id: +getPokemonIdByUrl(currentChain.evolves_to[i].species.url),
        },
        minLevel: currentChain.evolves_to[i].evolution_details[0]?.min_level || null,
      })

      /** Add target pokemon URL to the unique URL list and name */
      uniquePokemonURLList.add(currentChain.evolves_to[i].species.url);
      uniquePokemonNameList.add(currentChain.evolves_to[i].species.name);

      /** Re-process the evolution chain of the evoluted pokemon */
      findEvolutionOf(currentChain.evolves_to[i]);
    }
  }

  /** Add current pokemon URL and name */
  uniquePokemonURLList.add(chain.species.url);
  uniquePokemonNameList.add(chain.species.name);

  /** Start the process with current pokemon */
  findEvolutionOf(chain);

  return { flatEvolutionChain, uniquePokemonURLList, uniquePokemonNameList };
}