import { Country, RegionTag } from './types';

// Atomic, pure utilities that operate on provided data; no globals are used.

export function getCountryByIso2(countries: Country[], iso2: string): Country | undefined {
  const lower = iso2.toLowerCase();
  return countries.find((c) => !c.isAreaCode && c.iso2 === lower);
}

export function findCountriesByDialCode(countries: Country[], dialCode: string): Country[] {
  return countries.filter((c) => c.dialCode === dialCode);
}

export function expandAreaCodes(baseCountries: Country[]): Country[] {
  const result: Country[] = [];
  for (const base of baseCountries) {
    result.push(base);
    if (base.areaCodes && base.areaCodes.length > 0) {
      for (const areaCode of base.areaCodes) {
        result.push({
          name: base.name,
          regions: base.regions,
          iso2: base.iso2,
          dialCode: `${base.dialCode}${areaCode}`,
          format: base.format,
          isAreaCode: true,
        });
      }
    }
  }
  return result;
}

export function deleteAreaCodes(countries: Country[]): Country[] {
  return countries.filter((c) => !c.isAreaCode);
}

export function filterRegions(regions: RegionTag[], countries: Country[]): Country[] {
  if (!regions || regions.length === 0) return countries;
  const wanted = new Set(regions);
  return countries.filter((c) => c.regions.some((r) => wanted.has(r)));
}

export function getOnlyCountries(iso2List: string[] | undefined, countries: Country[]): Country[] {
  if (!iso2List || iso2List.length === 0) return countries;
  const wanted = new Set(iso2List.map((s) => s.toLowerCase()));
  return countries.filter((c) => wanted.has(c.iso2));
}

export function excludeCountries(countries: Country[], excludeIso2List: string[] | undefined): Country[] {
  if (!excludeIso2List || excludeIso2List.length === 0) return countries;
  const excluded = new Set(excludeIso2List.map((s) => s.toLowerCase()));
  return countries.filter((c) => !excluded.has(c.iso2));
}

export function pickPreferredCountries(countries: Country[], preferredIso2List: string[] | undefined): Country[] {
  if (!preferredIso2List || preferredIso2List.length === 0) return [];
  const preferred = new Set(preferredIso2List.map((s) => s.toLowerCase()));
  return countries.filter((c) => preferred.has(c.iso2));
}

export function guessSelectedCountry(
  inputDigits: string,
  countries: Country[],
  defaultIso2?: string,
): Country | undefined {
  const digits = inputDigits.replace(/\D/g, '');
  if (digits.length === 0) {
    return defaultIso2 ? countries.find((c) => !c.isAreaCode && c.iso2 === defaultIso2.toLowerCase()) : undefined;
  }
  let best: Country[] = [];
  let bestLen = -1;
  for (const c of countries) {
    if (digits.startsWith(c.dialCode)) {
      const len = c.dialCode.length;
      if (len > bestLen) {
        bestLen = len;
        best = [c];
      } else if (len === bestLen) {
        best.push(c);
      }
    }
  }
  if (best.length === 0) {
    return defaultIso2 ? countries.find((c) => !c.isAreaCode && c.iso2 === defaultIso2.toLowerCase()) : undefined;
  }
  // Choose by smallest priority (undefined treated as 0), and prefer base entries over area-code entries
  best.sort((a, b) => (a.isAreaCode ? 1 : 0) - (b.isAreaCode ? 1 : 0) || (a.priority ?? 0) - (b.priority ?? 0));
  return best[0];
}




