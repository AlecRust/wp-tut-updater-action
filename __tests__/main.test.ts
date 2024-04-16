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
import { simpleGit } from 'simple-git'

jest.mock('@actions/core')
jest.mock('../src/utils')
jest.mock('simple-git', () => {
  const mockGit = {
    addConfig: jest.fn(),
    checkoutLocalBranch: jest.fn(),
    add: jest.fn(),
    commit: jest.fn(),
    push: jest.fn(),
    cwd: jest.fn()
  }
  return {
    simpleGit: jest.fn(() => mockGit)
  }
})

describe('action', () => {
  const mockGit = simpleGit()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  /* eslint-disable @typescript-eslint/unbound-method */
  it('completes after updating files and creates PR when create-pr is true', async () => {
    mocked(core.getInput).mockReturnValueOnce('true') // create-pr is true
    mocked(core.getInput).mockReturnValueOnce('readme.txt\nanother-file.txt')
    mocked(core.getInput).mockReturnValueOnce('Test Name <email@example.com>')
    mocked(getLatestWpVersion).mockResolvedValueOnce('5.9')
    mocked(updateFiles).mockResolvedValueOnce(true)

    await run()

    expect(core.getInput).toHaveBeenCalledWith('file-paths')
    expect(getLatestWpVersion).toHaveBeenCalled()
    expect(updateFiles).toHaveBeenCalled()
    expect(mockGit.checkoutLocalBranch).toHaveBeenCalled()
    expect(mockGit.add).toHaveBeenCalledWith('.')
    expect(mockGit.commit).toHaveBeenCalled()
    expect(mockGit.push).toHaveBeenCalledWith('origin', expect.any(String), [
      '--set-upstream'
    ])
    expect(createPullRequest).toHaveBeenCalled()
    expect(core.setOutput).toHaveBeenCalledWith('updated', 'true')
  })

  it('completes after updating files and pushes to main branch when create-pr is false', async () => {
    mocked(core.getInput).mockReturnValueOnce('false') // create-pr is false
    mocked(core.getInput).mockReturnValueOnce('readme.txt\nanother-file.txt')
    mocked(core.getInput).mockReturnValueOnce('Test Name <email@example.com>')
    mocked(getLatestWpVersion).mockResolvedValueOnce('5.9')
    mocked(updateFiles).mockResolvedValueOnce(true)

    await run()

    expect(core.getInput).toHaveBeenCalledWith('file-paths')
    expect(getLatestWpVersion).toHaveBeenCalled()
    expect(updateFiles).toHaveBeenCalled()

    expect(mockGit.add).toHaveBeenCalledWith('.')
    expect(mockGit.commit).toHaveBeenCalled()
    expect(mockGit.push).toHaveBeenCalled()
    expect(mockGit.push).toHaveBeenCalledWith()
    expect(createPullRequest).not.toHaveBeenCalled()
    expect(core.setOutput).toHaveBeenCalledWith('updated', 'true')
  })
  /* eslint-enable @typescript-eslint/unbound-method */

  it('completes with no updates needed', async () => {
    mocked(core.getInput).mockReturnValueOnce('true')
    mocked(core.getInput).mockReturnValueOnce('readme.txt\nanother-file.txt')
    mocked(core.getInput).mockReturnValueOnce('Test Name <email@example.com>')
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
    mocked(core.getInput).mockReturnValueOnce('Test Name <email@example.com>')
    mocked(getLatestWpVersion).mockRejectedValueOnce(error)

    await run()

    expect(core.setFailed).toHaveBeenCalledWith(error.message)
  })
})
