import { countries, countriesByIso2 } from '../src/index';

describe('country data', () => {
  it('US and CA priorities are preserved in the base dictionary', () => {
    expect(countriesByIso2['us'].priority ?? 0).toBeLessThan((countriesByIso2['ca'].priority ?? 0));
  });

  it('countries list contains only base entries (no isAreaCode=true)', () => {
    expect(countries.some((c) => c.isAreaCode === true)).toBe(false);
  });

  it('countriesByIso2 aligns with countries export for US', () => {
    const usFromDict = countriesByIso2['us'];
    const usFromList = countries.find((c) => c.iso2 === 'us');
    expect(usFromList).toBeTruthy();
    expect(usFromList!.dialCode).toBe(usFromDict.dialCode);
  });
});


