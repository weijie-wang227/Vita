import { X } from "lucide-react";
import { VitaProgressLogo, type VitaLogoLevels } from "../components/VitaProgressLogo";

export function VitaLogoOverlay({
  levels,
  onAdvance,
  onClose,
}: {
  levels: VitaLogoLevels;
  onAdvance: () => void;
  onClose: () => void;
}) {
  return (
    <div className="vita-logo-overlay">
      <button
        type="button"
        className="vita-logo-close-button"
        onClick={onClose}
        aria-label="Minimize Vita progress"
      >
        <X size={18} />
      </button>
      <VitaProgressLogo
        levels={levels}
        onPortionClick={onAdvance}
        size="expanded"
      />
    </div>
  );
}
