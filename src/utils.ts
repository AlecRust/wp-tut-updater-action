import * as fs from 'fs'
import * as path from 'path'
import axios from 'axios'
import { Octokit } from '@octokit/rest'

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
})

/**
 * Fetch the latest WordPress minor version.
 */
export async function getLatestWpVersion(): Promise<string> {
  try {
    const response = await axios.get(
      'https://api.wordpress.org/core/version-check/1.7/'
    )
    const latestVersion = response.data?.offers?.[0]?.current
    const latestMinor = latestVersion.match(/^\d+\.\d+/)?.[0]
    if (!latestMinor) {
      throw new Error('Failed to parse latest WordPress version')
    }
    console.log('Latest WordPress minor version:', latestMinor)
    return latestMinor
  } catch (error) {
    console.error('Failed to fetch latest WordPress version:', error)
    throw error
  }
}

/**
 * Update the 'Tested up to' version in the specified files.
 */
export async function updateFiles(
  basePath: string,
  filePaths: string[],
  newWpVersion: string
): Promise<boolean> {
  console.log(`Checking paths: ${filePaths}`)
  let updated = false
  for (const relativePath of filePaths) {
    const filePath = path.resolve(basePath, relativePath)
    const content = await fs.promises.readFile(filePath, 'utf8')

    // Update 'Tested up to' accounting for whitespace
    const newContent = content.replace(
      /(Tested up to:\s+)\S+/g,
      `$1${newWpVersion}`
    )

    if (newContent !== content) {
      console.log(`Updating file: ${relativePath}`)
      await fs.promises.writeFile(filePath, newContent)
      updated = true
    }
  }
  return updated
}

/**
 * Fetch the default branch for the repository.
 */
async function getDefaultBranch(owner: string, repo: string): Promise<string> {
  const { data } = await octokit.rest.repos.get({
    owner,
    repo
  })
  return data.default_branch
}

/**
 * Create a pull request for the changes.
 */
export async function createPullRequest(
  branchName: string,
  wpVersion: string
): Promise<void> {
  const title = `Update WordPress 'Tested up to' version to ${wpVersion}`
  const body = `This PR updates the 'Tested up to' version of the plugin to ${wpVersion}.`
  const [owner, repo] = (process.env.GITHUB_REPOSITORY || '').split('/')

  if (!owner || !repo) {
    console.error('GitHub repository owner or name is undefined.')
    throw new Error('GitHub repository owner or name is undefined.')
  }

  const baseBranch = await getDefaultBranch(owner, repo)
  console.log(
    `Owner: ${owner}, Repo: ${repo}, Branch: ${branchName}, Base: ${baseBranch}`
  )

  try {
    console.log('Creating Pull Request...')
    const { data } = await octokit.rest.pulls.create({
      owner,
      repo,
      title,
      head: branchName,
      base: baseBranch,
      body,
      draft: false
    })
    console.log(`Created Pull Request: ${data.html_url}`)
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Failed to create Pull Request: ${error.message}`)
      throw new Error(`Failed to create Pull Request: ${error.message}`)
    } else {
      console.error('An unexpected error occurred')
      throw new Error('An unexpected error occurred')
    }
  }
}
