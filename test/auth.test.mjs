import { test } from 'node:test'
import assert from 'node:assert/strict'
import { AUTH_PORT_KEY, createGuestAuth } from '../dist/auth.js'

test('standalone guest cannot grant identity or a token', async () => {
  const auth = createGuestAuth()
  assert.equal(AUTH_PORT_KEY, 'building-blocks.auth.v1')
  assert.deepEqual(await auth.ready(), { status: 'guest', user: null })
  assert.equal(await auth.getIdToken({ forceRefresh: true }), null)
  const stop = auth.subscribe(() => assert.fail('guest never changes identity'))
  await auth.logout()
  stop(); stop()
  assert.deepEqual(auth.getSnapshot(), { status: 'guest', user: null })
  assert.ok(Object.isFrozen(auth.getSnapshot()))
})
