import { useState } from "react"
import axios from "axios"
import { Send, Loader2 } from "lucide-react"

const API = import.meta.env.VITE_API_URL

const SENTIMENT_CONFIG = {
  positivo: { color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20", label: "Positivo" },
  negativo: { color: "text-red-400",     bg: "bg-red-400/10 border-red-400/20",         label: "Negativo" },
  neutro:   { color: "text-amber-400",   bg: "bg-amber-400/10 border-amber-400/20",     label: "Neutro"   },
}

export default function TextoAnalyzer() {
  const [texto, setTexto] = useState("")
  const [resultado, setResultado] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [historial, setHistorial] = useState([])

  async function analizar() {
    if (!texto.trim()) return
    setLoading(true)
    setError(null)
    try {
      const { data } = await axios.post(`${API}/analizar`, { texto })
      setResultado(data)
      setHistorial(prev => [data, ...prev].slice(0, 5))
    } catch {
      setError("Error al conectar con la API. Intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  const config = resultado ? SENTIMENT_CONFIG[resultado.sentimiento] : null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input */}
      <div className="space-y-4">
        <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
          <label className="text-sm text-gray-400 mb-3 block">Ingresa el texto a analizar</label>
          <textarea
            value={texto}
            onChange={e => setTexto(e.target.value)}
            placeholder="Ej: Excelente producto, llegó rápido y la calidad es increíble..."
            className="w-full bg-gray-800 rounded-xl p-4 text-sm text-white placeholder-gray-500 resize-none h-36 focus:outline-none focus:ring-2 focus:ring-violet-500 border border-gray-700"
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-gray-500">{texto.length}/512 caracteres</span>
            <button
              onClick={analizar}
              disabled={loading || !texto.trim()}
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed px-5 py-2 rounded-xl text-sm font-medium transition-all"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              {loading ? "Analizando..." : "Analizar"}
            </button>
          </div>
        </div>

        {/* Resultado */}
        {error && (
          <div className="bg-red-400/10 border border-red-400/20 rounded-2xl p-4 text-red-400 text-sm">
            {error}
          </div>
        )}
        {resultado && config && (
          <div className={`rounded-2xl p-5 border ${config.bg}`}>
            <p className="text-xs text-gray-400 mb-2">Resultado</p>
            <p className={`text-3xl font-semibold ${config.color}`}>{config.label}</p>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Confianza</span>
                <span>{(resultado.confianza * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    resultado.sentimiento === "positivo" ? "bg-emerald-400" :
                    resultado.sentimiento === "negativo" ? "bg-red-400" : "bg-amber-400"
                  }`}
                  style={{ width: `${resultado.confianza * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Historial */}
      <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
        <p className="text-sm text-gray-400 mb-4">Últimos análisis</p>
        {historial.length === 0 ? (
          <p className="text-gray-600 text-sm text-center mt-8">Aún no hay análisis</p>
        ) : (
          <div className="space-y-3">
            {historial.map((item, i) => {
              const c = SENTIMENT_CONFIG[item.sentimiento]
              return (
                <div key={i} className="bg-gray-800 rounded-xl p-3 flex items-start justify-between gap-3">
                  <p className="text-sm text-gray-300 truncate flex-1">{item.texto}</p>
                  <span className={`text-xs font-medium shrink-0 ${c.color}`}>{c.label}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}