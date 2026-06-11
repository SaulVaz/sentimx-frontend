# SentiMX Frontend

Dashboard interactivo para análisis de sentimientos en español, construido con React y Recharts. Consume la SentiMX API deployada en Hugging Face Spaces.

## Demo

- **Frontend:** https://sentimx-frontend-ivory.vercel.app
- **API:** https://chesebread-sentimx-api.hf.space

## Características

- Análisis de texto individual con barra de confianza
- Análisis masivo de reviews desde archivo CSV
- Historial de los últimos 5 análisis
- Dashboard con gráficas de distribución (donut chart y bar chart)
- Tabla de resultados individuales con sentimiento y confianza

## Stack

- React
- Vite
- Tailwind CSS
- Recharts
- Axios
- Vercel

## Instalación local

```bash
git clone https://github.com/SaulVaz/sentimx-frontend.git
cd sentimx-frontend
npm install
```

Crea un archivo `.env` en la raíz:

```
VITE_API_URL=https://chesebread-sentimx-api.hf.space
```

Luego corre el proyecto:

```bash
npm run dev
```

Abre http://localhost:5173

## Proyecto relacionado

- [SentiMX API](https://github.com/SaulVaz/sentimx-api) — Backend FastAPI con modelo de NLP
