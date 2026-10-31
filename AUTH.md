# Authentication contract

The separate `building-blocks/auth` entrypoint exports AuthPort, AuthSnapshot, AuthUser, AuthListener, AuthUnsubscribe, AUTH_PORT_KEY and createGuestAuth. It imports no Vue, Firebase, UI, configuration or persistence runtime. Existing content and UI entrypoints are unchanged.

AuthPort exposes getSnapshot(), subscribe(listener), ready(), logout() and getIdToken({ forceRefresh? }). Constructing a port or subscribing does not initialize authentication. ready() explicitly initializes it. subscribe reports subsequent snapshots and returns an idempotent unsubscribe function. The host owns observer disposal and SDK loading. Snapshot states are idle/loading/guest/authenticated/error; only authenticated has a user (id and nullable displayName). Errors use a non-sensitive unavailable code.

Layers can inject the port under AUTH_PORT_KEY using their framework's provider mechanism, or accept it as a normal argument. Without a host, createGuestAuth is a safe permanent guest adapter. Deterministic authenticated adapters belong only in tests, never a production query parameter or configuration bypass. This package does not provide login methods or change provider settings.

The client snapshot is for presentation, never authorization. getIdToken returns null for guests; callers must not log, persist or serialize tokens. Send a token in an Authorization bearer header to an authenticated API; the server verifies it and derives identity independently. No Firebase project credentials, user database, save schema, revocation mechanism or ownership authorization is implemented here.
