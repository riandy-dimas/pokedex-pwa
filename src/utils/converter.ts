export const getPokemonWeight = (weightData: number) => ({
  kg: weightData / 10,
  lb: Math.round(((weightData / 10) * 2.205) * 10) / 10
})