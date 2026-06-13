# Publishing, Hosting & Versioning Guide

This document covers the full lifecycle: local → GitHub → published package → consumed in real projects.

---

## Option A: Publish to npm (recommended for open source / shared teams)

npm is the default registry. Anyone with npm can install your package.

### 1. Create an npm account and org

```bash
# Create account at npmjs.com, then:
npm login

# Create a scoped org (free for public packages)
# Your package name becomes @your-org/react-form-builder
# Do this at npmjs.com/org/create
```

### 2. Publish for the first time

```bash
# In the package directory:
npm run build          # builds dist/
npm publish --access public

# --access public is required for scoped packages on the free plan
# Remove it if the package is unscoped (no @org/ prefix)
```

### 3. Install in another project

```bash
npm install @your-org/react-form-builder
```

---

## Option B: Publish to GitHub Packages (recommended for private / org-internal use)

GitHub Packages hosts npm packages tied to your GitHub org.
Free for public repos. Private packages need a GitHub plan.

### 1. Update package.json name and publishConfig

```json
{
  "name": "@your-github-username/react-form-builder",
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  }
}
```

### 2. Authenticate once

```bash
# Create a Personal Access Token at github.com/settings/tokens
# Scopes needed: write:packages, read:packages, delete:packages

npm login --registry=https://npm.pkg.github.com
# Username: your-github-username
# Password: your-PAT
# Email: your@email.com
```

### 3. Publish

```bash
npm run build
npm publish
```

### 4. Install in another project — consumer setup required

Consumers must tell npm where to find @your-org packages.
They add this to their project's .npmrc:

```
@your-github-username:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=THEIR_PAT_WITH_READ_PACKAGES
```

Then:

```bash
npm install @your-github-username/react-form-builder
```

---

## Option C: Install directly from GitHub (no publish step — good for early development)

No publishing needed. npm installs straight from the git repo.

```bash
# From the default branch
npm install github:your-org/react-form-builder

# From a specific branch
npm install github:your-org/react-form-builder#develop

# From a specific tag / release
npm install github:your-org/react-form-builder#v0.2.0

# From a specific commit
npm install github:your-org/react-form-builder#abc1234
```

The package.json entry will look like:
```json
"dependencies": {
  "@your-org/react-form-builder": "github:your-org/react-form-builder#v0.2.0"
}
```

**Caveat:** GitHub installs run the `prepare` script, not `prepublishOnly`.
Add a `prepare` script that runs the build so consumers get compiled output:

```json
"scripts": {
  "prepare": "npm run build"
}
```

---

## Setting up the GitHub repository

```bash
# 1. Create repo on github.com (or via CLI)
gh repo create your-org/react-form-builder --public

# 2. Init and push
cd react-form-builder
git init
git add .
git commit -m "feat: initial release v0.1.0"
git branch -M main
git remote add origin https://github.com/your-org/react-form-builder.git
git push -u origin main
```

### Branch strategy

```
main       ← stable, always releasable. Tags are cut here.
develop    ← integration branch for features
feat/*     ← feature branches, PR into develop
fix/*      ← bug fixes, PR into develop (or main for hotfixes)
```

---

## Versioning — Semantic Versioning (SemVer)

Format: `MAJOR.MINOR.PATCH`  →  `1.4.2`

| Increment | When | Example |
|---|---|---|
| `PATCH` | Bug fix, no API change | `0.1.0` → `0.1.1` |
| `MINOR` | New feature, backward compatible | `0.1.1` → `0.2.0` |
| `MAJOR` | Breaking change | `0.9.0` → `1.0.0` |

### How to release a new version

```bash
# 1. Update CHANGELOG.md — move items from [Unreleased] to a new [X.Y.Z] section

# 2. Bump version, create git tag, push — all in one command:
npm run release:patch   # 0.1.0 → 0.1.1
npm run release:minor   # 0.1.1 → 0.2.0
npm run release:major   # 0.2.0 → 1.0.0

# These scripts run: npm version X && git push --follow-tags
# npm version automatically:
#   - updates package.json version
#   - commits the change
#   - creates a git tag (v0.1.1)

# 3. The GitHub Actions release.yml workflow fires on the tag push and:
#   - runs tests
#   - builds dist/
#   - publishes to npm and/or GitHub Packages
#   - creates a GitHub Release with the CHANGELOG section as notes
```

### Manual release (without CI)

```bash
npm version patch              # bumps + tags
npm run build                  # builds dist/
npm publish --access public    # pushes to registry
git push --follow-tags         # pushes tag to GitHub
```

---

## Consuming the package in a real project

### Basic usage

```tsx
// 1. Install
// npm install @your-org/react-form-builder

// 2. Import CSS once (e.g. in main.tsx or App.tsx)
import '@your-org/react-form-builder/dist/form.css';

// 3. Use
import { Form } from '@your-org/react-form-builder';
import type { FormLayout, FieldConfigMap } from '@your-org/react-form-builder';

const layout: FormLayout = {
  sections: [{
    id: 'contact',
    rows: [['name', 'email'], ['message']],
  }],
};

const fields: FieldConfigMap = {
  name:    { id: 'name',    type: 'text',     name: 'name',    label: 'Name',    validation: [{ rule: 'required' }] },
  email:   { id: 'email',   type: 'email',    name: 'email',   label: 'Email',   validation: [{ rule: 'required' }, { rule: 'email' }] },
  message: { id: 'message', type: 'textarea', name: 'message', label: 'Message', validation: [{ rule: 'required' }] },
};

export function ContactForm() {
  return (
    <Form layout={layout} fieldConfigMap={fields} onSubmit={console.log}>
      <button type="submit">Send</button>
    </Form>
  );
}
```

### Version pinning strategy in consuming projects

```json
// package.json of consuming project

// Exact version (safest for production — you control upgrades manually):
"@your-org/react-form-builder": "0.2.1"

// Patch updates only (safe — bug fixes only):
"@your-org/react-form-builder": "~0.2.1"

// Minor updates (new features, no breaking changes):
"@your-org/react-form-builder": "^0.2.1"

// Specific git tag (no registry needed):
"@your-org/react-form-builder": "github:your-org/react-form-builder#v0.2.1"
```

---

## Setting up the npm secret in GitHub Actions

The release workflow publishes automatically when you push a tag.
It needs your npm token:

```
GitHub repo → Settings → Secrets and variables → Actions
→ New repository secret
  Name:  NPM_TOKEN
  Value: (your npm access token from npmjs.com/settings/tokens)
```

For GitHub Packages publishing, no extra secret is needed —
`GITHUB_TOKEN` is automatically available in every workflow.

---

## Updating the package in consuming projects

```bash
# Check what's outdated
npm outdated

# Update to latest within your version range
npm update @your-org/react-form-builder

# Update to a specific version (ignoring range)
npm install @your-org/react-form-builder@0.3.0

# Check for breaking changes first!
# Read the CHANGELOG.md for the versions you're crossing
```

---

## Local development workflow (linking before publishing)

When you're developing the package and a consuming app at the same time,
use `npm link` to avoid publish/install cycles:

```bash
# In the package repo:
npm run build
npm link

# In the consuming project:
npm link @your-org/react-form-builder

# Now changes to the package (after npm run build) are immediately
# reflected in the consuming project without publishing.

# When done:
npm unlink @your-org/react-form-builder   # in consuming project
npm unlink                                # in package repo
```

Alternative using npm workspaces (if both live in the same monorepo):

```json
// root package.json
{
  "workspaces": [
    "packages/react-form-builder",
    "apps/my-app"
  ]
}
```

Then `npm install` at the root automatically links the package into the app.

---

## Summary: which option to choose

| Situation | Use |
|---|---|
| Open source, anyone can use it | npm with `--access public` |
| Private, only your org | GitHub Packages |
| Early dev, no versioning yet | `github:org/repo#branch` |
| Monorepo with multiple apps | npm workspaces |
| Testing locally before publish | `npm link` |
