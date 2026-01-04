import React, { useMemo } from 'react';
import { ArrowLeftRight, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, WrappedYAxisTick, EmptyState } from './elements';
import { REGIONS } from './constants';

const RegionComparison = ({ dbData, selectedYear, currentIndicator, region1, setRegion1, region2, setRegion2 }: any) => {
  const availableRegions = useMemo(() => {
    const rawData = dbData[currentIndicator.table_name] || [];
    const names = [...new Set(rawData.map((r:any) => r.kabupatenkota))]
      .filter((n:any) => n && String(n).trim().toLowerCase() !== 'jawa timur')
      .sort();
    
    if (names.length > 0) return names;
    
    // Fallback 
    return Array.isArray(REGIONS) 
      ? REGIONS.map((r:any) => r.name).sort() 
      : Object.keys(REGIONS).sort();
  }, [dbData, currentIndicator]);

  const comparisonData = useMemo(() => {
    const tableData = dbData[currentIndicator.table_name] || [];
    const normalize = (str: string) => String(str).trim().toLowerCase();
    const targetYear = String(selectedYear);
    
    const dataR1 = tableData.filter((r:any) => normalize(r.kabupatenkota) === normalize(region1) && String(r.tahun) === targetYear);
    const dataR2 = tableData.filter((r:any) => normalize(r.kabupatenkota) === normalize(region2) && String(r.tahun) === targetYear);
    
    const dynamicCats = new Set([...dataR1.map((r:any)=>r.kategori), ...dataR2.map((r:any)=>r.kategori)]);
    const categoriesToUse = dynamicCats.size > 0 ? Array.from(dynamicCats).sort() : currentIndicator.categories;
    
    return categoriesToUse.map((cat:any) => ({ 
      category: cat, 
      val1: dataR1.find((r:any)=>normalize(r.kategori)===normalize(cat))?.jumlah || 0, 
      val2: dataR2.find((r:any)=>normalize(r.kategori)===normalize(cat))?.jumlah || 0 
    }));
  }, [region1, region2, selectedYear, currentIndicator, dbData]);

  const comparisonTotal = useMemo(() => ({
    r1: { name: region1, value: comparisonData.reduce((acc:number, curr:any) => acc + curr.val1, 0) },
    r2: { name: region2, value: comparisonData.reduce((acc:number, curr:any) => acc + curr.val2, 0) },
    isEmpty: comparisonData.every((c:any) => c.val1 === 0 && c.val2 === 0)
  }), [comparisonData, region1, region2]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
      {/* Selection Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <Card className="lg:col-span-5 p-6 border-t-4 border-t-pink-500 bg-pink-50/30">
          <label className="text-xs font-bold text-pink-500 uppercase mb-2 block flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-pink-500"></div> Wilayah A
          </label>
          <select 
            value={region1} 
            onChange={(e) => setRegion1(e.target.value)} 
            className="w-full text-xl font-bold text-slate-800 bg-white border border-pink-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500"
          >
            {availableRegions.map((r:any) => <option key={r} value={r}>{r}</option>)}
          </select>
          <div className="mt-8">
            <p className="text-sm text-slate-500 mb-1">Total {currentIndicator.unit} ({selectedYear})</p>
            <span className="text-4xl font-extrabold text-pink-600 tracking-tight">
              {comparisonTotal.r1.value.toLocaleString()}
            </span>
          </div>
        </Card>
        
        <div className="lg:col-span-2 flex flex-col justify-center items-center py-4 lg:py-0">
          <div className="bg-white p-3 rounded-full shadow-sm border border-slate-100 mb-2">
            <ArrowLeftRight className="text-slate-300" size={24} />
          </div>
          <div className="text-center">
            <p className="text-xs font-bold text-slate-400 uppercase">Selisih</p>
            <p className="text-lg font-bold text-slate-700">
              {Math.abs(comparisonTotal.r1.value - comparisonTotal.r2.value).toLocaleString()}
            </p>
          </div>
        </div>

        <Card className="lg:col-span-5 p-6 border-t-4 border-t-purple-500 bg-purple-50/30">
          <label className="text-xs font-bold text-purple-500 uppercase mb-2 block flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-500"></div> Wilayah B
          </label>
          <select 
            value={region2} 
            onChange={(e) => setRegion2(e.target.value)} 
            className="w-full text-xl font-bold text-slate-800 bg-white border border-purple-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
          >
            {availableRegions.map((r:any) => <option key={r} value={r}>{r}</option>)}
          </select>
          <div className="mt-8 text-right lg:text-left">
            <p className="text-sm text-slate-500 mb-1">Total {currentIndicator.unit} ({selectedYear})</p>
            <span className="text-4xl font-extrabold text-purple-600 tracking-tight">
              {comparisonTotal.r2.value.toLocaleString()}
            </span>
          </div>
        </Card>
      </div>

      {/* Chart Section or Empty State */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-slate-800">Perbandingan Kategori ({selectedYear})</h3>
        </div>
        
        {comparisonTotal.isEmpty ? (
           <div className="h-[400px] flex items-center justify-center">
             <EmptyState 
                title="Data Komparasi Tidak Ditemukan"
                message={<span>Tidak ada data statistik untuk <strong>{region1}</strong> dan <strong>{region2}</strong> pada tahun {selectedYear}.</span>}
             />
           </div>
        ) : (
          <div className="h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                key={`${region1}-${region2}-${selectedYear}`} 
                data={comparisonData} 
                layout="vertical" 
                barGap={4} 
                margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" axisLine={false} tickLine={false} fontSize={12} />
                <YAxis 
                  dataKey="category" 
                  type="category" 
                  width={160} 
                  axisLine={false} 
                  tickLine={false} 
                  fontSize={11} 
                  fontWeight={600} 
                  tick={<WrappedYAxisTick />} 
                />
                <Tooltip cursor={{fill: '#fce7f3'}} contentStyle={{borderRadius: '8px'}} />
                <Legend verticalAlign="bottom" height={36}/>
                <Bar dataKey="val1" fill="#db2777" name={region1} radius={[0, 4, 4, 0]} barSize={20} />
                <Bar dataKey="val2" fill="#9333ea" name={region2} radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>
    </div>
  );
};
export default RegionComparison;