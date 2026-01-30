# Connect This Project to GitHub

Follow these steps to connect your LMS platform to GitHub.

## One-command setup (recommended)

After installing Git, open a terminal **in this project folder** and run:

```powershell
.\scripts\connect-github.ps1
```

The script will prompt for your GitHub username, then init, commit, add the remote, and push. Create the repo on GitHub first at https://github.com/new (name: `lms-platform`, leave "Add README" unchecked).

With username in the command:

```powershell
.\scripts\connect-github.ps1 -GitHubUsername "your-username" -RepoName "lms-platform"
```

---

## Manual steps

### Prerequisites

1. **Install Git** (if not already installed):
   - Download: https://git-scm.com/download/win
   - Or install via winget: `winget install Git.Git`
   - Restart your terminal/IDE after installing.

2. **Create a GitHub account** at https://github.com (if you don’t have one).

---

## Step 1: Initialize Git (first time only)

Open a terminal in this project folder and run:

```bash
git init
```

## Step 2: Stage and commit your code

```bash
git add .
git commit -m "Initial commit: LMS platform"
```

## Step 3: Create a new repository on GitHub

1. Go to https://github.com/new
2. Set **Repository name** (e.g. `lms-platform`)
3. Choose **Public** or **Private**
4. **Do not** check "Add a README" or ".gitignore" (this project already has them)
5. Click **Create repository**

## Step 4: Add GitHub as remote and push

Replace `YOUR_USERNAME` with your GitHub username and `lms-platform` with your repo name if different:

```bash
git remote add origin https://github.com/YOUR_USERNAME/lms-platform.git
git branch -M main
git push -u origin main
```

If GitHub prompts for credentials, use a **Personal Access Token** (not your password):
- GitHub → Settings → Developer settings → Personal access tokens → Generate new token
- Give it `repo` scope and use it as the password when pushing.

---

## Using SSH instead of HTTPS

If you use SSH keys with GitHub:

```bash
git remote add origin git@github.com:YOUR_USERNAME/lms-platform.git
git branch -M main
git push -u origin main
```

---

## Quick reference after setup

- **Push changes:** `git add .` → `git commit -m "Your message"` → `git push`
- **Pull updates:** `git pull`
- **Check remote:** `git remote -v`
