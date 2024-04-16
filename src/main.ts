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
    const createPR = core.getInput('create-pr') === 'true'
    const filePathInput = core.getInput('file-paths')
    const filePaths = filePathInput
      .split(/\r?\n/)
      .filter(path => path.trim() !== '')

    const authorInput = core.getInput('git-author')
    const [authorName, authorEmail] = authorInput.match(/^(.+) <(.+)>$/) || []
    if (!authorName || !authorEmail) {
      throw new Error(
        'Invalid git-author input format. Expected format: "name <email>".'
      )
    }

    const wpVersion = await getLatestWpVersion()
    const filesUpdated = await updateFiles(workspace, filePaths, wpVersion)
    if (!filesUpdated) {
      console.log('No updates are needed.')
      core.setOutput('updated', 'false')
      return
    }

    console.log(`Updated to WordPress ${wpVersion}, committing changes...`)
    const commitMessage = `Update WordPress 'Tested up to' version to ${wpVersion}`
    await git.addConfig('user.email', authorEmail)
    await git.addConfig('user.name', authorName)

    if (createPR) {
      await git.fetch(['--all'])
      const branchName = `tested-up-to-${wpVersion.replace(/\./g, '-')}`
      const branches = await git.branch()
      if (branches?.all.includes(`remotes/origin/${branchName}`)) {
        console.log(`Branch '${branchName}' already exists.`)
        core.setOutput('updated', 'false')
        return
      }

      await git.checkoutLocalBranch(branchName)
      await git.add('.')
      await git.commit(commitMessage)
      await git.push('origin', branchName, ['--set-upstream'])
      await createPullRequest(branchName, wpVersion)
    } else {
      await git.add('.')
      await git.commit(commitMessage)
      await git.push()
    }

    core.setOutput('updated', 'true')
  } catch (error) {
    core.setFailed(
      error instanceof Error ? error.message : JSON.stringify(error)
    )
  }
}
