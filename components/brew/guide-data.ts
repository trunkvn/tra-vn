// Per-tea starting points for the guided brew, for a small clay pot of about 150 ml.
// These are common rules of thumb, not figures from the sources the page is written from — the guide says so on screen.
export type TeaGuide = {
  /** Water temperature for the first and second water, in °C. */
  tempC: number;
  /** How much of the pot the dry leaf fills, 0–1. */
  fill: number;
  fillLabel: string;
  /** Dry leaf for a ~150 ml pot, in grams. */
  grams: number;
  /** Default wait for the second water, in seconds (the guide allows 60–90). */
  seconds: 60 | 75 | 90;
  /** One line on why this tea is treated this way. */
  tip: string;
};

export const MIN_SECONDS = 60;
export const MAX_SECONDS = 90;
export const SECOND_CHOICES = [60, 75, 90] as const;

export const teaGuides: Record<string, TeaGuide> = {
  xanh: {
    tempC: 85,
    fill: 1 / 3,
    fillLabel: "a third",
    grams: 4,
    seconds: 60,
    tip: "Pan-roasted green leaf is delicate; water straight off the boil turns it bitter.",
  },
  sen: {
    tempC: 90,
    fill: 1 / 3,
    fillLabel: "a third",
    grams: 4,
    seconds: 60,
    tip: "A scented green tea: hot enough to open the lotus, cool enough to keep the perfume.",
  },
  nhai: {
    tempC: 85,
    fill: 1 / 3,
    fillLabel: "a third",
    grams: 4,
    seconds: 60,
    tip: "Jasmine's scent is easily cooked away, so keep the water a little under the boil.",
  },
  shan: {
    tempC: 90,
    fill: 1 / 3,
    fillLabel: "a third",
    grams: 5,
    seconds: 75,
    tip: "Large, downy ancient-tree leaf: hot water, a little longer, for sweetness without harshness.",
  },
  olong: {
    tempC: 95,
    fill: 1 / 4,
    fillLabel: "a quarter",
    grams: 6,
    seconds: 90,
    tip: "Rolled leaf swells to fill the pot, so use less by volume and give it the full time to unroll.",
  },
  den: {
    tempC: 95,
    fill: 1 / 4,
    fillLabel: "a quarter",
    grams: 4,
    seconds: 75,
    tip: "Fully oxidised black tea can take near-boiling water; a shorter steep keeps it from going bitter.",
  },
  man: {
    tempC: 100,
    fill: 1 / 3,
    fillLabel: "a third",
    grams: 5,
    seconds: 90,
    tip: "Aged mạn is coarse and mellow: it wants water at a full boil, which is also the old Hà Nội way.",
  },
};
