import { createAuthProvider } from 'react-token-auth'

export const { useAuth, authFetch, login, logout } = createAuthProvider({
  storageKey: 'access_token',
  expirationThresholdMillisec: 24 * 3600 * 1000,
  onUpdateToken: async (token) => {
    console.log(token)
    return fetch('/auth/refresh', {
      method: 'POST',
      body: token.refreshToken
    }).then(r => r.json())
  }
})