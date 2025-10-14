# Dora Metrics Dashboard

Pequeña app React (Vite) para visualizar métricas DORA y métricas de flujo (Cycle Time, Lead Time, Flow Efficiency).

## Estructura del proyecto
- `index.html` - punto de entrada.
- `src/main.jsx` - arranca React.
- `src/App.jsx` - componente raíz.
- `src/components/DoraMetricsDashboard.jsx` - componente principal con lógica y UI.
- `src/styles.css` - estilos básicos.
- `package.json` - scripts y dependencias.

## Qué muestra la app
1. **Promedio general** (cards):
   - Promedio Cycle Time (días) — fondo de la card coloreado según umbrales.
   - Promedio Lead Time (días) — fondo de la card coloreado.
   - Promedio Flow Efficiency (%) — fondo coloreado.
2. **Promedios por desarrollador**:
   - Cycle Time (promedio) — color por valor.
   - Lead Time (promedio) — color por valor.
   - Flow Efficiency (promedio) — color por valor.
3. **Tabla de detalle**:
   - Sprint
   - Historia (nombre como link a una URL ficticia)
   - Desarrollador
   - Cycle Time (días)
   - Lead Time (días)
   - Bugs reportados (si >0 se marca en rojo)
   - Flow Efficiency (%)
   - Paginación: 10 resultados por página.

## Fórmulas y definiciones
- **Cycle Time**: tiempo activo de la tarea (In Progress -> Ready for Deploy). En la tabla de ejemplo está en la columna `Cycle Time (días)`.
- **Lead Time for Changes (LTC)**: tiempo total desde que la tarea entra en el sistema hasta deploy (en la tabla `Lead Time for Changes (días)`).
- **Flow Efficiency**:
```
Flow Efficiency (%) = (Cycle Time / Lead Time) * 100
```
Se calcula por historia y por desarrollador (promedio).

## Cómo ejecutar (local)
1. Instala dependencias:
```bash
npm install
```
2. Levanta el dev server:
```bash
npm run dev
```
3. Abre `http://localhost:5173` (o la URL que muestre Vite).

## Conectar Google Sheets (opcional)
- Publica tu hoja: **Archivo -> Publicar en la web** -> seleccionar hoja -> formato CSV.
- Copia el enlace (`.../pub?output=csv`) y descomenta el bloque de `fetch` en `DoraMetricsDashboard.jsx`.
- Asegúrate que las columnas de la hoja coincidan con:
  - `Sprint`, `Historia`, `Desarrollador`, `Cycle Time (días)`, `Lead Time for Changes (días)`, `Bugs reportados`
- La app usa `papaparse` para parsear CSV.

## Despliegue en Vercel
1. Crea un repositorio Git con estos archivos.
2. Conecta el repositorio en Vercel.
3. Vercel detectará Vite y desplegará automáticamente.
- Build command: `npm run build`
- Output directory: `dist`

## Notas
- Los colores y umbrales son configurables en los helpers al final del archivo `DoraMetricsDashboard.jsx`.
- Si quieres lectura/escritura segura desde Google Sheets, lo ideal es crear una API intermedia con credenciales (Service Account).

