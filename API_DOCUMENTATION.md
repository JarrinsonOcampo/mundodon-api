# API MundoDonghua - Documentación

API REST para extraer datos de https://www.mundodonghua.com/ usando Web Scraping con Node.js, Cheerio y Express.

## 📋 Características

- ✅ Headers configurados para evitar error 403
- ✅ Selectores actualizados para mundodonghua.com
- ✅ Formato de respuesta JSON estructurado
- ✅ Manejo de errores robusto
- ✅ Endpoints para últimos episodios, búsqueda, lista completa y detalles

## 🚀 Endpoints Disponibles

### 1. Obtener Últimos Episodios

**GET** `/api/latestAnimes`

Obtiene los últimos episodios agregados en la página principal.

**Respuesta:**
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

**Ejemplo:**
```bash
curl http://localhost:3000/api/latestAnimes
```

---

### 2. Obtener Lista Completa de Donghuas

**GET** `/api/donghuas`

Obtiene la lista completa de donghuas disponibles desde `/lista-donghuas`.

**Respuesta:**
```json
{
  "donghuas": [
    {
      "titulo": "Nombre del Donghua",
      "url_slug": "/donghua/slug-del-donghua",
      "thumbnail": "https://cdn.mundodonghua.com/img/...",
      "generos": ["Acción", "Aventura", "Fantasía"],
      "tipo": "Donghua"
    }
  ],
  "total": 150
}
```

**Ejemplo:**
```bash
curl http://localhost:3000/api/donghuas
```

---

### 3. Obtener Detalle de un Donghua

**GET** `/api/donghua/:slug`

Obtiene información detallada de un donghua específico incluyendo sinopsis, estado, géneros y lista de capítulos.

**Parámetros:**
- `slug` - El slug del donghua (ejemplo: `sword-snow-stride`)

**Respuesta:**
```json
{
  "titulo": "Nombre del Donghua",
  "sinopsis": "Descripción completa del donghua...",
  "estado": "En emisión",
  "thumbnail": "https://cdn.mundodonghua.com/img/...",
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

**Ejemplo:**
```bash
curl http://localhost:3000/api/donghua/sword-snow-stride
```

---

### 4. Buscar Donghua

**GET** `/api/search/:title`

Busca donghuas por título.

**Parámetros:**
- `title` - Título o palabras clave a buscar

**Respuesta:**
```json
{
  "animes": [
    {
      "titulo": "Nombre del Donghua",
      "url_slug": "/donghua/slug",
      "thumbnail": "https://...",
      "tipo": "Donghua"
    }
  ]
}
```

**Ejemplo:**
```bash
curl http://localhost:3000/api/search/soul%20land
```

---

### 5. Obtener Información de Video

**GET** `/api/video/:id/:chapter`

Obtiene los servidores de video disponibles para un episodio.

**Parámetros:**
- `id` - ID o slug del donghua
- `chapter` - Número del capítulo

**Respuesta:**
```json
{
  "video": [
    {
      "server": "Servidor 1",
      "iframe": "https://player.example.com/...",
      "video": "https://player.example.com/..."
    }
  ]
}
```

**Ejemplo:**
```bash
curl http://localhost:3000/api/video/nombre-donghua/135
```

---

### 6. Obtener OVAs

**GET** `/api/ovas/:page`

Obtiene una lista de OVAs disponibles.

**Parámetros:**
- `page` - Número de página

**Respuesta:**
```json
{
  "ovas": [
    {
      "titulo": "Nombre OVA",
      "url_slug": "/ver/...",
      "thumbnail": "https://...",
      "tipo": "OVA"
    }
  ]
}
```

---

### 7. Obtener Películas

**GET** `/api/movies/:page`

Obtiene una lista de películas disponibles.

**Parámetros:**
- `page` - Número de página

**Respuesta:**
```json
{
  "movies": [
    {
      "titulo": "Nombre Película",
      "url_slug": "/ver/...",
      "thumbnail": "https://...",
      "tipo": "Película"
    }
  ]
}
```

---

### 8. Obtener por Género

**GET** `/api/genres/:genre/:page`

Obtiene donghuas por género.

**Parámetros:**
- `genre` - Nombre del género (acción, aventura, etc.)
- `page` - Número de página

**Ejemplo:**
```bash
curl http://localhost:3000/api/genres/accion/1
```

---

### 9. Obtener por Letra

**GET** `/api/letter/:letter/:page`

Obtiene donghuas que empiezan con una letra específica.

**Parámetros:**
- `letter` - Letra (A-Z)
- `page` - Número de página

**Ejemplo:**
```bash
curl http://localhost:3000/api/letter/S/1
```

---

### 10. Obtener Horario

**GET** `/api/schedule/:day`

Obtiene el horario de emisión para un día específico.

**Parámetros:**
- `day` - Día de la semana (lunes, martes, etc.)

**Ejemplo:**
```bash
curl http://localhost:3000/api/schedule/lunes
```

---

## 🔧 Configuración

### Headers Utilizados

Para evitar el error 403, se utilizan los siguientes headers en todas las peticiones:

```javascript
const headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  "Accept-Language": "es-ES,es;q=0.9,en;q=0.8"
};
```

### Selectores CSS Utilizados

- **Tarjetas de episodios:** `.col-6.col-sm-6.col-md-4.col-lg-3.mb-4`
- **Título:** `h5` o atributo `title` del enlace
- **Episodio:** `.episode, span[class*="episode"]`
- **Imagen:** `img[src]`
- **Sinopsis:** `#sinopsis` o `.description`
- **Lista de capítulos:** `#episode-list a`
- **Géneros:** `.genre-link`

---

## 📦 Instalación y Uso

### 1. Instalar dependencias

```bash
npm install
```

### 2. Iniciar el servidor

```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

### 3. Modo desarrollo (con auto-reload)

```bash
npm run dev
```

---

## 🧪 Pruebas

### Probar endpoint de últimos episodios

```bash
curl http://localhost:3000/api/latestAnimes
```

### Probar búsqueda

```bash
curl http://localhost:3000/api/search/soul%20land
```

### Probar lista completa

```bash
curl http://localhost:3000/api/donghuas
```

### Probar detalle

```bash
curl http://localhost:3000/api/donghua/sword-snow-stride
```

---

## ⚠️ Notas Importantes

1. **Rate Limiting:** Considera implementar rate limiting para no sobrecargar el servidor de mundodonghua.com
2. **Caché:** Se recomienda implementar un sistema de caché para mejorar el rendimiento.
3. **User-Agent:** Es obligatorio usar el User-Agent configurado para evitar bloqueos.
4. **Términos de Servicio:** Asegúrate de cumplir con los términos de servicio del sitio web.
5. **Actualización de Selectores:** Los selectores CSS pueden cambiar si el sitio actualiza su estructura HTML.

---

## 🐛 Troubleshooting

### Error 403 Forbidden

Si recibes este error, verifica que los headers estén correctamente configurados:

```javascript
const headers = {
  "User-Agent": "Mozilla/5.0 ..."
};
```

### No se encuentran elementos

Si no se extraen datos:
1. Verifica que los selectores CSS estén actualizados
2. Inspecciona el HTML del sitio para confirmar la estructura
3. Revisa los logs de errores en la consola

### Timeout o Errores de Conexión

- Verifica tu conexión a internet
- Confirma que mundodonghua.com esté accesible
- Aumenta el timeout si es necesario

---

## 📝 Licencia

MIT

---

## 👥 Contribuciones

Las contribuciones son bienvenidas. Por favor abre un issue primero para discutir los cambios que te gustaría hacer.
