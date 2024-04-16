<!-- markdownlint-disable -->

# WordPress "Tested up to" Updater [![Lint](https://github.com/AlecRust/wp-tut-updater-action/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter) ![CI](https://github.com/AlecRust/wp-tut-updater-action/actions/workflows/ci.yml/badge.svg) [![CodeQL](https://github.com/AlecRust/wp-tut-updater-action/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/AlecRust/wp-tut-updater-action/actions/workflows/codeql-analysis.yml)

<!-- markdownlint-enable -->

> Automate "Tested up to" version updates in your WordPress projects.

This [GitHub Action](https://github.com/features/actions) fetches the latest
WordPress version then updates the "Tested up to" version of your WordPress
plugin or theme if it's out of date.

The action can create a pull request for the change, or commit directly to the
default branch. Never forget to update the "Tested up to" version of your
WordPress plugin or theme again!

## Example

Here's a minimal example of running the action based on a cron schedule.

`.github/workflows/tut-check.yml`:

```yaml
on:
  schedule:
    - cron: '0 0 * * 0'
  workflow_dispatch:

permissions:
  contents: write
  pull-requests: write

jobs:
  update-tested-up-to:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Update "Tested up to" version
        uses: AlecRust/wp-tut-updater-action@v1.1.1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**Note:** `permissions`, `env.GITHUB_TOKEN` and the "Allow GitHub Actions to
create and approve pull requests" repository option are required for the action
to create pull requests.

## Usage

See [action.yml](action.yml) for detailed information on the action's inputs.

```yaml
- uses: AlecRust/wp-tut-updater-action@v1.1.1
  with:
    # Paths to update (optional, default: readme.txt)
    file-paths: |
      readme.txt
      src/other-file.php
    # Create a pull request, or commit directly if disabled (optional, default: true)
    create-pr: true
    # Git author (optional, default: github-actions <github-actions@noreply.github.com>)
    git-author: 'Joe Bloggs <joe.bloggs@example.com>'
```

Please remember to thoroughly test your plugin/theme with the new version of
WordPress before publishing an updated "Tested up to" version.

## License

The scripts and documentation in this project are released under the
[MIT License](LICENSE)
