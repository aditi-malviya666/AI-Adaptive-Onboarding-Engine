# 📘 Complete Git Command Reference

---

## 🔧 1. First-Time Setup (Run Once on Your Machine)

| Command | Description |
|---|---|
| `git config --global user.name "Your Name"` | Set your name for all commits |
| `git config --global user.email "you@email.com"` | Set your email for all commits |
| `git config --list` | View all your git config settings |

---

## 🚀 2. Starting a Repository

| Command | Description |
|---|---|
| `git init` | Initialize a new git repo in current folder |
| `git clone <url>` | Copy a remote repo to your local machine |
| `git remote add origin <url>` | Link local repo to a remote GitHub repo |
| `git remote -v` | View the remote URLs linked to your repo |
| `git remote set-url origin <url>` | Change the remote URL (if already added) |

---

## 📋 3. Checking Status & History

| Command | Description |
|---|---|
| `git status` | Show changed/staged/untracked files |
| `git log` | Full commit history |
| `git log --oneline` | Compact one-line commit history |
| `git log --oneline --graph` | Visual branch history |
| `git diff` | Show unstaged changes |
| `git diff --staged` | Show staged (ready to commit) changes |

---

## ➕ 4. Staging & Committing

| Command | Description |
|---|---|
| `git add .` | Stage all changed files |
| `git add <filename>` | Stage one specific file |
| `git add *.py` | Stage all Python files |
| `git commit -m "message"` | Commit staged files with a message |
| `git commit -am "message"` | Stage tracked files + commit in one step |

---

## ☁️ 5. Pushing & Pulling (Solo Workflow)

| Command | Description |
|---|---|
| `git push -u origin main` | Push to GitHub for the first time (sets default) |
| `git push` | Push after the first time |
| `git pull` | Fetch + merge latest changes from GitHub |
| `git fetch` | Download changes but don't merge yet |

---

## 🌿 6. Branching (Core of Collaboration)

| Command | Description |
|---|---|
| `git branch` | List all local branches |
| `git branch -a` | List local + remote branches |
| `git branch <name>` | Create a new branch |
| `git switch <name>` | Switch to an existing branch |
| `git switch -c <name>` | Create AND switch to a new branch |
| `git branch -M main` | Rename current branch to `main` |
| `git branch -d <name>` | Delete a branch (safe — only if merged) |
| `git branch -D <name>` | Force delete a branch |
| `git push origin <name>` | Push a branch to GitHub |
| `git push origin --delete <name>` | Delete a remote branch |

> **Rule of thumb:** Never work directly on `main`. Always create a feature branch.

---

## 🤝 7. Collaborative Workflow (Team Projects)

### Standard Flow for Contributing

```
1. Clone the repo (first time only)
   git clone <repo-url>

2. Create a feature branch
   git switch -c feature/your-feature-name

3. Make your changes, then:
   git add .
   git commit -m "Add: describe what you did"

4. Push your branch to GitHub
   git push origin feature/your-feature-name

5. Open a Pull Request on GitHub (in browser)

6. After PR is merged, update your local main
   git switch main
   git pull
```

---

## 🔀 8. Merging

| Command | Description |
|---|---|
| `git merge <branch>` | Merge a branch into your current branch |
| `git merge --abort` | Cancel a merge if there are conflicts |

### Merge Conflict — What to do:
1. Run `git status` — it shows conflicted files
2. Open the file — you'll see conflict markers like:
```
<<<<<<< HEAD
your changes
=======
their changes
>>>>>>> feature-branch
```
3. Manually edit the file to keep what you want
4. Run `git add <file>` then `git commit`

---

## 📥 9. Pull Requests (PRs) — GitHub Feature

A **Pull Request** is how you propose your changes to a team's main codebase.

### How to Open a PR:
1. Push your feature branch: `git push origin feature/my-feature`
2. Go to the repo on **GitHub.com**
3. Click **"Compare & pull request"**
4. Add a title and description
5. Click **"Create Pull Request"**
6. Team members review → approve → merge

### PR Best Practices:
| Do ✅ | Don't ❌ |
|---|---|
| Write a clear PR title | Push directly to `main` |
| Describe what & why you changed | Open huge PRs with 50+ file changes |
| Keep PRs small and focused | Leave conflicts unresolved |
| Link related issues | Skip the description |

---

## ⏪ 10. Undoing Changes

| Command | Description |
|---|---|
| `git restore <file>` | Discard unstaged changes in a file |
| `git restore --staged <file>` | Unstage a file (keep changes) |
| `git revert <commit-id>` | Create a new commit that undoes a past commit (safe) |
| `git reset --soft HEAD~1` | Undo last commit, keep changes staged |
| `git reset --mixed HEAD~1` | Undo last commit, keep changes unstaged |
| `git reset --hard HEAD~1` | ⚠️ Undo last commit AND delete changes permanently |

> ⚠️ **Warning:** `--hard` is destructive. Avoid on shared branches.

---

## 🏷️ 11. Tags (Marking Releases)

| Command | Description |
|---|---|
| `git tag` | List all tags |
| `git tag v1.0` | Create a tag at current commit |
| `git push origin v1.0` | Push a tag to GitHub |

---

## 🧹 12. Stashing (Save Work Temporarily)

| Command | Description |
|---|---|
| `git stash` | Save uncommitted changes temporarily |
| `git stash list` | See all stashed work |
| `git stash pop` | Restore last stashed changes |
| `git stash drop` | Delete the last stash |

> **When to use:** When you need to switch branches but aren't ready to commit.

---

## ❌ Common Errors & Fixes

| Error | Cause | Fix |
|---|---|---|
| `remote origin already exists` | Remote was already added | `git remote set-url origin <url>` |
| `src refspec main does not match` | No commits exist yet | `git add .` then `git commit` first |
| `'st' is not a git command` | Typo — `git st` doesn't exist | Use `git status` |
| `rejected — non-fast-forward` | Remote has changes you don't have | `git pull` first, then `git push` |
| `CONFLICT (content)` | Two people edited the same line | Manually fix the file, then `git add` + `git commit` |

---

## 🗺️ Full Workflow Summary

```
Solo:      init → add → commit → push → pull

Team:      clone → branch → add → commit → push → PR → review → merge → pull
```
