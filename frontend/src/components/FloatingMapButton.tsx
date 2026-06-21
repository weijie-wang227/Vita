// src/components/FloatingMapButton.tsx
type FloatingMapButtonProps = {
  onClick: () => void;
};

export function FloatingMapButton({ onClick }: FloatingMapButtonProps) {
  return (
    <button type="button" className="floating-map-button" onClick={onClick}>
      🗺️
    </button>
  );
}
