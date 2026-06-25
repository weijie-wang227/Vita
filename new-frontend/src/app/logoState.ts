import type {
  VitaLogoLevels,
  VitaLogoPortion,
} from "../components/VitaProgressLogo";

export const brandLogoLevels: VitaLogoLevels = {
  physical: 100,
  social: 100,
  cognitive: 100,
  creative: 100,
};

export const emptyLogoLevels: VitaLogoLevels = {
  physical: 0,
  social: 0,
  cognitive: 0,
  creative: 0,
};

export const logoPortionOrder: VitaLogoPortion[] = [
  "physical",
  "social",
  "cognitive",
  "creative",
];
