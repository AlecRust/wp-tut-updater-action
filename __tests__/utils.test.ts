/**
 * Unit tests for the utils file
 */

import * as utils from '../src/utils'
import * as fs from 'fs'
import axios from 'axios'

jest.mock('axios')
jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn()
  }
}))

describe('utils', () => {
  beforeEach(() => {
    jest
      .spyOn(fs.promises, 'readFile')
      .mockResolvedValue('Tested up to:     5.8')
    jest.spyOn(fs.promises, 'writeFile').mockResolvedValue()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('getLatestWpVersion', () => {
    it('fetches the latest WordPress version successfully', async () => {
      jest.spyOn(axios, 'get').mockResolvedValue({
        data: { offers: [{ current: '5.9.1' }] }
      })

      const version = await utils.getLatestWpVersion()
      expect(version).toBe('5.9')
    })

    it('throws an error if the WordPress version cannot be determined', async () => {
      jest.spyOn(axios, 'get').mockRejectedValue(new Error('Network error'))

      await expect(utils.getLatestWpVersion()).rejects.toThrow('Network error')
    })
  })

  describe('updateFiles', () => {
    it('updates the version in the file', async () => {
      const basePath = '/fake/dir'
      const filePaths = ['readme.txt']
      const newWpVersion = '5.9'

      await utils.updateFiles(basePath, filePaths, newWpVersion)
      expect(fs.promises.writeFile).toHaveBeenCalledWith(
        `${basePath}/readme.txt`,
        'Tested up to:     5.9'
      )
    })
  })
})
