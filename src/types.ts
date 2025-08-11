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
  iso2: string; // lowercase ISO-3166 alpha-2
  dialCode: string; // numeric string, may include country + area code
  format?: string; // mask pattern like "+.. ... ... ..."
  priority?: number; // ordering among countries sharing the same dialCode
  areaCodes?: string[]; // defined on base country entries that have area codes
  isAreaCode?: boolean; // true for synthesized entries representing area codes
}

// Note: No global dial-code index is maintained anymore; utilities compute results on demand.

