# WordPress "Tested up to" Updater Action

[![GitHub Super-Linter](https://github.com/actions/typescript-action/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/actions/typescript-action/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/actions/typescript-action/actions/workflows/check-dist.yml/badge.svg)](https://github.com/actions/typescript-action/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/actions/typescript-action/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/actions/typescript-action/actions/workflows/codeql-analysis.yml)

Creates a pull request to update the "Tested up to" version of your WordPress
plugin or theme if it's out of date.

## Usage

First, enable the "Allow GitHub Actions to create and approve pull requests"
option in your repository settings at **Actions > General**.

Here's a basic example of running this action on a cron. Note that `permissions`
and `env.GITHUB_TOKEN` are required for the action to create a pull request.

**Note:** You shouldn't need to create a new `GITHUB_TOKEN` secret, just ensure
it's set as provided in the example below.

`.github/workflows/weekly-tut-check.yml`:

```yaml
name: Weekly "Tested up to" check

on:
  schedule:
    - cron: '0 0 * * 0' # Every Sunday at midnight
  workflow_dispatch:

permissions:
  contents: write
  pull-requests: write

jobs:
  tut-check:
    name: Check for new "Tested up to" version
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run wp-tut-updater-action
        uses: AlecRust/wp-tut-updater-action@main
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

Optionally, you can specify paths to update which will override the default
`readme.txt` file:

```yaml
- name: Run wp-tut-updater-action
  uses: AlecRust/wp-tut-updater-action@main
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  with:
    file-paths: |
      readme.txt
      my-other-file.php
```

## License

The scripts and documentation in this project are released under the
[MIT License](LICENSE)
