require('jest-fetch-mock').enableMocks()
const injectRemoteFile = require('./injectRemoteFile')
const io = require('@actions/io')
const fs = require('fs')

const TEST_DIRECTORY = './.test'
const TEST_TARGET = TEST_DIRECTORY + '/test.md'

beforeAll(() => {
  fetch.mockResponse('hello world')
  return io.mkdirP(TEST_DIRECTORY)
})

beforeEach(() => fs.writeFileSync(TEST_TARGET, ''))

test('fails if url is invalid', () => {
  expect.assertions(1)
  return expect(
    injectRemoteFile(
      'ssh://raw.githubusercontent.com/olivr-com/defaults/master/readme/support.md',
      TEST_TARGET
    )
  ).rejects.toThrow('Please ensure your url is a valid http(s) url')
})

test('fails if target file does not exist', () => {
  fs.unlinkSync(TEST_TARGET)

  expect.assertions(1)
  return expect(
    injectRemoteFile('http://test.com/support.md', TEST_TARGET)
  ).rejects.toThrow('Please ensure your target file already exists')
})

test('fails if no pattern is specified and cannot detect pattern', () => {
  expect.assertions(1)
  return expect(
    injectRemoteFile('http://test.com', TEST_TARGET)
  ).rejects.toThrow('Could not detect a pattern, please specify it manually')
})

test('succeeds if no pattern is specified and can detect pattern', () => {
  fs.writeFileSync(TEST_TARGET, '<!-- auto-support --><!-- auto-support -->')

  expect.assertions(1)
  return expect(
    injectRemoteFile('http://test.com/support.md', TEST_TARGET)
  ).resolves.toContain(TEST_TARGET)
})

test('succeeds if a pattern is specified', () => {
  const PATTERN = '<!-- my-pattern -->'
  fs.writeFileSync(TEST_TARGET, PATTERN + PATTERN)

  expect.assertions(1)
  return expect(
    injectRemoteFile('http://test.com/support.md', TEST_TARGET, PATTERN)
  ).resolves.toContain(TEST_TARGET)
})

test('succeeds if target does not contain the pattern and force is TRUE', () => {
  expect.assertions(1)
  return expect(
    injectRemoteFile('http://test.com/support.md', TEST_TARGET)
  ).resolves.toContain(TEST_TARGET)
})

test('succeeds if target does not contain the pattern and force is FALSE', () => {
  expect.assertions(1)
  return expect(
    injectRemoteFile('http://test.com/support.md', TEST_TARGET, '', false)
  ).resolves.toContain('')
})

test('outputs that no file is changed if it is the case', () => {
  expect.assertions(1)
  return expect(
    injectRemoteFile('http://test.com/support.md', TEST_TARGET).then(() =>
      injectRemoteFile('http://test.com/support.md', TEST_TARGET)
    )
  ).resolves.toContain('')
})

afterAll(() => io.rmRF(TEST_DIRECTORY))
