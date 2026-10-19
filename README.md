# Élan Fragrance Finder

A static fictional fragrance discovery experience. React 19, TypeScript 5, Vite 6 and Motion for React. No backend or runtime Python.

Use the existing Node 22.11 (Node 22 line), npm and Python 3.13. Python is used only for offline catalog validation. No Node binary is a project dependency.

```sh
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements-data.txt
npm ci
python scripts/prepare_catalog.py --input data/fragrances.csv --taxonomy data/taxonomy.json --output src/data/catalog.json
npm run dev
```

Validation:

```sh
python -m unittest discover -s tests/data
python scripts/prepare_catalog.py --input data/fragrances.csv --taxonomy data/taxonomy.json --output src/data/catalog.json --check
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Vercel uses `npm run build` and serves `dist`; it consumes the checked-in generated catalog. CI, rather than the hosting build, verifies data freshness. See `specs/001-fragrance-discovery/` for contracts and retained validation evidence.
