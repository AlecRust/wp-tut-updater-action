<!-- markdownlint-disable -->

# WordPress "Tested up to" Updater [![Lint](https://github.com/AlecRust/wp-tut-updater-action/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter) ![CI](https://github.com/AlecRust/wp-tut-updater-action/actions/workflows/ci.yml/badge.svg) [![CodeQL](https://github.com/AlecRust/wp-tut-updater-action/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/AlecRust/wp-tut-updater-action/actions/workflows/codeql-analysis.yml)

<!-- markdownlint-enable -->

> Automate "Tested up to" version updates in your WordPress projects.

[GitHub Action](https://github.com/features/actions) that fetches the latest
WordPress version then updates the "Tested up to" version of your WordPress
plugin or theme if it's out of date.

Run it based on a cron or trigger it manually. Have the action create a pull
request, or allow it to commit directly to the default branch.

Never forget to update the "Tested up to" version of your WordPress plugin or
theme again!

## Example

Here's a minimal example of running the action based on a cron schedule.

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
        uses: AlecRust/wp-tut-updater-action@v1.1.1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**Note:** `permissions`, `env.GITHUB_TOKEN` and the "Allow GitHub Actions to
create and approve pull requests" repository option are required for the action
to create pull requests.

Optionally specify paths to update which will override the default `readme.txt`
file:

```yaml
- name: Update "Tested up to" version
  uses: AlecRust/wp-tut-updater-action@v1.1.1
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
  uses: AlecRust/wp-tut-updater-action@v1.1.1
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  with:
    create-pr: false
```

Please remember to thoroughly test your plugin/theme with the new version of
WordPress before publishing an updated "Tested up to" version.

## License

The scripts and documentation in this project are released under the
[MIT License](LICENSE)
