# Inject file action

<!-- auto-test -->

[![tests](https://github.com/olivr-com/inject-file-action/workflows/tests/badge.svg)](https://github.com/olivr-com/inject-file-action/actions?query=workflow%3Atests)

<!-- auto-test -->

GitHub action to inject the content of a remote file into a file of your repo.

We use this action to maintain an organization-wide central repo with common sections of a README.md (about our company, license, contributing, etc.). Other repos sync with the latest versions of those sections every time they're built.

## Usage

### Simple example

It will look for **two occurences** of `<!-- auto-about -->` in the file `README.md` and inject the content of `https://test.com/about.md` between these two occurences. If this action can't find these occurences, it will inject the content at the end of the `README.md` file.

```yaml
uses: olivr-com/inject-file-action@v1
with:
  url: https://test.com/about.md
  target: README.md
```

> `<!-- auto-about -->` is used because the file being pulled is called _**about**.md_

### Complete example

It will look for **two occurences** of `<!-- generate-about-section -->` in the file `README.md` and inject the content of `https://test.com/about.md` between these two occurences. If this action can't find them, it will **not** inject anything.

```yaml
uses: olivr-com/inject-file-action@v1
with:
  url: https://test.com/about.md
  target: README.md
  pattern: <!-- generate-about-section -->
  force: false
```

## Contribute

Checkout the v1 branch

Install the dependencies

```bash
npm install
```

Run the tests

```bash
npm test
```

### Package for distribution

GitHub Actions will run the entry point from the action.yml. Packaging assembles the code into one file that can be checked in to Git, enabling fast and reliable execution and preventing the need to check in node_modules.

Actions are run from GitHub repos. Packaging the action will create a packaged action in the dist folder.

Run package

```bash
npm run package
```

Since the packaged index.js is run from the dist folder.

```bash
git add dist
```
