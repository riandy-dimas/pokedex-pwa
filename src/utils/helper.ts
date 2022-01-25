import { TGetPokemonSpeciesResponse } from '../interfaces/api'

export const getFlavorTextByLanguage = (texts: TGetPokemonSpeciesResponse['flavor_text_entries'], lang: string = 'en'): string => {
  const results = texts.filter(({ language }) => language.name === lang);
  return results[0]?.flavor_text || '-'
}