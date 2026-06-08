import type { GenParams } from "./generator";

export type Mood = {
  id: string;
  label: string;
  apply: (p: GenParams) => Partial<GenParams>;
};

export const MOODS: Mood[] = [
  {
    id: "strict",
    label: "Strict",
    apply: () => ({
      jitter: 0, mergeChance: 0.7, rotationChance: 0,
      gutter: 0, density: 0.7, colorSpread: 3,
    }),
  },
  {
    id: "tight",
    label: "Tight",
    apply: () => ({
      jitter: 0.02, mergeChance: 0.55, rotationChance: 0.3,
      gutter: 4, density: 0.6, colorSpread: 3,
    }),
  },
  {
    id: "loose",
    label: "Loose",
    apply: () => ({
      jitter: 0.25, mergeChance: 0.3, rotationChance: 0.8,
      gutter: 12, density: 0.5, colorSpread: 4,
    }),
  },
  {
    id: "playful",
    label: "Playful",
    apply: () => ({
      jitter: 0.18, mergeChance: 0.45, rotationChance: 1,
      gutter: 8, density: 0.65, colorSpread: 5,
    }),
  },
  {
    id: "calm",
    label: "Calm",
    apply: () => ({
      jitter: 0.05, mergeChance: 0.4, rotationChance: 0.15,
      gutter: 6, density: 0.35, colorSpread: 2,
    }),
  },
  {
    id: "energetic",
    label: "Energetic",
    apply: () => ({
      jitter: 0.3, mergeChance: 0.6, rotationChance: 1,
      gutter: 4, density: 0.8, colorSpread: 5,
    }),
  },
  {
    id: "minimal",
    label: "Minimal",
    apply: () => ({
      jitter: 0, mergeChance: 0.5, rotationChance: 0.2,
      gutter: 20, padding: 80, density: 0.25, colorSpread: 2,
    }),
  },
  {
    id: "dense",
    label: "Dense",
    apply: () => ({
      jitter: 0, mergeChance: 0.7, rotationChance: 0.5,
      gutter: 0, density: 0.95, colorSpread: 4,
    }),
  },
  {
    id: "bold",
    label: "Bold",
    apply: () => ({
      jitter: 0.05, mergeChance: 0.75, rotationChance: 0.4,
      gutter: 2, density: 0.75, colorSpread: 5,
    }),
  },
  {
    id: "quiet",
    label: "Quiet",
    apply: () => ({
      jitter: 0.04, mergeChance: 0.35, rotationChance: 0.2,
      gutter: 16, density: 0.3, colorSpread: 2,
    }),
  },
];
