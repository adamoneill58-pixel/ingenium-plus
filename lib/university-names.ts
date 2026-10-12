/**
 * Short display names for the ten INGENIUM alliance universities, used for the
 * host label on record cards. A small constant avoids bundling the full static
 * catalogue into client components; `tests/v15-logic.test.mjs` verifies it
 * matches the university records in the dataset.
 */
export const universityShortNames: Readonly<Record<string, string>> = {
  "university-uniovi": "UNIOVI",
  "university-mus": "MUS",
  "university-uoc": "UoC",
  "university-hka": "HKA",
  "university-xamk": "Xamk",
  "university-uda": "Ud’A",
  "university-hs": "HS",
  "university-mtu": "MTU",
  "university-urn": "URN",
  "university-tuiasi": "TUIASI",
};

