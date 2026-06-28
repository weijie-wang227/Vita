import type {
  VidaLogoLevels,
  vidaLogoPortion,
} from "../components/vidaProgressLogo";

export const brandLogoLevels: VidaLogoLevels = {
  physical: 100,
  social: 100,
  cognitive: 100,
  creative: 100,
};

export const emptyLogoLevels: VidaLogoLevels = {
  physical: 0,
  social: 0,
  cognitive: 0,
  creative: 0,
};

export const logoPortionOrder: vidaLogoPortion[] = [
  "physical",
  "social",
  "cognitive",
  "creative",
];
