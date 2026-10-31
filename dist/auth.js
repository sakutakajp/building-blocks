/** Shared injection name; framework adapters own their injection mechanism. */
export const AUTH_PORT_KEY = 'building-blocks.auth.v1';
/** Standalone/SSR fallback. It never authenticates or issues a token. */
export function createGuestAuth() {
    const snapshot = Object.freeze({ status: 'guest', user: null });
    return {
        getSnapshot: () => snapshot,
        subscribe: () => () => { },
        ready: async () => snapshot,
        logout: async () => { },
        getIdToken: async () => null,
    };
}
