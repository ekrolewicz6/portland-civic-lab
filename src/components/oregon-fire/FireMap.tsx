"use client";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import {
  CircleMarker,
  GeoJSON,
  MapContainer,
  Pane,
  TileLayer,
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet";
import type { Geometry, FeatureCollection } from "geojson";
import {
  circleMarker,
  geoJSON,
  type GeoJSON as LeafletGeoJSON,
  type LatLngBoundsExpression,
} from "leaflet";
import { scarColor, type ScarItem } from "@/lib/oregon-fire/landscape";
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
function Severity({
  year,
  onState,
}: {
  year: number;
  onState: (state: string) => void;
}) {
  const failed = useRef(false);
  return (
    <TileLayer
      key={year}
      url={`/api/oregon-fire/severity?year=${year}&z={z}&x={x}&y={y}`}
      opacity={0.86}
      maxNativeZoom={18}
      attribution='Burn severity: <a href="https://www.mtbs.gov/">USGS / USFS MTBS</a>'
      eventHandlers={{
        loading() {
          failed.current = false;
          onState("loading");
        },
        tileerror() {
          failed.current = true;
          onState("error");
        },
        load() {
          onState(failed.current ? "error" : "ready");
        },
      }}
    />
  );
}
function Scars({
  items,
  end,
  severity,
  onSelect,
}: {
  items: ScarItem[];
  end: number;
  severity: boolean;
  onSelect: (id: string) => void;
}) {
  const layerRef = useRef<LeafletGeoJSON>(null);
  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    layer.clearLayers();
    layer.addData({
      type: "FeatureCollection",
      features: items.map((i) => ({
        type: "Feature",
        geometry: i.geometry,
        properties: { id: i.id, name: i.name, year: i.year },
      })),
    } as FeatureCollection);
  }, [items, end, severity]);
  return (
    <GeoJSON
      ref={layerRef}
      key={`${end}:${severity}`}
      data={{ type: "FeatureCollection", features: [] } as FeatureCollection}
      style={(f) => ({
        color: severity ? "#64483b" : scarColor(f?.properties.year, end),
        weight: severity ? 0.8 : 1.1,
        fillColor: scarColor(f?.properties.year, end),
        fillOpacity: severity ? 0 : 0.25,
      })}
      onEachFeature={(feature, layer) => {
        const p = feature.properties;
        const text = document.createElement("span");
        text.textContent = `${p.name} · ${p.year} · wildfire perimeter`;
        layer.bindTooltip(text);
        layer.on("click", () => onSelect(p.id));
      }}
    />
  );
}
export default function FireMap({
  items,
  selected,
  onSelect,
  onView,
  initialBounds,
  scars,
  scarEnd,
  severity,
  onSeverityState,
}: {
  items: MapItem[];
  selected: Geometry | null;
  onSelect: (id: string) => void;
  onView: (bounds: string, zoom: number) => void;
  initialBounds: string;
  scars: ScarItem[];
  scarEnd: number;
  severity: boolean;
  onSeverityState: (state: string) => void;
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
        className="fire-base-tiles"
      />
      <Pane name="severity" style={{ zIndex: 350 }}>
        {severity && <Severity year={scarEnd} onState={onSeverityState} />}
      </Pane>
      <Pane name="fire-scars" style={{ zIndex: 380 }}>
        <Scars
          items={scars}
          end={scarEnd}
          severity={severity}
          onSelect={onSelect}
        />
      </Pane>
      <Events onView={onView} />
      <Selected geometry={selected} />
      <Records items={items} onSelect={onSelect} />
    </MapContainer>
  );
}
