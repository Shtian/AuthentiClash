# Git Workflow & Releases

## Commits & PRs

- Prefer Conventional Commit prefixes (`feat:`, `fix:`, `chore:`, `style:`). Example: `feat: add Diceblade class`.
- PRs must include a concise summary, linked issue (when applicable), and UI screenshots/GIFs for visual changes.
- Before opening a PR, ensure `pnpm lint`, `pnpm check`, and `pnpm build` pass locally.

## Continuous Integration

- `.github/workflows/build.yaml` installs dependencies, then runs `pnpm lint`, `pnpm check`, and `pnpm build` on every push.

## Releases & Changesets

- `.github/workflows/release.yaml` promotes builds after CI on `main`; Changesets manages version bumps and publishing.
- For any user-visible change:
  1.  Run `pnpm dlx changeset` (or `pnpm changeset` if installed globally).
  2.  Choose the package bump, write a concise summary, and commit the generated `.changeset/*.md`.
  3.  CI handles `pnpm changeset:version` and `pnpm changeset:release` downstream.
