import { expect, test } from 'vitest'
import apiCall from './lib/testing'

test('Check is DB loaded', async () => {
    expect(await apiCall({ path: '/db/info' })).toBe(200)
})

test('Test query activities id', async () => {
    expect(await apiCall({ method: 'PUT', path: '/activities/getbyid', body: { id: "QUf6wRBTe2YqwP21LcNu" } })).toBe(200)
})

test('Test query restaurant id', async () => {
    expect(await apiCall({ method: 'PUT', path: '/restaurant/getbyid', body: { id: "56Q7dSnHOWLGc0jNYJ8J" } })).toBe(200)
})

test('Test query roadtrip id', async () => {
    expect(await apiCall({ method: 'PUT', path: '/roadtrip/getbyid', body: { id: "hy3YfqlDJ7vem9s7Evxn" } })).toBe(200)
})

test('Test query reward id', async () => {
    expect(await apiCall({ method: 'PUT', path: '/reward/getbyid', body: { id: "rVOhChEDeVqp99vRQ8vl" } })).toBe(200)
})

test('Test query province name', async () => {
    expect(await apiCall({ method: 'PUT', path: '/province/getbyname', body: { name: "songkhla" } })).toBe(200)
})