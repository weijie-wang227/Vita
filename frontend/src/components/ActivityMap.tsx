// src/components/ActivityMapModal.tsx
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import type { Activity } from "../lib/types";
import { fetchActivities } from "../api/map";
import "leaflet/dist/leaflet.css";
import "./map.css";

type ActivityMapModalProps = {
  open: boolean;
  onClose: () => void;
};

export function ActivityMapModal({ open, onClose }: ActivityMapModalProps) {
  const [events, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;

    async function loadActivities() {
      try {
        setLoading(true);
        const data = await fetchActivities();
        setActivities(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadActivities();
  }, [open]);

  if (!open) return null;

  function handleGoToActivity(event: Activity) {
    if (event.type === "class") {
      navigate(`/classes/${event.sourceId}`);
    } else {
      navigate(`/groups/${event.sourceId}`);
    }

    onClose();
  }

  return (
    <div className="map-modal-backdrop">
      <div className="map-modal">
        <div className="map-modal-header">
          <h2>Explore Activities</h2>
          <button type="button" onClick={onClose}>
            ✕
          </button>
        </div>

        {loading ? (
          <div className="map-loading">Loading map events...</div>
        ) : (
          <MapContainer
            center={[1.3521, 103.8198]}
            zoom={11}
            scrollWheelZoom
            className="event-map"
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {events.map((event) => (
              <Marker
                key={`${event.type}-${event.sourceId}`}
                position={[event.lat, event.lng]}
              >
                <Popup>
                  <div className="map-popup">
                    {event.imageUrl && (
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="map-popup-image"
                      />
                    )}

                    <p className="map-popup-type">
                      {event.type === "class" ? "Class" : "Group"}
                    </p>

                    <h3>{event.title}</h3>

                    {event.description && <p>{event.description}</p>}

                    {event.date && (
                      <p>
                        {event.date}
                        {event.time ? `, ${event.time}` : ""}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={() => handleGoToActivity(event)}
                      className="map-popup-button"
                    >
                      View {event.type === "class" ? "Class" : "Group"}
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>
    </div>
  );
}
