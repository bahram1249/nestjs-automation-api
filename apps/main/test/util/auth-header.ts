export const authHeader = (token = 'test-token') => ({
  Authorization: `Bearer ${token}`,
  'Accept-Language': 'en',
});
