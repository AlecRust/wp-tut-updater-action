<!-- markdownlint-disable -->

# WordPress "Tested up to" Updater [![Lint](https://github.com/AlecRust/wp-tut-updater-action/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter) ![CI](https://github.com/AlecRust/wp-tut-updater-action/actions/workflows/ci.yml/badge.svg) [![CodeQL](https://github.com/AlecRust/wp-tut-updater-action/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/AlecRust/wp-tut-updater-action/actions/workflows/codeql-analysis.yml)

<!-- markdownlint-enable -->

> Automate "Tested up to" version updates in your WordPress projects.

[GitHub Action](https://github.com/features/actions) that fetches the latest
WordPress version then updates the "Tested up to" version of your WordPress
plugin or theme if it's out of date.

Run it based on a cron or manually via the Actions tab. Have the action create a
pull request, or allow it to commit directly to your default branch.

Never forget to update the "Tested up to" version of your WordPress plugin or
theme again!

## Example

First enable the "Allow GitHub Actions to create and approve pull requests"
option in your repository at **Settings > Actions > General**.

Below is a minimal example of running the action based on a cron. `permissions`
and `env.GITHUB_TOKEN` are required for the action to create a pull request.

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
  update-tested-up-to:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Update "Tested up to" version
        uses: AlecRust/wp-tut-updater-action@v1.0.0
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**Note:** No need to create a new `GITHUB_TOKEN` secret, just ensure it's set as
provided in the example.

Optionally you can specify paths to update which will override the default
`readme.txt` file:

```yaml
- name: Update "Tested up to" version
  uses: AlecRust/wp-tut-updater-action@v1.0.0
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  with:
    file-paths: |
      readme.txt
      my-other-file.php
```

Optionally the action can commit directly to your default branch by setting
`create-pr` to `false`:

```yaml
- name: Update "Tested up to" version
  uses: AlecRust/wp-tut-updater-action@v1.0.0
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  with:
    create-pr: false
```

Please note you should thoroughly test your plugin/theme with the new version of
WordPress before publishing an updated "Tested up to" version.

## License

The scripts and documentation in this project are released under the
[MIT License](LICENSE)
