// src/components/lnbitsService.test.ts

import { getAccessToken } from './lnbitsService'; // Ensure this path is correct

const lnbiturl = 'https://demo.lnbits.com'; // Mock URL for testing

describe('getAccessToken', () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    (global as any).fetch = jest.fn();
  });

  it('should return access token on successful response', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ access_token: 'mockToken' }),
    };
    (global as any).fetch.mockResolvedValue(mockResponse);

    const token = await getAccessToken('testUser', 'testPass');
    expect(token).toBe('mockToken');
    expect(fetch).toHaveBeenCalledWith(`${lnbiturl}/api/v1/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: 'testUser', password: 'testPass' }),
    });
  });

  it('should throw an error on unsuccessful response', async () => {
    const mockResponse = {
      ok: false,
      status: 401,
    };
    (global as any).fetch.mockResolvedValue(mockResponse);

    await expect(getAccessToken('testUser', 'testPass')).rejects.toThrow('HTTP error! status: 401');
    expect(fetch).toHaveBeenCalledWith(`${lnbiturl}/api/v1/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: 'testUser', password: 'testPass' }),
    });
  });

  it('should handle fetch error', async () => {
    (global as any).fetch.mockRejectedValue(new Error('Fetch error'));

    await expect(getAccessToken('testUser', 'testPass')).rejects.toThrow('Fetch error');
    expect(fetch).toHaveBeenCalledWith(`${lnbiturl}/api/v1/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: 'testUser', password: 'testPass' }),
    });
  });
});