# ChatBit

Real-time customer support application for Souq Express.

## Team

- **Chaimae** — Frontend / Mobile (`/mobile`)
- **Khalid** — Backend (`/backend`)

---

## Repository Structure

```text
chatbit-support/
├── backend/      # Backend API, Socket.IO server, and database layer
├── mobile/       # React Native / Expo mobile application
├── docs/         # Project documentation and architecture specs
├── .github/      # GitHub configuration and templates
├── .gitignore    # Ignore rules for Node.js, Expo, React Native & env files
└── README.md     # Project overview and Git workflow documentation
```

---

## Git Branches & Responsibilities

| Branch | Description & Purpose |
| :--- | :--- |
| **`main`** | **Default branch**. Reserved strictly for final stable versions and production demonstrations. No direct commits allowed. |
| **`develop`** | **Primary integration branch**. Used for merging completed feature branches, testing multi-device flows, and bug fixes. |
| **`workflow`** | **Documentation branch**. Contains the team development workflow, branch lifecycle, conventions, and collaboration rules. |
| **`feature/*`** | **Task branches**. Created from `develop` for individual Jira tasks (`feature/CHAT-XX-description`). |

---

## Branch Workflow

```text
main (Default / Production release)
  ↑
develop (Merge features & fix bugs)
  ↑
feature/CHAT-XX-task-name (Work on Jira task)
```

### Daily Development Lifecycle

1. **Update `develop` before starting:**
   ```bash
   git checkout develop
   git pull origin develop
   ```

2. **Create a dedicated feature branch from `develop`:**
   ```bash
   git checkout -b feature/CHAT-XX-short-description
   ```

3. **Develop & commit following Conventional Commits:**
   ```bash
   git add .
   git commit -m "feat: implement login screen"
   ```

4. **Push feature branch to remote:**
   ```bash
   git push -u origin feature/CHAT-XX-short-description
   ```

5. **Open Pull Request into `develop`:**
   - Target branch: `develop`
   - Peer review by teammate (Chaimae / Khalid)
   - Once approved, merge into `develop` and delete the feature branch.

6. **Bug Fixing & Integration on `develop`:**
   - All integration testing and bug fixes happen on `develop`.
   - Bugfix branches use format: `fix/CHAT-XX-bug-description` or `feature/CHAT-XX-bug-description` &rarr; PR into `develop`.

7. **Final Release to `main`:**
   - When all Jira tasks and integration tests are verified:
   ```text
   develop  ──(Pull Request / Merge)──>  main
   ```

---

## Branch Naming Rules

Always prefix with the Jira issue key:

```text
feature/CHAT-XX-short-description
```

### Examples:
- `feature/CHAT-01-backend-setup`
- `feature/CHAT-02-mobile-setup`
- `feature/CHAT-04-auth-api`
- `feature/CHAT-05-login-screen`
- `feature/CHAT-16-socket-server`

---

## Commit Conventions

Use simple [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature implementation (e.g. `feat: add login screen`)
- `fix:` Bug fix (e.g. `fix: handle expired token validation`)
- `docs:` Documentation updates (e.g. `docs: update workflow guide`)
- `test:` Adding or updating tests (e.g. `test: add auth unit tests`)
- `chore:` Configuration, dependencies, or maintenance (e.g. `chore: update dependencies`)

---

## Important Rules

1. **Never commit directly to `main` or `develop`.**
2. **One Jira task = One feature branch.**
3. **Always open Pull Requests targeting `develop`.**
4. **Pull latest `develop` before creating any new feature branch.**
5. **Keep commits atomic, focused, and descriptive.**
