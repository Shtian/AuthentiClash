# Testing

## Unit (Vitest)
- Place `*.spec.ts` next to the code under test (e.g., `src/lib/utils/dateUtils.spec.ts`).
- Run `pnpm test:unit` for a fast local signal; `pnpm test` includes these plus Playwright.

## Integration/E2E (Playwright)
- Specs live under `tests/` and run with `pnpm test:integration`.
- Use `pnpm test` before merging if you touched user flows or Supabase interactions.

## Coverage Expectations
- Focus on utilities, server loaders, and any critical gameplay flows; write regression tests whenever fixing bugs there.
