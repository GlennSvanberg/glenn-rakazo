# Fiwe brand

This folder is the branding layer for the Fiwe fork of [Rakazo](https://github.com/elie222/rakazo) (Apache-2.0). Package names (`@rakazo/*`) and `RAKAZO_*` environment variables stay as they are upstream. The customer-facing product name, colors, font, marks, and the rakazo avatar figure are applied by a script so a later upstream sync does not depend on re-doing the brand by hand.

`brand.json` holds the product name. The palette, avatar paths, and file targets live in `apply-brand.mjs`. Official wordmarks are in `assets/wordmarks/` and must not be recolored. Rethink Sans (OFL) is in `assets/fonts/`.

The script edits the tree in place and is safe to run again. Commit the result. The branded tree builds without a pre-step, and the diff shows what customers get. Re-running after an upstream merge puts the brand back on top of new upstream code.

## Update from upstream

```bash
git fetch upstream
git merge upstream/main
```

When a branded file conflicts, keep the upstream side for that file (`git checkout --theirs -- path`), finish the merge, then:

```bash
node fiwe/apply-brand.mjs
```

Review the script's warnings. It prints any token key it no longer recognizes. Then run the unit tests and commit.

Do not run `pnpm --filter @rakazo/ui-tokens export:brand` after this. That command rebuilds icons from the old portrait offset. `apply-brand.mjs` writes the icon files itself.

## What the script changes

- Semantic colors in `packages/ui-tokens` (web and mobile) and regenerates `tokens.css`
- Rethink Sans on web, Electron, and the marketing site, with Arial as the fallback
- Wordmarks, the F-mark favicon, and the app icons
- The visible product name in the web app, emails, API messages a person can read, and (best effort) desktop, mobile, and the marketing site
- Bot avatar colors and the rakazo avatar's body and hand paths

`LICENSE` and copyright notices are left untouched. The avatar set id stays `rakazo` so the animation code does not grow a new enum.
