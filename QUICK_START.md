# 🎬 API MundoDonghua - Inicio Rápido

API REST para extraer datos de [mundodonghua.com](https://www.mundodonghua.com/) usando Web Scraping.

## ✨ Características

- ✅ **Node.js + Express** - API REST rápida y eficiente
- ✅ **Cheerio** - Web scraping (equivalente de BeautifulSoup para Node.js)
- ✅ **Headers configurados** - Evita error 403 Forbidden
- ✅ **Selectores actualizados** - Diseñado específicamente para mundodonghua.com
- ✅ **Formato JSON** - Respuestas estructuradas y fáciles de consumir

## 🚀 Inicio Rápido

### 1. Instalar dependencias

```bash
npm install
```

### 2. Iniciar servidor

```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

### 3. Probar la API

```bash
# Obtener últimos episodios
curl http://localhost:3000/api/latestAnimes

# Buscar un donghua
curl http://localhost:3000/api/search/soul%20land

# Obtener lista completa
curl http://localhost:3000/api/donghuas

# Obtener detalle de un donghua
curl http://localhost:3000/api/donghua/sword-snow-stride
```

## 📡 Endpoints Principales

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/latestAnimes` | GET | Últimos episodios agregados |
| `/api/donghuas` | GET | Lista completa de donghuas |
| `/api/donghua/:slug` | GET | Detalle de un donghua |
| `/api/search/:title` | GET | Buscar por título |
| `/api/video/:id/:chapter` | GET | Servidores de video |
| `/api/genres/:genre/:page` | GET | Filtrar por género |
| `/api/letter/:letter/:page` | GET | Filtrar por letra inicial |
| `/api/ovas/:page` | GET | Lista de OVAs |
| `/api/movies/:page` | GET | Lista de películas |
| `/api/schedule/:day` | GET | Horario de emisión |

## 📦 Estructura de Respuestas

### Últimos Episodios

```json
{
  "episodios": [
    {
      "titulo": "Nombre del Donghua",
      "episodio_nro": "135",
      "fecha": "2026-04-22",
      "url_slug": "/ver/nombre-del-donghua-135",
      "thumbnail": "https://cdn.mundodonghua.com/img/..."
    }
  ]
}
```

### Detalle de Donghua

```json
{
  "titulo": "Nombre del Donghua",
  "sinopsis": "Descripción completa...",
  "estado": "En emisión",
  "thumbnail": "https://...",
  "generos": ["Acción", "Aventura"],
  "capitulos": [
    {
      "numero": 1,
      "titulo": "Episodio 1",
      "url": "/ver/nombre-donghua-1"
    }
  ],
  "total_capitulos": 135
}
```

## 🐍 Cliente Python

Se incluye un cliente de ejemplo en Python para consumir la API:

```bash
# Instalar dependencias
pip install requests

# Ejecutar ejemplo
python ejemplo_cliente.py
```

## 🔧 Selectores CSS Utilizados

La API utiliza los siguientes selectores para extraer datos:

```javascript
// Tarjetas de episodios
".col-6.col-sm-6.col-md-4.col-lg-3.mb-4"

// Título
"h5" o atributo "title"

// Episodio
".episode, span[class*='episode']"

// Imagen
"img[src]"

// Sinopsis
"#sinopsis" o ".description"

// Capítulos
"#episode-list a"

// Géneros
".genre-link"
```

## 🛡️ Headers para Evitar Error 403

```javascript
const headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  "Accept-Language": "es-ES,es;q=0.9,en;q=0.8"
};
```

## 📚 Documentación Completa

Para más detalles, consulta [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## 🗂️ Estructura del Proyecto

```
jkanime/
├── src/
│   ├── api/
│   │   ├── api.js          # Funciones de scraping
│   │   ├── urls.js         # URLs del sitio
│   │   └── routes/
│   │       └── index.js    # Definición de rutas
│   ├── middlewares/
│   ├── app.js
│   └── index.js
├── ejemplo_cliente.py      # Cliente Python de ejemplo
├── API_DOCUMENTATION.md    # Documentación completa
├── package.json
└── README.md
```

## ⚙️ Scripts Disponibles

```bash
# Iniciar servidor de producción
npm start

# Modo desarrollo (auto-reload con nodemon)
npm run dev

# Linting
npm run lint

# Tests
npm test
```

## ⚠️ Consideraciones Importantes

1. **Rate Limiting** - Implementa límites de peticiones para no sobrecargar el servidor
2. **Caché** - Considera usar Redis o similar para cachear respuestas
3. **User-Agent** - Obligatorio para evitar bloqueos
4. **Términos de Servicio** - Respeta los términos del sitio web
5. **Mantenimiento** - Los selectores pueden cambiar si el sitio actualiza su HTML

## 🧪 Ejemplos de Prueba

### JavaScript (Fetch API)

```javascript
// Obtener últimos episodios
fetch('http://localhost:3000/api/latestAnimes')
  .then(res => res.json())
  .then(data => console.log(data.episodios));

// Buscar donghua
fetch('http://localhost:3000/api/search/soul land')
  .then(res => res.json())
  .then(data => console.log(data.animes));
```

### Python (requests)

```python
import requests

# Obtener últimos episodios
response = requests.get('http://localhost:3000/api/latestAnimes')
episodios = response.json()['episodios']

# Buscar donghua
response = requests.get('http://localhost:3000/api/search/soul land')
resultados = response.json()['animes']
```

### cURL

```bash
# Obtener lista completa
curl http://localhost:3000/api/donghuas | jq

# Buscar con pretty print
curl http://localhost:3000/api/search/soul%20land | jq '.animes[] | {titulo, url_slug}'

# Obtener detalle
curl http://localhost:3000/api/donghua/sword-snow-stride | jq
```

## 🐛 Solución de Problemas

### Error: Cannot find module 'cheerio'

```bash
npm install cheerio node-fetch axios
```

### Error 403 Forbidden

Verifica que los headers estén configurados correctamente en [api.js](./src/api/api.js)

### No se extraen datos

1. Inspecciona el HTML del sitio para verificar selectores
2. Revisa los logs de la consola
3. Usa herramientas de desarrollo del navegador para verificar la estructura

### Puerto 3000 en uso

Cambia el puerto en el archivo de configuración o:

```bash
PORT=8000 npm start
```

## 📄 Licencia

MIT - Ver archivo [LICENSE](./LICENSE)

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📧 Contacto

Para preguntas o sugerencias, abre un issue en el repositorio.

---

**Nota**: Esta API es para fines educativos y de demostración. Asegúrate de cumplir con los términos de servicio del sitio web al usarla.
