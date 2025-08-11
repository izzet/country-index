### country-index

Structured, typed metadata for countries with ISO-3166 alpha-2 codes, international dial codes, regions, and optional area codes. Published as a minimal TypeScript package with tests.

## Install

```bash
npm install country-index
```

## Usage

```ts
import {
  countries, // base country list (no area-code entries)
  countriesByIso2, // canonical dictionary by iso2
  // utils are all pure and operate on provided arrays
  expandAreaCodes,
  deleteAreaCodes,
  filterRegions,
  getOnlyCountries,
  excludeCountries,
  pickPreferredCountries,
  guessSelectedCountry,
} from 'country-index';

// Base list (no area-code entries)
console.log(countries.length);

// Include synthesized area-code entries when you need them
const withAreas = expandAreaCodes(countries);

// Filter by regions
const eu = filterRegions(['europe', 'european-union'], countries);

// Only/exclude
const only = getOnlyCountries(['us', 'gb', 'ca'], countries);
const final = excludeCountries(only, ['ca']);

// Guess country from phone input (prefers longest matching dial code)
const guessed = guessSelectedCountry('1205', withAreas, 'gb');
console.log(guessed?.iso2); // 'us'
```

## API

- Data
  - `countries: Country[]` — base entries only (no area-code entries)
  - `countriesByIso2: Record<string, Country>` — canonical dictionary
- Utils (all pure, no globals)
  - `expandAreaCodes(base: Country[]): Country[]`
  - `deleteAreaCodes(list: Country[]): Country[]`
  - `filterRegions(regions: RegionTag[], list: Country[]): Country[]`
  - `getOnlyCountries(iso2s: string[] | undefined, list: Country[]): Country[]`
  - `excludeCountries(list: Country[], excludeIso2s: string[] | undefined): Country[]`
  - `pickPreferredCountries(list: Country[], preferredIso2s: string[] | undefined): Country[]`
  - `guessSelectedCountry(inputDigits: string, list: Country[], defaultIso2?: string): Country | undefined`

## Types

```ts
export type RegionTag =
  | 'america'
  | 'europe'
  | 'asia'
  | 'oceania'
  | 'africa'
  | 'north-america'
  | 'south-america'
  | 'central-america'
  | 'carribean'
  | 'european-union'
  | 'ex-ussr'
  | 'middle-east'
  | 'north-africa';

export interface Country {
  name: string;
  regions: RegionTag[];
  iso2: string;
  dialCode: string;
  format?: string;
  priority?: number;
  areaCodes?: string[];
  isAreaCode?: boolean;
}
```

## Development

- Scripts: `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`
- CI: GitHub Actions tests on Node 18, 20 and 22
- Releases: publish on GitHub Release (set `NPM_TOKEN` secret), with npm provenance and version validation

## License

MIT
