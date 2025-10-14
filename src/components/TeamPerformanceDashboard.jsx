import { useEffect, useState } from "react";
import Papa from "papaparse";

/*
   Team Performance Dashboard.jsx
  - Data is mocked by default (20 rows)
  - There's a commented example showing how to fetch a published Google Sheet CSV via fetch + PapaParse
*/

export default function TeamPerformanceDashboard() {
  const [metricas, setMetricas] = useState([]);
  const [sprintFilter, setSprintFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    // 🔹 Ejemplo de carga de datos locales (mock) - 20 registros
    const ejemplo = [];
    const devs = ["Carlos", "Ana", "Luis"];
    const historias = ["Login API", "Registro Usuario", "Dashboard", "Notificaciones", "Perfil Usuario", "API Facturación", "Reportes", "Seguridad OAuth", "Optimización DB", "UI Mejoras", "Analytics", "Chat Interno", "Pagos", "Despliegue CI", "Monitoreo", "Logs Centralizados", "Pruebas Unitarias", "Automatización QA", "Seguridad JWT", "UI Dark Mode"];
    let sprint = 1;

    for (let i = 0; i < 20; i++) {
      const dev = devs[i % devs.length];
      const story = historias[i];
      // Algunos patrones para crear variedad, incluyendo casos 2/10 y 2/3
      const cycle = i % 6 === 0 ? 2 : i % 4 === 0 ? 2 : i % 3 === 0 ? 5 : 8;
      const lead = i % 5 === 0 ? 3 : (i % 2 === 0 ? 10 : 7);
      const bugs = i % 4 === 0 ? 0 : i % 3 === 0 ? 2 : 1;
      if (i % 7 === 0 && i !== 0) sprint++;
      ejemplo.push({
        Sprint: `Sprint ${sprint}`,
        Historia: story,
        Desarrollador: dev,
        "Fecha Inicio Sprint": "2025-10-01",
        "Fecha In Progress": "2025-10-02",
        "Fecha Ready for Deploy": "2025-10-05",
        "Fecha Producción": "2025-10-06",
        "Bugs reportados": bugs,
        "Cycle Time (días)": cycle,
        "Lead Time for Changes (días)": lead,
        // Link property kept internally for the Story link; not shown as separate column
        "Link Historia": `https://fake-link/${story.replace(/ /g, '-')}`
      });
    }
    setMetricas(ejemplo);
    setLoading(false);

    // 🔹 Ejemplo comentado para consumir datos desde Google Sheets (public CSV):
    // 1) Publica tu Google Sheet: Archivo -> Publicar en la web -> formato CSV -> copia el enlace.
    // 2) Usa PapaParse para convertir CSV a JSON y setMetricas(parsed).
    //
    // fetch('https://docs.google.com/spreadsheets/d/e/YOUR_PUB_ID/pub?output=csv')
    //   .then(res => res.text())
    //   .then(csv => {
    //     const parsed = Papa.parse(csv, { header: true }).data;
    //     // Asegúrate que las columnas en la hoja coincidan con las esperadas:
    //     // Sprint, Historia, Desarrollador, Cycle Time (días), Lead Time for Changes (días), Bugs reportados
    //     setMetricas(parsed);
    //   });
  }, []);

  const filtered = sprintFilter ? metricas.filter((m) => m.Sprint === sprintFilter) : metricas;
  const avgCycle = promedio(filtered, "Cycle Time (días)");
  const avgLead = promedio(filtered, "Lead Time for Changes (días)");
  const avgFlow = (avgCycle / avgLead) * 100 || 0;
  const devMetrics = agruparPorDesarrollador(filtered);
  const sprints = [...new Set(metricas.map((m) => m.Sprint))];

  const totalPages = Math.ceil(filtered.length / pageSize);
  const currentPageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Team Performance Dashboard</h1>
      {loading && <p>Cargando métricas...</p>}

      <div className="flex items-center space-x-4">
        <label className="font-medium">Filtrar por Sprint:</label>
        <select className="border p-2 rounded" value={sprintFilter} onChange={(e) => { setSprintFilter(e.target.value); setPage(1); }}>
          <option value="">Todos</option>
          {sprints.map((s, i) => (<option key={i} value={s}>{s}</option>))}
        </select>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className={`p-4 rounded-2xl shadow text-white ${colorCycleBg(avgCycle)}`}>
          <h2 className="text-lg font-semibold">Promedio Cycle Time</h2>
          <p className="text-xl font-bold">{avgCycle.toFixed(2)} días</p>
        </div>
        <div className={`p-4 rounded-2xl shadow text-white ${colorLeadBg(avgLead)}`}>
          <h2 className="text-lg font-semibold">Promedio Lead Time</h2>
          <p className="text-xl font-bold">{avgLead.toFixed(2)} días</p>
        </div>
        <div className={`p-4 rounded-2xl shadow text-white ${colorFlowBg(avgFlow)}`}>
          <h2 className="text-lg font-semibold">Promedio Flow Efficiency</h2>
          <p className="text-xl font-bold">{avgFlow.toFixed(2)}%</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-2">Promedios por Desarrollador</h2>
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr><th className="p-2 border">Desarrollador</th><th className="p-2 border">Cycle Time</th><th className="p-2 border">Lead Time</th><th className="p-2 border">Flow Efficiency</th></tr>
          </thead>
          <tbody>
            {devMetrics.map((d,i)=>{
              const flow=((d.avgCycle/d.avgLead)*100).toFixed(2);
              return (
                <tr key={i}>
                  <td className="p-2 border">{d.desarrollador}</td>
                  <td className={`p-2 border ${colorCycleClass(d.avgCycle)}`}>{d.avgCycle.toFixed(2)} días</td>
                  <td className={`p-2 border ${colorLeadClass(d.avgLead)}`}>{d.avgLead.toFixed(2)} días</td>
                  <td className={`p-2 border font-semibold ${colorFlowClass(flow)}`}>{flow}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-2">Detalle de Historias</h2>
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Sprint</th>
              <th className="p-2 border">Historia</th>
              <th className="p-2 border">Desarrollador</th>
              <th className="p-2 border">Cycle Time</th>
              <th className="p-2 border">Lead Time</th>
              <th className="p-2 border">Bugs</th>
              <th className="p-2 border">Flow Efficiency</th>
            </tr>
          </thead>
          <tbody>
            {currentPageData.map((m,i)=>{
              const flow=((m["Cycle Time (días)"]/m["Lead Time for Changes (días)"])*100).toFixed(2);
              return (
                <tr key={i}>
                  <td className="p-2 border">{m.Sprint}</td>
                  <td className="p-2 border text-blue-600 underline"><a href={m["Link Historia"]} target="_blank" rel="noreferrer">{m.Historia}</a></td>
                  <td className="p-2 border">{m.Desarrollador}</td>
                  <td className={`p-2 border ${colorCycleClass(m["Cycle Time (días)"])}`}>{m["Cycle Time (días)"]} días</td>
                  <td className={`p-2 border ${colorLeadClass(m["Lead Time for Changes (días)"])}`}>{m["Lead Time for Changes (días)"]} días</td>
                  <td className={`p-2 border ${m["Bugs reportados"]>0?"bg-red-100 text-red-800 font-semibold":""}`}>{m["Bugs reportados"]}</td>
                  <td className={`p-2 border font-semibold ${colorFlowClass(flow)}`}>{flow}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="flex justify-between mt-3">
          <button disabled={page===1} onClick={()=>setPage(page-1)} className="px-3 py-1 border rounded disabled:opacity-50">Anterior</button>
          <span>Página {page} de {totalPages}</span>
          <button disabled={page===totalPages} onClick={()=>setPage(page+1)} className="px-3 py-1 border rounded disabled:opacity-50">Siguiente</button>
        </div>
      </div>
    </div>
  );
}

function promedio(data, campo){
  const valores=data.map(m=>parseFloat(m[campo])).filter(v=>!isNaN(v));
  return valores.length?valores.reduce((a,b)=>a+b,0)/valores.length:0;
}
function agruparPorDesarrollador(data){
  const grupos={};
  data.forEach(m=>{const d=m.Desarrollador;if(!grupos[d])grupos[d]=[];grupos[d].push(m);});
  return Object.entries(grupos).map(([desarrollador,reg])=>({
    desarrollador,
    avgCycle:promedio(reg,"Cycle Time (días)"),
    avgLead:promedio(reg,"Lead Time for Changes (días)")
  }));
}
function colorCycleClass(v){if(v<=5)return"bg-green-100 text-green-800 font-semibold";if(v<10)return"bg-yellow-100 text-yellow-800 font-semibold";return"bg-red-100 text-red-800 font-semibold";}
function colorLeadClass(v){if(v<=5)return"bg-green-100 text-green-800 font-semibold";if(v<10)return"bg-yellow-100 text-yellow-800 font-semibold";return"bg-red-100 text-red-800 font-semibold";}
function colorFlowClass(v){if(v>60)return"bg-blue-100 text-blue-800 font-semibold";if(v>50)return"bg-yellow-100 text-yellow-800 font-semibold";return"bg-red-100 text-red-800 font-semibold";}
function colorCycleBg(v){if(v<=5)return"bg-green-500";if(v<10)return"bg-yellow-500";return"bg-red-500";}
function colorLeadBg(v){if(v<=5)return"bg-green-500";if(v<10)return"bg-yellow-500";return"bg-red-500";}
function colorFlowBg(v){if(v>60)return"bg-blue-500";if(v>50)return"bg-yellow-500";return"bg-red-500";}
