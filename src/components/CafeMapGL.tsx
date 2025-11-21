import { useEffect, useMemo, useRef, useState } from "react";
import maplibregl, { Map, LngLatLike, LngLatBoundsLike } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

type Branch = {
  id: string;
  name: string;
  coords: { lat: number; lng: number };
  addressLine?: string;
  phone?: string;
  mapsUrl?: string;
};

type Props = {
  /** If you have one location, pass coords + name like before */
  coords?: { lat: number; lng: number };
  cafeName?: string;
  addressLine?: string;
  phone?: string;
  mapsUrl?: string;

  /** If you have multiple locations, pass branches instead (it’ll pick nearest) */
  branches?: Branch[];

  /** Delivery check: show “inside radius” UI if true */
  deliveryRadiusMeters?: number; // e.g. 4000

  /** Optional wrapper class (height, rounding, etc.) */
  className?: string;
};

/* ---------------- Theme ---------------- */
const THEME = {
  coffee: "#8B5E3C",
  coffeeRich: "#5a3a22",
  cream: "#fff7e9",
  sage: "#7aa186",
};

const STYLE_URL = "https://tiles.openfreemap.org/styles/bright";
const PLANET_SOURCE_URL = "https://tiles.openfreemap.org/planet";

/* ---------------- Helpers ---------------- */
const R_EARTH_KM = 6371;
const toRad = (d: number) => (d * Math.PI) / 180;
const toDeg = (r: number) => (r * 180) / Math.PI;

function distanceKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
) {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R_EARTH_KM * Math.asin(Math.sqrt(s));
}
function destinationPoint(
  lat: number,
  lng: number,
  distanceKmVal: number,
  bearingDeg: number
) {
  const δ = distanceKmVal / R_EARTH_KM;
  const θ = toRad(bearingDeg);
  const φ1 = toRad(lat);
  const λ1 = toRad(lng);

  const φ2 = Math.asin(
    Math.sin(φ1) * Math.cos(δ) + Math.cos(φ1) * Math.sin(δ) * Math.cos(θ)
  );
  const λ2 =
    λ1 +
    Math.atan2(
      Math.sin(θ) * Math.sin(δ) * Math.cos(φ1),
      Math.cos(δ) - Math.sin(φ1) * Math.sin(φ2)
    );

  return { lat: toDeg(φ2), lng: ((toDeg(λ2) + 540) % 360) - 180 };
}
function circlePolygon(
  center: { lat: number; lng: number },
  radiusMeters: number,
  steps = 64
) {
  const pts: [number, number][] = [];
  const km = radiusMeters / 1000;
  for (let i = 0; i <= steps; i++) {
    const b = (i / steps) * 360;
    const p = destinationPoint(center.lat, center.lng, km, b);
    pts.push([p.lng, p.lat]);
  }
  return {
    type: "Feature" as const,
    geometry: { type: "Polygon" as const, coordinates: [pts] },
    properties: {},
  };
}
const nf0 = new Intl.NumberFormat("en-US");
const fmtDistance = (km: number) =>
  km < 1
    ? `${Math.round(km * 1000)} m`
    : km < 100
    ? `${km.toFixed(1)} km`
    : `${nf0.format(Math.round(km))} km`;
const fmtDuration = (min: number) =>
  min < 60 ? `${Math.round(min)} min` : `${Math.round(min / 60)} h`;

/* ---------------- Component ---------------- */
const CafeMapPro: React.FC<Props> = ({
  coords,
  cafeName = "Deccan Brews",
  addressLine,
  phone,
  mapsUrl,
  branches,
  deliveryRadiusMeters = 4000,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const youMarkerRef = useRef<maplibregl.Marker | null>(null);

  const [me, setMe] = useState<{ lat: number; lng: number } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [showRadius, setShowRadius] = useState(false);
  const [travelMode, setTravelMode] = useState<
    "walking" | "cycling" | "driving"
  >("driving");
  const [routeETA, setRouteETA] = useState<{ km: number; min: number } | null>(
    null
  );
  const [isRouting, setIsRouting] = useState(false);

  // pick active target: single coords or nearest branch
  const target = useMemo(() => {
    if (branches?.length) {
      if (!me) {
        // pick first as default until we can compute nearest
        const b0 = branches[0];
        return {
          coords: b0.coords,
          cafeName: b0.name,
          addressLine: b0.addressLine ?? addressLine,
          phone: b0.phone ?? phone,
          mapsUrl: b0.mapsUrl ?? mapsUrl,
        };
      }
      let best = branches[0];
      let bestD = distanceKm(me, branches[0].coords);
      for (let i = 1; i < branches.length; i++) {
        const d = distanceKm(me, branches[i].coords);
        if (d < bestD) {
          best = branches[i];
          bestD = d;
        }
      }
      return {
        coords: best.coords,
        cafeName: best.name,
        addressLine: best.addressLine ?? addressLine,
        phone: best.phone ?? phone,
        mapsUrl: best.mapsUrl ?? mapsUrl,
      };
    }
    if (!coords) throw new Error("Provide either `coords` or `branches`.");
    return { coords, cafeName, addressLine, phone, mapsUrl };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branches, me, coords, cafeName, addressLine, phone, mapsUrl]);

  const center = useMemo<LngLatLike>(
    () => [target.coords.lng, target.coords.lat],
    [target]
  );

  const openDirections = () => {
    const url = target.mapsUrl
      ? target.mapsUrl
      : /iPad|iPhone|iPod/.test(navigator.userAgent)
      ? `https://maps.apple.com/?daddr=${target.coords.lat},${target.coords.lng}`
      : `https://www.google.com/maps/dir/?api=1&destination=${target.coords.lat},${target.coords.lng}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const shareLocation = async () => {
    const shareUrl =
      target.mapsUrl ||
      `https://www.google.com/maps/search/?api=1&query=${target.coords.lat},${target.coords.lng}`;
    const text = `${target.cafeName}\n${target.addressLine ?? ""}\n${shareUrl}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: target.cafeName, text, url: shareUrl });
      } else {
        await navigator.clipboard.writeText(text);
        // you can pop a toast here if you have a hook
      }
    } catch {}
  };

  const locateMe = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setMe({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setMe(null),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // init map
  useEffect(() => {
    if (!containerRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: STYLE_URL,
      center,
      zoom: 16,
      pitch: 60,
      bearing: -20,
      attributionControl: false,
      cooperativeGestures: true,
    });
    mapRef.current = map;

    map.addControl(
      new maplibregl.NavigationControl({ showCompass: true }),
      "top-left"
    );

    map.on("load", () => {
      // vector for 3D buildings
      if (!map.getSource("openfreemap")) {
        map.addSource("openfreemap", {
          type: "vector",
          url: PLANET_SOURCE_URL,
        });
      }

      const layers = map.getStyle()?.layers ?? [];
      let labelLayerId: string | undefined;
      for (let i = 0; i < layers.length; i++) {
        const l = layers[i] as any;
        if (l.type === "symbol" && l.layout?.["text-field"]) {
          labelLayerId = l.id;
          break;
        }
      }

      if (!map.getLayer("3d-buildings")) {
        map.addLayer(
          {
            id: "3d-buildings",
            type: "fill-extrusion",
            source: "openfreemap",
            "source-layer": "building",
            minzoom: 15,
            filter: ["!=", ["get", "hide_3d"], true],
            paint: {
              "fill-extrusion-color": [
                "interpolate",
                ["linear"],
                ["get", "render_height"],
                0,
                "#d9c9b8",
                60,
                THEME.coffee,
                200,
                THEME.coffeeRich,
              ],
              "fill-extrusion-height": [
                "interpolate",
                ["linear"],
                ["zoom"],
                15,
                0,
                16,
                ["get", "render_height"],
              ],
              "fill-extrusion-base": [
                "case",
                [">=", ["get", "zoom"], 16],
                ["get", "render_min_height"],
                0,
              ],
              "fill-extrusion-opacity": 0.9,
            },
          },
          labelLayerId
        );
      }

      // delivery radius (hidden by default)
      map.addSource("r-delivery", {
        type: "geojson",
        data: circlePolygon(target.coords, deliveryRadiusMeters),
      });
      map.addLayer({
        id: "r-delivery-fill",
        type: "fill",
        source: "r-delivery",
        paint: { "fill-color": THEME.sage, "fill-opacity": 0.06 },
      });
      map.addLayer({
        id: "r-delivery-line",
        type: "line",
        source: "r-delivery",
        paint: { "line-color": THEME.sage, "line-opacity": 0.4 },
      });
      ["r-delivery-fill", "r-delivery-line"].forEach((id) =>
        map.setLayoutProperty(id, "visibility", "none")
      );

      // route source/layers
      map.addSource("route", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });
      map.addLayer({
        id: "route-casing",
        type: "line",
        source: "route",
        paint: { "line-color": "#fff", "line-width": 8, "line-opacity": 0.9 },
      });
      map.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        paint: { "line-color": THEME.coffeeRich, "line-width": 5 },
      });

      // marker + popup
      const markerEl = document.createElement("div");
      markerEl.style.position = "relative";
      markerEl.style.width = "22px";
      markerEl.style.height = "22px";
      markerEl.style.display = "grid";
      markerEl.style.placeItems = "center";

      const cup = document.createElement("div");
      cup.style.width = "14px";
      cup.style.height = "14px";
      cup.style.borderRadius = "50%";
      cup.style.border = "2px solid white";
      cup.style.background = THEME.coffeeRich;
      cup.style.boxShadow = "0 2px 6px rgba(0,0,0,0.25)";
      markerEl.appendChild(cup);

      const pulse = document.createElement("div");
      pulse.style.position = "absolute";
      pulse.style.inset = "0";
      pulse.style.borderRadius = "50%";
      pulse.style.boxShadow = `0 0 0 0 ${THEME.coffeeRich}55`;
      pulse.style.animation = "cb-pulse 2s ease-in-out infinite";
      markerEl.appendChild(pulse);

      if (!document.getElementById("cb-pulse-style")) {
        const s = document.createElement("style");
        s.id = "cb-pulse-style";
        s.innerHTML = `
          @keyframes cb-pulse {
            0% { box-shadow: 0 0 0 0 ${THEME.coffeeRich}66; }
            70% { box-shadow: 0 0 0 18px transparent; }
            100% { box-shadow: 0 0 0 0 transparent; }
          }
        `;
        document.head.appendChild(s);
      }

      const popupHtml = `
        <div style="font-family: ui-sans-serif, system-ui; max-width: 260px;">
          <div style="font-weight:700;color:${
            THEME.coffeeRich
          };margin-bottom:4px;">${target.cafeName}</div>
          ${
            target.addressLine
              ? `<div style="font-size:12px;color:#555;margin-bottom:10px;line-height:1.3;">${target.addressLine}</div>`
              : ""
          }
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <button data-act="dir" style="padding:6px 10px;border:1px solid ${
              THEME.coffee
            };
              border-radius:999px;background:white;color:${
                THEME.coffeeRich
              };font-weight:600;font-size:12px;cursor:pointer">Directions</button>
            <button data-act="copy" style="padding:6px 10px;border:1px solid ${
              THEME.sage
            };
              border-radius:999px;background:white;color:${
                THEME.coffeeRich
              };font-weight:600;font-size:12px;cursor:pointer">Copy address</button>
            ${
              target.phone
                ? `<a href="tel:${target.phone.replace(
                    /\s+/g,
                    ""
                  )}" style="padding:6px 10px;border:1px solid ${THEME.coffee};
                    border-radius:999px;background:white;color:${
                      THEME.coffeeRich
                    };font-weight:600;font-size:12px;text-decoration:none;">Call</a>`
                : ""
            }
          </div>
        </div>
      `;
      const popup = new maplibregl.Popup({
        offset: 18,
        closeButton: true,
        closeOnClick: false,
        maxWidth: "280px",
      }).setHTML(popupHtml);

      const cafeMarker = new maplibregl.Marker({
        element: markerEl,
        anchor: "center",
      })
        .setLngLat(center)
        .setPopup(popup)
        .addTo(map);

      popup.on("open", () => {
        const el = popup.getElement();
        el?.querySelector('[data-act="dir"]')?.addEventListener(
          "click",
          openDirections
        );
        el?.querySelector('[data-act="copy"]')?.addEventListener(
          "click",
          async () => {
            try {
              await navigator.clipboard.writeText(
                target.addressLine ||
                  `${target.coords.lat}, ${target.coords.lng}`
              );
            } catch {}
          }
        );
      });

      map.flyTo({
        center,
        zoom: 16.2,
        bearing: -17,
        pitch: 60,
        duration: 1200,
        essential: true,
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
      youMarkerRef.current = null;
    };
  }, [center, target, deliveryRadiusMeters]);

  // toggle delivery ring
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const v = showRadius ? "visible" : "none";
    ["r-delivery-fill", "r-delivery-line"].forEach((id) => {
      if (map.getLayer(id)) map.setLayoutProperty(id, "visibility", v);
    });
  }, [showRadius]);

  // place "you" + update distance
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (!me) {
      setDistance(null);
      if (youMarkerRef.current) {
        youMarkerRef.current.remove();
        youMarkerRef.current = null;
      }
      // clear route if user disappears
      const src = map.getSource("route") as
        | maplibregl.GeoJSONSource
        | undefined;
      src?.setData({ type: "FeatureCollection", features: [] });
      setRouteETA(null);
      return;
    }

    const d = distanceKm(me, target.coords);
    setDistance(d);

    const el = document.createElement("div");
    el.style.width = "12px";
    el.style.height = "12px";
    el.style.borderRadius = "50%";
    el.style.border = "2px solid white";
    el.style.background = THEME.sage;
    el.style.boxShadow = "0 2px 6px rgba(0,0,0,0.25)";

    if (!youMarkerRef.current) {
      youMarkerRef.current = new maplibregl.Marker({
        element: el,
        anchor: "center",
      })
        .setLngLat([me.lng, me.lat])
        .addTo(map);
    } else {
      youMarkerRef.current.setLngLat([me.lng, me.lat]);
    }
  }, [me, target.coords]);

  // route preview via OSRM
  const requestRoute = async () => {
    if (!me) {
      locateMe();
      return;
    }
    const map = mapRef.current;
    if (!map) return;

    setIsRouting(true);
    try {
      const profile =
        travelMode === "walking"
          ? "foot"
          : travelMode === "cycling"
          ? "bike"
          : "car";
      const url = `https://routing.openstreetmap.de/routed-${profile}/route/v1/driving/${me.lng},${me.lat};${target.coords.lng},${target.coords.lat}?overview=full&geometries=geojson`;
      const res = await fetch(url);
      const json = await res.json();
      const route = json?.routes?.[0];
      if (!route) throw new Error("No route");

      const data = {
        type: "FeatureCollection" as const,
        features: [
          {
            type: "Feature" as const,
            geometry: route.geometry,
            properties: {},
          },
        ],
      };
      const src = map.getSource("route") as
        | maplibregl.GeoJSONSource
        | undefined;
      src?.setData(data);

      // fit bounds
      const bbox = route?.geometry?.coordinates?.reduce(
        (b: [number, number, number, number] | null, c: [number, number]) =>
          !b
            ? [c[0], c[1], c[0], c[1]]
            : [
                Math.min(b[0], c[0]),
                Math.min(b[1], c[1]),
                Math.max(b[2], c[0]),
                Math.max(b[3], c[1]),
              ],
        null
      );
      if (bbox) {
        map.fitBounds(bbox as LngLatBoundsLike, { padding: 60, duration: 700 });
      }

      // ETA
      const km = route.distance / 1000;
      const min = route.duration / 60;
      setRouteETA({ km, min });
    } catch {
      // could toast "routing failed"
    } finally {
      setIsRouting(false);
    }
  };

  const clearRoute = () => {
    const map = mapRef.current;
    if (!map) return;
    const src = map.getSource("route") as maplibregl.GeoJSONSource | undefined;
    src?.setData({ type: "FeatureCollection", features: [] });
    setRouteETA(null);
  };

  /* UI bits */
  const Chip = ({ children }: { children: React.ReactNode }) => (
    <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs bg-coffee-medium/10 text-coffee-rich">
      {children}
    </span>
  );

  const insideDelivery =
    me && distance != null ? distance * 1000 <= deliveryRadiusMeters : null;

  return (
    <div
      className={`relative ${
        className ?? "h-72 md:h-80"
      } rounded-xl overflow-hidden`}
    >
      <div ref={containerRef} className="absolute inset-0" />

      {/* Top-right controls */}
      <div className="absolute top-3 right-3 z-[1] flex gap-2">
        <div className="bg-white/80 backdrop-blur border border-white/30 rounded-full overflow-hidden">
          <button
            className={`px-3 py-1.5 text-xs ${
              travelMode === "walking"
                ? "bg-white text-coffee-rich"
                : "text-coffee-rich/80"
            }`}
            onClick={() => setTravelMode("walking")}
            title="Walk"
          >
            🚶
          </button>
          <button
            className={`px-3 py-1.5 text-xs ${
              travelMode === "cycling"
                ? "bg-white text-coffee-rich"
                : "text-coffee-rich/80"
            }`}
            onClick={() => setTravelMode("cycling")}
            title="Bike"
          >
            🚴
          </button>
          <button
            className={`px-3 py-1.5 text-xs ${
              travelMode === "driving"
                ? "bg-white text-coffee-rich"
                : "text-coffee-rich/80"
            }`}
            onClick={() => setTravelMode("driving")}
            title="Drive"
          >
            🚗
          </button>
        </div>

        <button
          className="px-3 py-1.5 text-xs rounded-full border border-white/30 bg-white/80 backdrop-blur hover:bg-white text-coffee-rich"
          onClick={() => setShowRadius((v) => !v)}
        >
          {showRadius ? "Hide radius" : "Show radius"}
        </button>
        <button
          className="px-3 py-1.5 text-xs rounded-full border border-white/30 bg-white/80 backdrop-blur hover:bg-white text-coffee-rich"
          onClick={locateMe}
        >
          Locate me
        </button>
      </div>

      {/* Bottom panel */}
      <div className="absolute left-3 right-3 bottom-3 z-[1]">
        <div className="rounded-xl bg-white/90 backdrop-blur p-3 md:p-4 border border-white/30 shadow-soft">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="min-w-0">
              <div className="text-sm font-semibold text-coffee-rich">
                {target.cafeName}
              </div>
              {target.addressLine && (
                <div className="text-xs text-muted-foreground truncate">
                  {target.addressLine}
                </div>
              )}
              {insideDelivery !== null && (
                <div className="mt-1">
                  {insideDelivery ? (
                    <Chip>✅ We deliver to your location</Chip>
                  ) : (
                    <Chip>ℹ️ Outside delivery area</Chip>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center flex-wrap gap-2">
              {/* distance chips (as-the-crow-flies) */}
              {me && distance != null && !routeETA && (
                <>
                  <Chip>{fmtDistance(distance)}</Chip>
                  <Chip>🚶 {fmtDuration((distance / 5) * 60)}</Chip>
                  <Chip>🚴 {fmtDuration((distance / 15) * 60)}</Chip>
                  <Chip>🚗 {fmtDuration((distance / 28) * 60)}</Chip>
                </>
              )}

              {/* route ETA (actual) */}
              {routeETA && (
                <>
                  <Chip>Route: {routeETA.km.toFixed(1)} km</Chip>
                  <Chip>ETA: {fmtDuration(routeETA.min)}</Chip>
                </>
              )}

              <button
                className="px-3 py-1.5 text-xs rounded-full border border-white/40 bg-white hover:bg-cream text-coffee-rich"
                onClick={openDirections}
              >
                Directions
              </button>

              {!routeETA ? (
                <button
                  className="px-3 py-1.5 text-xs rounded-full border border-white/40 bg-white hover:bg-cream text-coffee-rich disabled:opacity-50"
                  onClick={requestRoute}
                  disabled={isRouting}
                >
                  {isRouting ? "Routing…" : "Preview route"}
                </button>
              ) : (
                <button
                  className="px-3 py-1.5 text-xs rounded-full border border-white/40 bg-white hover:bg-cream text-coffee-rich"
                  onClick={clearRoute}
                >
                  Clear route
                </button>
              )}

              <button
                className="px-3 py-1.5 text-xs rounded-full border border-white/40 bg-white hover:bg-cream text-coffee-rich"
                onClick={shareLocation}
              >
                Share
              </button>

              {target.phone && (
                <a
                  className="px-3 py-1.5 text-xs rounded-full border border-white/40 bg-white hover:bg-cream text-coffee-rich"
                  href={`tel:${target.phone.replace(/\s+/g, "")}`}
                >
                  Call
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CafeMapPro;
