# WordPress "Tested up to" Updater Action

[![GitHub Super-Linter](https://github.com/actions/typescript-action/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/actions/typescript-action/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/actions/typescript-action/actions/workflows/check-dist.yml/badge.svg)](https://github.com/actions/typescript-action/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/actions/typescript-action/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/actions/typescript-action/actions/workflows/codeql-analysis.yml)

Creates a pull request to update the "Tested up to" version of your WordPress
plugin or theme if it's out of date.

## Example

First, enable the "Allow GitHub Actions to create and approve pull requests"
option in your repository at **Settings > Actions > General**.

Here's a basic example of running this action on a cron. `permissions` and
`env.GITHUB_TOKEN` are required for the action to create a pull request.

`.github/workflows/tut-check.yml`:

```yaml
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
        uses: AlecRust/wp-tut-updater-action@v1.0.0
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**Note:** No need to create a new `GITHUB_TOKEN` secret, just ensure it's set as
provided in the example.

Optionally, you can specify paths to update which will override the default
`readme.txt` file:

```yaml
- name: Run wp-tut-updater-action
  uses: AlecRust/wp-tut-updater-action@v1.0.0
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  with:
    file-paths: |
      readme.txt
      my-other-file.php
```

Please note you should thoroughly test your plugin/theme with the new version of
WordPress before publishing an updated "Tested up to" version.

## License

The scripts and documentation in this project are released under the
[MIT License](LICENSE)
