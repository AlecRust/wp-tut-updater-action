# WordPress "Tested up to" Updater

<!-- markdownlint-disable -->

[![Lint](https://github.com/AlecRust/wp-tut-updater-action/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/AlecRust/wp-tut-updater-action/actions/workflows/ci.yml/badge.svg)
[![CodeQL](https://github.com/AlecRust/wp-tut-updater-action/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/AlecRust/wp-tut-updater-action/actions/workflows/codeql-analysis.yml)
[![Check Transpiled JS](https://github.com/actions/typescript-action/actions/workflows/check-dist.yml/badge.svg)](https://github.com/actions/typescript-action/actions/workflows/check-dist.yml)

<!-- markdownlint-enable -->

This [GitHub Action](https://github.com/features/actions) updates the "Tested up
to" version in WordPress plugins or themes if it doesn't match the latest
version of WordPress.

It can create a pull request for the change, or commit directly to the default
branch. Never forget to update your "Tested up to" version again!

## Example

Here's a minimal example running the action based on a cron schedule. It will
create a pull request by default.

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
        uses: AlecRust/wp-tut-updater-action@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

Please note:

- `permissions` section is always required in your workflow for the action to
  write to the repository
- "Allow GitHub Actions to create and approve pull requests" setting is required
  to create pull requests
- The pull request author is set by `GITHUB_TOKEN` which unless overridden will
  be the GitHub Actions bot user

## Usage

See [action.yml](action.yml) for detailed information on the action's inputs.

```yaml
- uses: AlecRust/wp-tut-updater-action@v1
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

Remember to test your project with the latest version of WordPress before
publishing a new version!

## License

The scripts and documentation in this project are released under the
[MIT License](LICENSE)
