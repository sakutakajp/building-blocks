import { createGuestAuth, type AuthPort, type AuthSnapshot } from '../src/auth.js'
const port: AuthPort = createGuestAuth()
const snapshot: AuthSnapshot = port.getSnapshot()
if (snapshot.status === 'authenticated') {
  const id: string = snapshot.user.id
  void id
} else {
  const noUser: null = snapshot.user
  void noUser
}
// @ts-expect-error guests must never carry an authenticated identity
const invalid: AuthSnapshot = { status: 'guest', user: { id: 'x', displayName: null } }
void invalid
