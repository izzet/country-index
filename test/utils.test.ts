import {
  countries,
  countriesByIso2,
  getCountryByIso2,
  findCountriesByDialCode,
  expandAreaCodes,
  deleteAreaCodes,
  filterRegions,
  getOnlyCountries,
  excludeCountries,
  pickPreferredCountries,
  guessSelectedCountry,
} from '../src/index';

describe('utils', () => {
  it('getCountryByIso2 returns the base country entry', () => {
    const us = getCountryByIso2(countries, 'US');
    expect(us).toBeTruthy();
    expect(us!.iso2).toBe('us');
    expect(us!.isAreaCode).toBeUndefined();
  });

  it('findCountriesByDialCode can match synthesized area-code entries created ad-hoc', () => {
    const us = countriesByIso2['us'];
    const synthesized = [
      us,
      ...(us.areaCodes || []).map((ac) => ({ ...us, dialCode: `${us.dialCode}${ac}`, isAreaCode: true })),
    ];
    const found = findCountriesByDialCode(synthesized, '1205');
    expect(found.some((c) => c.iso2 === 'us' && c.isAreaCode)).toBe(true);
  });

  it('expandAreaCodes + deleteAreaCodes are inverses on base countries', () => {
    const expanded = expandAreaCodes(countries);
    const backToBase = deleteAreaCodes(expanded);
    expect(backToBase.length).toBe(countries.length);
  });

  it('filterRegions selects countries by tags', () => {
    const europe = filterRegions(['europe'], countries);
    expect(europe.length).toBeGreaterThan(0);
    expect(europe.every((c) => c.regions.includes('europe') || c.regions.includes('european-union'))).toBe(true);
  });

  it('getOnlyCountries and excludeCountries compose to final selection', () => {
    const only = getOnlyCountries(['us', 'ca', 'gb'], countries);
    const final = excludeCountries(only, ['ca']);
    expect(final.some((c) => c.iso2 === 'us')).toBe(true);
    expect(final.some((c) => c.iso2 === 'ca')).toBe(false);
  });

  it('pickPreferredCountries extracts preferred by iso2', () => {
    const pref = pickPreferredCountries(countries, ['us', 'gb']);
    expect(pref.map((c) => c.iso2).sort()).toEqual(['gb', 'us']);
  });

  it('guessSelectedCountry prefers longest matching dial code and base entries', () => {
    const expanded = expandAreaCodes(countries);
    const guess = guessSelectedCountry('1205', expanded, 'gb');
    expect(guess?.iso2).toBe('us');
  });

  
});


