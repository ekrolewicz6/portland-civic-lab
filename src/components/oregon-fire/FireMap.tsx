"use client";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import {
  CircleMarker,
  GeoJSON,
  MapContainer,
  TileLayer,
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet";
import type { Geometry } from "geojson";
import { circleMarker, geoJSON, type LatLngBoundsExpression } from "leaflet";
import type { MapItem } from "@/lib/oregon-fire/types";

const colors = {
  mixed: "#536454",
  prescribed: "#27674c",
  wildfire: "#b44e2d",
  planned: "#596da0",
};
function Events({
  onView,
}: {
  onView: (bounds: string, zoom: number) => void;
}) {
  const map = useMapEvents({
    moveend() {
      const b = map.getBounds();
      onView(
        [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()]
          .map((n) => n.toFixed(5))
          .join(","),
        map.getZoom(),
      );
    },
  });
  return null;
}
function Selected({ geometry }: { geometry: Geometry | null }) {
  const map = useMap();
  useEffect(() => {
    if (geometry) {
      const bounds = geoJSON(geometry).getBounds();
      if (bounds.isValid())
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    }
  }, [geometry, map]);
  return geometry ? (
    <GeoJSON
      key={JSON.stringify(geometry)}
      data={geometry}
      pointToLayer={(_f, latlng) =>
        circleMarker(latlng, { radius: 9, color: "#172e22", weight: 3 })
      }
      style={{ color: "#172e22", weight: 4, fillOpacity: 0.06 }}
    />
  ) : null;
}
function Records({
  items,
  onSelect,
}: {
  items: MapItem[];
  onSelect: (id: string) => void;
}) {
  const map = useMap();
  return (
    <>
      {items.map((item) =>
        item.geometry.type === "Point" ? (
          <CircleMarker
            key={item.id}
            center={[
              item.geometry.coordinates[1],
              item.geometry.coordinates[0],
            ]}
            radius={
              item.count ? Math.min(20, 8 + Math.log2(item.count) * 1.3) : 5
            }
            pathOptions={{
              color: colors[item.kind],
              fillColor: colors[item.kind],
              fillOpacity: 0.75,
              weight: 1.5,
              dashArray: item.kind === "planned" ? "4 3" : undefined,
            }}
            eventHandlers={{
              click(e) {
                if (item.count) {
                  map.setView(e.latlng, map.getZoom() + 2);
                } else onSelect(item.id);
              },
            }}
          >
            <Tooltip
              permanent={!!item.count}
              direction={item.count ? "center" : "auto"}
              className={item.count ? "fire-cluster-count" : undefined}
              opacity={1}
            >
              {item.count ? item.count.toLocaleString() : item.name}
            </Tooltip>
          </CircleMarker>
        ) : (
          <GeoJSON
            key={item.id}
            data={item.geometry}
            style={{
              color: colors[item.kind],
              fillColor: colors[item.kind],
              fillOpacity: 0.22,
              weight: 1.3,
              dashArray: item.kind === "planned" ? "5 4" : undefined,
            }}
            eventHandlers={{
              click() {
                onSelect(item.id);
              },
            }}
          >
            <Tooltip>{item.name}</Tooltip>
          </GeoJSON>
        ),
      )}
    </>
  );
}
export default function FireMap({
  items,
  selected,
  onSelect,
  onView,
  initialBounds,
}: {
  items: MapItem[];
  selected: Geometry | null;
  onSelect: (id: string) => void;
  onView: (bounds: string, zoom: number) => void;
  initialBounds: string;
}) {
  const b = initialBounds.split(",").map(Number);
  const valid =
    b.length === 4 &&
    b.every(Number.isFinite) &&
    b[0] < b[2] &&
    b[1] < b[3] &&
    b[0] >= -180 &&
    b[2] <= 180 &&
    b[1] >= -90 &&
    b[3] <= 90;
  const bounds: LatLngBoundsExpression = valid
    ? [
        [b[1], b[0]],
        [b[3], b[2]],
      ]
    : [
        [41.8, -124.9],
        [46.4, -116.3],
      ];
  return (
    <MapContainer
      bounds={bounds}
      preferCanvas
      scrollWheelZoom={false}
      className="fire-map"
      aria-label="Map of documented fire records in Oregon"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Events onView={onView} />
      <Selected geometry={selected} />
      <Records items={items} onSelect={onSelect} />
    </MapContainer>
  );
}
