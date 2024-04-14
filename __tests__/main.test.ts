/**
 * Unit tests for the main action file
 */

import * as core from '@actions/core'
import { run } from '../src/main'
import {
  getLatestWpVersion,
  updateFiles,
  createPullRequest
} from '../src/utils'
import { mocked } from 'jest-mock'

jest.mock('@actions/core')
jest.mock('../src/utils')
jest.mock('simple-git', () => ({
  simpleGit: jest.fn().mockImplementation(() => ({
    cwd: jest.fn().mockReturnThis(),
    addConfig: jest.fn().mockReturnThis(),
    checkoutLocalBranch: jest.fn().mockReturnThis(),
    add: jest.fn().mockReturnThis(),
    commit: jest.fn().mockReturnThis(),
    push: jest.fn().mockReturnThis()
  }))
}))

describe('action', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('completes after updating files', async () => {
    mocked(core.getInput).mockReturnValueOnce('true')
    mocked(core.getInput).mockReturnValueOnce('readme.txt\nanother-file.txt')
    mocked(getLatestWpVersion).mockResolvedValueOnce('5.9')
    mocked(updateFiles).mockResolvedValueOnce(true)
    mocked(createPullRequest).mockResolvedValueOnce()

    await run()

    expect(core.getInput).toHaveBeenCalledWith('file-paths')
    expect(getLatestWpVersion).toHaveBeenCalled()
    expect(updateFiles).toHaveBeenCalled()
    expect(createPullRequest).toHaveBeenCalled()
    expect(core.setOutput).toHaveBeenCalledWith('updated', 'true')
  })

  it('completes with no updates needed', async () => {
    mocked(core.getInput).mockReturnValueOnce('true')
    mocked(core.getInput).mockReturnValueOnce('readme.txt\nanother-file.txt')
    mocked(getLatestWpVersion).mockResolvedValueOnce('5.9')
    mocked(updateFiles).mockResolvedValueOnce(false)

    await run()

    expect(core.getInput).toHaveBeenCalledWith('file-paths')
    expect(getLatestWpVersion).toHaveBeenCalled()
    expect(updateFiles).toHaveBeenCalled()
    expect(core.setOutput).toHaveBeenCalledWith('updated', 'false')
  })

  it('handles errors gracefully', async () => {
    const error = new Error('An unexpected error')
    mocked(core.getInput).mockReturnValueOnce('true')
    mocked(core.getInput).mockReturnValueOnce('readme.txt')
    mocked(getLatestWpVersion).mockRejectedValueOnce(error)

    await run()

    expect(core.setFailed).toHaveBeenCalledWith(error.message)
  })
})
