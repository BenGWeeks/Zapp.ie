// lnbitsServiceLocal.test.ts
import {
  getAccessToken,
  getWallets,
  getWalletBalance,
  getUserWallets,
  createInvoice,
  payInvoice
} from './lnbitsServiceLocal'; // Adjust the path if necessary
import { 
  expect, 
  describe, 
  test,
  beforeEach,
  jest
 } from '@jest/globals';

// Cast `fetch` to `jest.MockedFunction` in a valid way for TypeScript
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
mockFetch.mockImplementation(() => Promise.resolve({
  ok: true,
  json: async () => ({})
}));

describe('lnbitsServiceLocal Tests', () => {
  const mockAccessToken = 'mockedAccessToken';
  const mockInKey = 'mockedInKey';
  const mockAdminKey = 'mockedAdminKey';

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('accessToken', mockAccessToken);
  });

  test('getAccessToken should return the access token from localStorage', async () => {
    const token = await getAccessToken('user', 'password');
    expect(token).toBe(mockAccessToken);
    expect(fetch).not.toHaveBeenCalled(); // Should not make an API call if token is cached
  });

  test('getWallets should return a filtered list of wallets', async () => {
    const mockWallets = [{ id: 'wallet1', name: 'testWallet' }];
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockWallets,
    });

    const result = await getWallets();
    expect(result).toEqual(mockWallets);
    expect(fetch).toHaveBeenCalledWith(expect.any(String), expect.any(Object));
  });
  
    test('getWalletBalance should return the wallet balance', async () => {
      const mockBalance = { balance: 5000 };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockBalance,
      });
  
      const balance = await getWalletBalance(mockInKey);
      expect(balance).toBe(5); 
    });
  
    test('getUserWallets should return user wallets', async () => {
      const mockUserWallets = [{ id: 'wallet1', name: 'userWallet' }];
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUserWallets,
      });
  
      const result = await getUserWallets(mockAdminKey, 'userId');
      expect(result).toEqual(mockUserWallets);
      expect(fetch).toHaveBeenCalled();
    });
  
    test('createInvoice should create an invoice and return the payment request', async () => {
      const mockInvoice = { payment_request: 'lnbc1...' };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockInvoice,
      });
  
      const paymentRequest = await createInvoice(mockInKey, 'walletId', 1000, 'test memo');
      expect(paymentRequest).toBe(mockInvoice.payment_request);
      expect(fetch).toHaveBeenCalled();
    });
  
    test('payInvoice should resolve the payment successfully', async () => {
      const mockPaymentResult = { payment_hash: '123abc' };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockPaymentResult,
      });
  
      const result = await payInvoice(mockAdminKey, 'paymentRequest');
      expect(result).toEqual(mockPaymentResult);
      expect(fetch).toHaveBeenCalled();
    });
  });
  
