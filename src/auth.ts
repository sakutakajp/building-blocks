/** Shared injection name; framework adapters own their injection mechanism. */
export const AUTH_PORT_KEY = 'building-blocks.auth.v1' as const

/** Display identity only. Never use this client-side value for authorization. */
export interface AuthUser {
  readonly id: string
  readonly displayName: string | null
}

export type AuthSnapshot =
  | { readonly status: 'idle' | 'loading' | 'guest'; readonly user: null }
  | { readonly status: 'authenticated'; readonly user: AuthUser }
  | { readonly status: 'error'; readonly user: null; readonly code: 'unavailable' }

export type AuthListener = (snapshot: AuthSnapshot) => void
export type AuthUnsubscribe = () => void

/** No Firebase, framework, provider configuration, persistence or login UI. */
export interface AuthPort {
  getSnapshot(): AuthSnapshot
  /** Reports subsequent changes. Subscribing alone does not initialize auth. */
  subscribe(listener: AuthListener): AuthUnsubscribe
  /** Explicitly initialize auth; concurrent calls may share initialization. */
  ready(): Promise<AuthSnapshot>
  logout(): Promise<void>
  /** Returns null for guests; never cache or serialize the token. */
  getIdToken(options?: { readonly forceRefresh?: boolean }): Promise<string | null>
}

/** Standalone/SSR fallback. It never authenticates or issues a token. */
export function createGuestAuth(): AuthPort {
  const snapshot: AuthSnapshot = Object.freeze({ status: 'guest', user: null })
  return {
    getSnapshot: () => snapshot,
    subscribe: () => () => {},
    ready: async () => snapshot,
    logout: async () => {},
    getIdToken: async () => null,
  }
}
