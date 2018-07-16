import { setRequestURLPrefix } from '../utils/request'
const TEST_ENABLED = process.env.NODE_ENV === 'development'

describe('test', function() {
  it('test', function() {
    expect(TEST_ENABLED).toBe(true)
  })
})
