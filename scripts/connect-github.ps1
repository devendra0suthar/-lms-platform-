# Connect this project to GitHub - run in project root where Git is installed.
# Usage: .\scripts\connect-github.ps1
#        .\scripts\connect-github.ps1 -GitHubUsername "your-username" -RepoName "lms-platform"

param(
    [string]$GitHubUsername = "",
    [string]$RepoName = "lms-platform"
)

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
Set-Location $projectRoot

# Check Git
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "Git is not installed or not in PATH. Install from https://git-scm.com/download/win" -ForegroundColor Red
    exit 1
}

# 1. Init (idempotent)
if (-not (Test-Path ".git")) {
    git init
    Write-Host "Initialized git repository." -ForegroundColor Green
} else {
    Write-Host "Git already initialized." -ForegroundColor Yellow
}

# 2. Stage and commit (only if there are changes or no commits)
$status = git status --porcelain
$hasCommits = git rev-parse HEAD 2>$null
if ($status -or -not $hasCommits) {
    git add .
    git commit -m "Initial commit: LMS platform"
    Write-Host "Created initial commit." -ForegroundColor Green
} else {
    Write-Host "Nothing to commit (working tree clean)." -ForegroundColor Yellow
}

# 3. Remote and push (need username)
if (-not $GitHubUsername) {
    $GitHubUsername = Read-Host "Enter your GitHub username"
}
if (-not $GitHubUsername) {
    Write-Host "No username provided. Add remote and push manually:" -ForegroundColor Yellow
    Write-Host "  1. Create repo at https://github.com/new (name: $RepoName, do not add README/.gitignore)" -ForegroundColor Cyan
    Write-Host "  2. git remote add origin https://github.com/YOUR_USERNAME/$RepoName.git" -ForegroundColor Cyan
    Write-Host "  3. git branch -M main" -ForegroundColor Cyan
    Write-Host "  4. git push -u origin main" -ForegroundColor Cyan
    exit 0
}

$remoteUrl = "https://github.com/$GitHubUsername/$RepoName.git"
$existing = git remote get-url origin 2>$null
if ($existing) {
    if ($existing -ne $remoteUrl) {
        git remote set-url origin $remoteUrl
        Write-Host "Updated remote origin to $remoteUrl" -ForegroundColor Green
    }
} else {
    git remote add origin $remoteUrl
    Write-Host "Added remote origin: $remoteUrl" -ForegroundColor Green
}

git branch -M main
Write-Host "Pushing to GitHub (you may be prompted for credentials)..." -ForegroundColor Cyan
git push -u origin main
Write-Host "Done. Project is connected to GitHub." -ForegroundColor Green
