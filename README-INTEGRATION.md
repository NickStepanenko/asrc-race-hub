Integration guide (monorepo workspaces)

This project now contains two workspace packages under `packages/`:
- `@asrc/spotter-generation` (packages/asrc-spotter-generation)
- `@asrc/steward-tools` (packages/asrc-steward-tools)

Quick start (PowerShell):

```powershell
# from project root
npm install
# start dev server
npm run dev
```

Notes and next steps:
- Each package currently has a minimal `src/index.tsx` export. Replace with your real components and server utilities.
- Ensure each package has a proper `package.json` and build script when you want to produce a `dist/` build.
- If packages use Prisma, place a single `prisma/schema.prisma` in the root and share the `DATABASE_URL` env var across packages. Each package should use the same Prisma client setup or import a shared client.
- For server-side code in the packages, export server functions and import them into Next API routes (see `app/api/spotter/route.ts`).

Sharing Prisma/client:
- Recommended: create a small package `packages/db-client` that exports a singleton Prisma client instance used by all packages and Next app.

If you want, I can:
- Add a `packages/db-client` with a Prisma client wrapper and example usage, and wire the two packages to use it.
- Replace the local `src` imports with proper package entry points (after you add build output).
- Convert the packages to full TypeScript build targets with `tsconfig.json` and `dist/` output.
