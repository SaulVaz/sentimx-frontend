import { useState } from "react"
import TextoAnalyzer from "./components/TextoAnalyzer"
import CSVAnalyzer from "./components/CSVAnalyzer"
import { BarChart2 } from "lucide-react"

export default function App() {
  const [tab, setTab] = useState("texto")

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <BarChart2 className="text-violet-400" size={28} />
          <div>
            <h1 className="text-xl font-semibold tracking-tight">SentiMX</h1>
            <p className="text-xs text-gray-400">Análisis de sentimientos en español</p>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-5xl mx-auto px-6 mt-8">
        <div className="flex gap-2 bg-gray-900 p-1 rounded-xl w-fit">
          <button
            onClick={() => setTab("texto")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === "texto"
                ? "bg-violet-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Texto individual
          </button>
          <button
            onClick={() => setTab("csv")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === "csv"
                ? "bg-violet-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Análisis CSV
          </button>
        </div>

        {/* Content */}
        <div className="mt-6">
          {tab === "texto" ? <TextoAnalyzer /> : <CSVAnalyzer />}
        </div>
      </div>
    </div>
  )
}