
'use client';
import React, { useState, useMemo } from 'react';
import Map, { Source, Layer, MapRef, Point } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

export type ParcelProperties = {
  progress: number;
  id: string;
  isBPL?: boolean;
};

export type Parcel = {
  type: 'Feature';
  properties: ParcelProperties;
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
  };
};

type HoverInfo = {
    id: string;
    progress: number;
    x: number;
    y: number;
}

interface TwinPreviewMapProps {
    parcels: Parcel[];
}


export const TwinPreviewMap = ({ parcels }: TwinPreviewMapProps) => {
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);

  const mapTilerKey = process.env.NEXT_PUBLIC_MAPTILER_KEY;

  const geojsonData = useMemo(() => ({
      type: 'FeatureCollection',
      features: parcels
  }), [parcels]);


  if (!mapTilerKey) {
      console.warn("MapTiler key is not set. Please set NEXT_PUBLIC_MAPTILER_KEY in your environment.");
      return <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">MapTiler API Key is missing.</div>
  }

  return (
    <Map
      initialViewState={{
        longitude: 77.605,
        latitude: 12.915,
        zoom: 12,
        pitch: 45,
        bearing: -17
      }}
      style={{ width: '100%', height: '100%' }}
      mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${mapTilerKey}`}
      interactiveLayerIds={['parcels-fill']}
      onMouseMove={evt => {
        const feature = evt.features && evt.features[0];
        if (feature?.properties) {
          setHoverInfo({
            id: feature.properties.id,
            progress: feature.properties.progress,
            x: evt.point.x,
            y: evt.point.y
          });
        } else {
          setHoverInfo(null);
        }
      }}
      onMouseLeave={() => setHoverInfo(null)}
    >
      {/* Parcel extrusion & fill */}
      <Source id="parcels" type="geojson" data={geojsonData as any}>
        {/* Fill layer */}
        <Layer
          id="parcels-fill"
          type="fill-extrusion"
          paint={{
            'fill-extrusion-color': [
              'interpolate',
              ['linear'],
              ['get', 'progress'],
              0, '#E5E7EB',     // slate-200
              0.5, '#FBBF24',   // amber-400
              1, '#34D399'      // emerald-400
            ],
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['get', 'progress'],
              0, 0,
              1, 30
            ],
            'fill-extrusion-opacity': 0.8
          }}
        />
        {/* Outline layer */}
        <Layer
          id="parcels-line"
          type="line"
          paint={{
            'line-color': '#FFFFFF',
            'line-width': 1
          }}
        />
      </Source>

      {/* Hover tooltip */}
      {hoverInfo && (
        <div
          className="absolute bg-white px-2 py-1 text-sm rounded shadow"
          style={{ left: hoverInfo.x + 10, top: hoverInfo.y + 10, pointerEvents: 'none' }}
        >
          <div><strong>Parcel:</strong> {hoverInfo.id}</div>
          <div><strong>Progress:</strong> {(hoverInfo.progress * 100).toFixed(0)} %</div>
        </div>
      )}
    </Map>
  );
};
