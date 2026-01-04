import React, { useMemo, useEffect, useRef } from 'react';
import { Card, EmptyState } from './elements';
import { REGIONS } from './constants';

// Fungsi helper normalisasi (Regex sudah cukup efisien, di-cache di luar komponen)
const normalize = (str: string) => {
    let s = String(str || "").trim().toLowerCase();
    return s.replace(/kabupaten\s+/g, 'kab ').replace(/\./g, '');
};

const GisMap = ({ dbData, leafletLoaded, currentIndicator, selectedYear }: any) => {
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersLayerRef = useRef<any>(null);
  const regionsList = useMemo(() => {
    if (Array.isArray(REGIONS)) {
        return REGIONS.map((r: any) => {
            const lat = Array.isArray(r.coords) ? r.coords[0] : r.lat;
            const lng = Array.isArray(r.coords) ? r.coords[1] : r.lng;
            return { name: r.name, lat: Number(lat), lng: Number(lng) };
        });
    } else if (REGIONS && typeof REGIONS === 'object') {
        return Object.entries(REGIONS).map(([name, val]: any) => ({
             name, lat: Number(val[0]), lng: Number(val[1])
        }));
    }
    return [];
  }, []);

  const mapData = useMemo(() => {
    if (!dbData || !currentIndicator) return { points: [], minVal: 0, maxVal: 0, hasData: false };

    const tableData = dbData[currentIndicator.table_name] || [];
    const targetYearStr = String(selectedYear);
    const regionSums: Record<string, number> = {};
    let hasDataFound = false;

    // ULTRA OPTIMASI:
    for (let i = 0; i < tableData.length; i++) {
        const row = tableData[i];
        if (String(row.tahun) === targetYearStr) {
            const normName = normalize(row.kabupatenkota);
            if (normName !== 'jawa timur') {
                regionSums[normName] = (regionSums[normName] || 0) + row.jumlah;
                hasDataFound = true;
            }
        }
    }

    if (!hasDataFound) return { points: [], minVal: 0, maxVal: 0, hasData: false };

    let min = Infinity, max = -Infinity;
    const points: any[] = [];
    for (let i = 0; i < regionsList.length; i++) {
        const region = regionsList[i];
        const normName = normalize(region.name);
        const val = regionSums[normName];

        if (val !== undefined && !isNaN(region.lat) && !isNaN(region.lng)) {
            if (val < min) min = val;
            if (val > max) max = val;
            points.push({ n: region.name, x: region.lat, y: region.lng, v: val });
        }
    }

    return { points, minVal: min, maxVal: max, hasData: true };
  }, [selectedYear, currentIndicator, dbData, regionsList]);

  useEffect(() => {
    if (!leafletLoaded || !mapContainerRef.current || !mapData.hasData) return;

    const L = (window as any).L;
    if (!L) return;
    if (mapRef.current && mapRef.current.getContainer() !== mapContainerRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersLayerRef.current = null;
    }

    if (!mapRef.current) {
        mapRef.current = L.map(mapContainerRef.current, {
            preferCanvas: true, 
            zoomControl: false,  
            attributionControl: false
        }).setView([-7.7, 112.5], 7.5);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapRef.current);
        
        markersLayerRef.current = L.layerGroup().addTo(mapRef.current);
        L.control.zoom({ position: 'bottomright' }).addTo(mapRef.current);
    }

    //OPTIMASI RENDER
    requestAnimationFrame(() => {
        if (!markersLayerRef.current) return;
        markersLayerRef.current.clearLayers();
        mapRef.current.invalidateSize();

        const { minVal, maxVal, points } = mapData;
        const range = (maxVal - minVal) || 1;

        // Loop pembuatan marker
        for (let i = 0; i < points.length; i++) {
            const p = points[i];
            const ratio = (p.v - minVal) / range;
            
            // Hitung warna & radius
            let color = '#10b981';
            if (currentIndicator.type === 'positive') {
                color = ratio > 0.66 ? '#db2777' : ratio > 0.33 ? '#f472b6' : '#be123c';
            } else {
                color = ratio > 0.66 ? '#be123c' : ratio > 0.33 ? '#f43f5e' : '#10b981';
            }
            
            const radius = 6 + (ratio * 18); 

            // Buat marker
            const marker = L.circleMarker([p.x, p.y], {
                radius: radius,
                fillColor: color,
                color: '#fff',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.85,
                interactive: true 
            });

            marker.bindPopup(`
                <div class="font-sans text-sm p-1 min-w-[120px]">
                    <h3 class="font-bold text-slate-800 border-b border-slate-100 pb-1 mb-1">${p.n}</h3>
                    <p class="text-[10px] text-slate-500 uppercase tracking-wider mb-1">${currentIndicator.name}</p>
                    <p class="font-bold text-pink-600 text-lg">${p.v.toLocaleString()} <span class="text-[10px] text-slate-400 font-normal">${currentIndicator.unit || ''}</span></p>
                </div>
            `);

            markersLayerRef.current.addLayer(marker);
        }
    });

  }, [leafletLoaded, mapData, currentIndicator]);

  if (!mapData.hasData) {
    return (
       <Card className="h-full relative overflow-hidden flex flex-col animate-fadeIn border-pink-100 min-h-[500px]">
         <div className="absolute top-4 left-4 z-[10] bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-sm border border-pink-100 opacity-50">
            <h3 className="font-bold text-slate-800">Peta Sebaran {selectedYear}</h3>
         </div>
         <div className="flex-1 flex items-center justify-center p-4">
            <EmptyState 
                title={`Data Peta Tahun ${selectedYear} Tidak Tersedia`}
                message={<span>Maaf, data sebaran wilayah untuk indikator <strong>{currentIndicator?.name}</strong> pada tahun {selectedYear} tidak ditemukan.</span>}
            />
         </div>
      </Card>
    );
  }

  return (
    <Card className="h-full relative overflow-hidden flex flex-col animate-fadeIn">
      <div className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-sm border border-pink-100 pointer-events-none">
        <h3 className="font-bold text-slate-800">Peta Sebaran {selectedYear}</h3>
        <p className="text-xs text-slate-500">{currentIndicator.name}</p>
      </div>
      
      {!leafletLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-pink-50 z-50 text-pink-500">
           Memuat Peta...
        </div>
      )}
      
      <div id="map-container" ref={mapContainerRef} className="flex-1 w-full h-full min-h-[500px] bg-slate-50"></div>
      
      {mapData.hasData && mapData.points.length === 0 && (
          <div className="absolute bottom-4 left-4 right-4 z-[1000] bg-yellow-50 text-yellow-700 px-4 py-3 rounded-lg border border-yellow-200 text-sm shadow-sm text-center">
              ⚠️ Data tersedia, namun nama wilayah tidak cocok dengan koordinat. Cek <code>constants.ts</code>.
          </div>
      )}
    </Card>
  );
};

export default GisMap;