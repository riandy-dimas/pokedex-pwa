import { E_STAT_NAME } from "../enum/pokemon"

export const getPokemonWeight = (weightData: number) => ({
  kg: weightData / 10,
  lb: Math.round(((weightData / 10) * 2.205) * 10) / 10
})

export const getProperStatName = (statName: keyof typeof E_STAT_NAME) => {
  return E_STAT_NAME[statName] || statName;
}