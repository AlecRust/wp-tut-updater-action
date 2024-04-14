import * as core from '@actions/core'
import { simpleGit } from 'simple-git'
import { getLatestWpVersion, updateFiles, createPullRequest } from './utils'

const git = simpleGit()

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const workspace = process.env.GITHUB_WORKSPACE as string
    git.cwd(workspace)

    const filePathInput = core.getInput('file-paths')
    const filePaths = filePathInput
      .split(/\r?\n/)
      .filter(path => path.trim() !== '')
    console.log('Paths to update:', filePaths)

    const wpVersion = await getLatestWpVersion()
    const updated = await updateFiles(workspace, filePaths, wpVersion)
    if (!updated) {
      console.log('No updates are needed.')
      core.setOutput('updated', 'false')
      return
    }

    console.log('Updating files to WordPress version', wpVersion)
    const branchName = `tested-up-to-${wpVersion.replace(/\./g, '-')}`
    await git.addConfig('user.email', 'action@github.com')
    await git.addConfig('user.name', 'GitHub Action')
    await git.checkoutLocalBranch(branchName)
    await git.add('.')
    await git.commit(`Update WordPress 'Tested up to' version to ${wpVersion}`)
    await git.push('origin', branchName, ['--set-upstream'])

    await createPullRequest(branchName, wpVersion)

    core.setOutput('updated', 'true')
  } catch (error) {
    core.setFailed(
      error instanceof Error ? error.message : JSON.stringify(error)
    )
  }
}
