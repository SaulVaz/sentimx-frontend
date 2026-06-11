import { useState, useRef } from "react"
import axios from "axios"
import { Upload, Loader2, FileText } from "lucide-react"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"

const API = import.meta.env.VITE_API_URL
const COLORS = { positivo: "#34d399", negativo: "#f87171", neutro: "#fbbf24" }

export default function CSVAnalyzer() {
  const [resultado, setResultado] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [filename, setFilename] = useState(null)
  const inputRef = useRef()

  async function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    setFilename(file.name)
    setLoading(true)
    setError(null)
    const formData = new FormData()
    formData.append("file", file)
    try {
      const { data } = await axios.post(`${API}/analizar-csv`, formData)
      setResultado(data)
    } catch {
      setError("Error al analizar el CSV. Verifica que tenga una columna 'texto'.")
    } finally {
      setLoading(false)
    }
  }

  const pieData = resultado ? [
    { name: "Positivo", value: resultado.resumen.positivos },
    { name: "Negativo", value: resultado.resumen.negativos },
    { name: "Neutro",   value: resultado.resumen.neutros   },
  ] : []

  const barData = resultado ? [
    { name: "Positivo", valor: resultado.resumen.pct_positivo },
    { name: "Negativo", valor: resultado.resumen.pct_negativo },
    { name: "Neutro",   valor: resultado.resumen.pct_neutro   },
  ] : []

  return (
    <div className="space-y-6">
      {/* Upload */}
      <div
        onClick={() => inputRef.current.click()}
        className="bg-gray-900 border-2 border-dashed border-gray-700 hover:border-violet-500 rounded-2xl p-10 text-center cursor-pointer transition-all"
      >
        <input ref={inputRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />
        {loading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={32} className="animate-spin text-violet-400" />
            <p className="text-gray-400 text-sm">Analizando {filename}...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Upload size={32} className="text-gray-500" />
            <p className="text-gray-300 font-medium">Sube tu archivo CSV</p>
            <p className="text-gray-500 text-sm">Debe tener una columna llamada <code className="text-violet-400">texto</code></p>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-400/10 border border-red-400/20 rounded-2xl p-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Resultados */}
      {resultado && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Positivos", value: resultado.resumen.positivos, pct: resultado.resumen.pct_positivo, color: "text-emerald-400" },
              { label: "Negativos", value: resultado.resumen.negativos, pct: resultado.resumen.pct_negativo, color: "text-red-400" },
              { label: "Neutros",   value: resultado.resumen.neutros,   pct: resultado.resumen.pct_neutro,   color: "text-amber-400" },
            ].map(s => (
              <div key={s.label} className="bg-gray-900 rounded-2xl p-5 border border-gray-800 text-center">
                <p className={`text-3xl font-semibold ${s.color}`}>{s.value}</p>
                <p className="text-gray-400 text-sm mt-1">{s.label}</p>
                <p className="text-gray-500 text-xs mt-1">{s.pct}%</p>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
              <p className="text-sm text-gray-400 mb-4">Distribución</p>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={3}>
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={COLORS[entry.name.toLowerCase()]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [`${v} reviews`, ""]} contentStyle={{ background: "#111827", border: "1px solid #374151", borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
              <p className="text-sm text-gray-400 mb-4">Porcentaje por clase</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={barData} barSize={40}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} unit="%" />
                  <Tooltip formatter={(v) => [`${v}%`, "Porcentaje"]} contentStyle={{ background: "#111827", border: "1px solid #374151", borderRadius: 8 }} />
                  <Bar dataKey="valor" radius={[6, 6, 0, 0]}>
                    {barData.map((entry) => (
                      <Cell key={entry.name} fill={COLORS[entry.name.toLowerCase()]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tabla */}
          <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
            <div className="flex items-center gap-2 mb-4">
              <FileText size={16} className="text-gray-400" />
              <p className="text-sm text-gray-400">Resultados individuales ({resultado.total} reviews)</p>
            </div>
            <div className="overflow-auto max-h-64">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 text-left border-b border-gray-800">
                    <th className="pb-3 font-medium">Texto</th>
                    <th className="pb-3 font-medium w-28">Sentimiento</th>
                    <th className="pb-3 font-medium w-24">Confianza</th>
                  </tr>
                </thead>
                <tbody>
                  {resultado.resultados.map((r, i) => (
                    <tr key={i} className="border-b border-gray-800/50">
                      <td className="py-2 text-gray-300 pr-4 truncate max-w-xs">{r.texto}</td>
                      <td className={`py-2 font-medium ${
                        r.sentimiento === "positivo" ? "text-emerald-400" :
                        r.sentimiento === "negativo" ? "text-red-400" : "text-amber-400"
                      }`}>{r.sentimiento}</td>
                      <td className="py-2 text-gray-400">{(r.confianza * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}