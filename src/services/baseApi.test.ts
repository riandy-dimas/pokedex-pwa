import { getPokemonDataById } from './baseApi';
import { AxiosError } from 'axios';

const mockTransport = jest.fn();
jest.mock('axios', () => {
  const actual = jest.requireActual('axios');
  return {
    __esModule: true,
    ...actual,
    default: {
      ...actual.default,
      create: () => actual.default.create({ adapter: (config: unknown) => mockTransport(config) }),
    },
  };
});

beforeEach(() => {
  mockTransport.mockReset();
  mockTransport.mockImplementation(async (config) => ({
    data: { id: 1, name: 'bulbasaur' }, status: 200, statusText: 'OK', headers: {}, config,
  }));
});

test('reuses successful responses and keeps different Pokémon requests separate', async () => {
  expect((await getPokemonDataById('1')).data.name).toBe('bulbasaur');
  await getPokemonDataById('1');
  expect(mockTransport).toHaveBeenCalledTimes(1);
  await getPokemonDataById('2');
  expect(mockTransport).toHaveBeenCalledTimes(2);
});

test('retries failed requests instead of caching the failure', async () => {
  mockTransport.mockImplementationOnce(async (config) => {
    throw new AxiosError('Fixture network failure', 'ERR_NETWORK', config);
  });
  await expect(getPokemonDataById('3')).rejects.toThrow('Fixture network failure');
  await expect(getPokemonDataById('3')).resolves.toMatchObject({ status: 200 });
  expect(mockTransport).toHaveBeenCalledTimes(2);
});
