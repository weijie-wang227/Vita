// src/components/AddActivityModal.tsx

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";
import { uploadImageToR2 } from "../api/uploads";
import { createActivity } from "../api/map";

type AddActivityModalProps = {
  open: boolean;
  onClose: () => void;
  type: ActivityType;
  sourceId: string;
};

type ActivityType = "classes" | "groups";

type FormState = {
  title: string;
  type: ActivityType;
  date: string;
  time: string;
  imageUrl: string;
  sourceId: string;
};

const singaporeCenter: LatLngExpression = [1.3521, 103.8198];

function ResizeMap() {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map]);

  return null;
}

function LocationPicker({
  selectedPosition,
  onSelectPosition,
}: {
  selectedPosition: [number, number] | null;
  onSelectPosition: (position: [number, number]) => void;
}) {
  useMapEvents({
    click(event) {
      onSelectPosition([event.latlng.lat, event.latlng.lng]);
    },
  });

  if (!selectedPosition) return null;

  return <Marker position={selectedPosition} />;
}

export function AddActivityModal({
  open,
  onClose,
  sourceId,
  type,
}: AddActivityModalProps) {
  const [selectedPosition, setSelectedPosition] = useState<
    [number, number] | null
  >(null);

  const [form, setForm] = useState<FormState>({
    title: "",
    type: "classes",
    date: "",
    time: "",
    imageUrl: "",
    sourceId: "",
  });

  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  if (!open) return null;

  function updateField<K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!selectedPosition) {
      alert("Please click on the map to choose a location.");
      return;
    }

    if (!form.title.trim()) {
      alert("Please enter a title.");
      return;
    }

    try {
      setSaving(true);

      let uploadedImageUrl: string | undefined;

      if (imageFile) {
        uploadedImageUrl = await uploadImageToR2(imageFile, "activities");
      }

      const payload = {
        title: form.title,
        type,
        date: form.date,
        time: form.time,
        imageUrl: uploadedImageUrl ?? "",
        sourceId,
        lat: selectedPosition[0],
        lng: selectedPosition[1],
      };

      const response = await createActivity(payload);

      if (!response) {
        throw new Error("Failed to create activity");
      }

      setForm({
        title: "",
        type: "classes",
        date: "",
        time: "",
        imageUrl: "",
        sourceId: "",
      });
      setSelectedPosition(null);
      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to create activity.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="map-modal-backdrop">
      <div className="add-activity-modal">
        <div className="map-modal-header">
          <h2>Add Event</h2>

          <button type="button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="add-activity-content">
          <div className="add-activity-map-wrapper">
            <MapContainer
              center={singaporeCenter}
              zoom={11}
              scrollWheelZoom={true}
              className="activity-map"
            >
              <ResizeMap />

              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <LocationPicker
                selectedPosition={selectedPosition}
                onSelectPosition={setSelectedPosition}
              />
            </MapContainer>
          </div>

          <form className="add-activity-form" onSubmit={handleSubmit}>
            <p className="form-help-text">
              Click on the map to drop a pin, then fill in the event details.
            </p>

            {selectedPosition && (
              <div className="selected-location-box">
                <p>Selected location:</p>
                <p>
                  Lat: {selectedPosition[0].toFixed(5)}, Lng:{" "}
                  {selectedPosition[1].toFixed(5)}
                </p>
              </div>
            )}

            <label>
              Title
              <input
                type="text"
                value={form.title}
                onChange={(event) => updateField("title", event.target.value)}
                placeholder="e.g. Chinese Calligraphy"
              />
            </label>

            <label>
              Date
              <input
                type="date"
                value={form.date}
                onChange={(event) => updateField("date", event.target.value)}
              />
            </label>

            <label>
              Time
              <input
                type="time"
                value={form.time}
                onChange={(event) => updateField("time", event.target.value)}
              />
            </label>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Image URL
              </label>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(event) => {
                  setImageFile(event.target.files?.[0] ?? null);
                }}
              />
            </div>

            <button type="submit" disabled={saving} onSubmit={handleSubmit}>
              {saving ? "Saving..." : "Create Event"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

type FloatingMapButtonProps = {
  onClick: () => void;
};

export function FloatingAddButton({ onClick }: FloatingMapButtonProps) {
  return (
    <button type="button" className="floating-map-button" onClick={onClick}>
      +
    </button>
  );
}
