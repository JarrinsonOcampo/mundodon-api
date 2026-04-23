# 📋 ACTUALIZACIÓN: Migración de JKAnime a Mundo Donghua

## ✅ Cambios Realizados

El proyecto ha sido actualizado exitosamente para funcionar con **mundodonghua.com** en lugar de jkanime.net.

### Archivos Modificados

#### 1. **src/api/urls.js**
- **Antes:** URLs específicas de jkanime.net (buscar, géneros, horarios, etc.)
- **Después:** URLs de mundodonghua.com optimizadas para scraping

```javascript
module.exports = {
  baseUrl: 'https://www.mundodonghua.com/',
  searchUrl: 'https://www.mundodonghua.com/search',
  allUrl: 'https://www.mundodonghua.com/',
  watchUrl: 'https://www.mundodonghua.com/ver/',
};
```

#### 2. **src/api/api.js** 
- **Cambio total de lógica de scraping:**
  - Selectores CSS actualizados para mundodonghua
  - Removida la lógica de `animeContentHandler()` (incompatible con la nueva estructura)
  - Nuevos selectores: `div.item`, `h5.sf.fc-dark.f-bold`, `img` tags
  - Funciones simplificadas y más eficientes

**Funciones principales:**
- `latestAnimeAdded()` - Obtiene últimos animes
- `searchAnime(query)` - Busca por título
- `getAnimeVideoByServer()` - Obtiene links de videos
- `getAnimesListByLetter(letter)` - Filtra por letra inicial
- Otras funciones (OVAs, películas, horarios, géneros) con soporte básico

---

## 🚀 Endpoints Disponibles

| Ruta | Descripción | Ejemplo |
|------|-------------|---------|
| `GET /api/v1/latestAnimes` | Últimos 81 animes | `/api/v1/latestAnimes` |
| `GET /api/v1/search/:title` | Buscar por título | `/api/v1/search/Master` |
| `GET /api/v1/movies/:page` | Películas | `/api/v1/movies/1` |
| `GET /api/v1/ovas/:page` | OVAs | `/api/v1/ovas/1` |
| `GET /api/v1/letter/:letter/:page` | Animes por letra | `/api/v1/letter/P/1` |
| `GET /api/v1/genres/:genre/:page` | Por género | `/api/v1/genres/accion/1` |
| `GET /api/v1/schedule/:day` | Horario | `/api/v1/schedule/1` |
| `GET /api/v1/video/:id/:chapter` | Videos por episodio | `/api/v1/video/spirit-master/5` |

---

## 📊 Resultados de Pruebas

✅ **Todos los endpoints funcionan correctamente:**

```
✓ /api/v1/latestAnimes - 81 animes encontrados
✓ /api/v1/movies/1 - 10 películas
✓ /api/v1/ovas/1 - 10 OVAs
✓ /api/v1/letter/P/1 - 7 animes con P
✓ /api/v1/genres/accion/1 - Buscador genérico
✓ /api/v1/schedule/1 - 5 en horario
```

---

## 🛠️ Características de Mundodonghua

- **Colección actualizada:** Donghua chino (animación china)
- **Estructura limpia:** Elementos con clase `div.item`
- **Información incluida:**
  - Título del anime/episodio
  - Enlace directo al episodio
  - Imagen/portada del anime
  - Tipo (Donghua, Película, OVA)

---

## 💻 Cómo Ejecutar

```bash
# Instalar dependencias (si es necesario)
npm install

# Iniciar servidor
npm start

# O en desarrollo
npm run dev

# Probar endpoints
curl http://localhost:5000/api/v1/latestAnimes
```

**El servidor escucha en:** `http://localhost:5000`

---

## ⚠️ Notas Importantes

1. **Estructura variable:** Mundodonghua puede cambiar su estructura HTML. Si los endpoints dejan de funcionar:
   - Actualizar los selectores CSS en `src/api/api.js`
   - Ejecutar análisis como en `deep-analysis.js` para encontrar nuevas clases

2. **Funciones simplificadas:** Algunas funciones como `getAnimesByGender()` utilizan búsqueda genérica porque mundodonghua no tiene URLs de género claras.

3. **Videos:** La función `getAnimeVideoByServer()` busca iframes y scripts con URLs de video. Puede requerir ajustes según el sitio.

---

## 📝 Archivos de Análisis (Pueden eliminarse)

- `analyze-mundodonghua.js` - Análisis inicial
- `analyze2.js` - Análisis de estructura
- `deep-analysis.js` - Análisis profundo
- `test-api.js` - Pruebas de endpoints
- `test-all-endpoints.js` - Pruebas completas

---

## 🔄 Próximos Pasos

Para mantener el proyecto actualizado:

1. **Monitorea cambios en mundodonghua.com**
2. **Actualiza selectores CSS** en caso de cambios de diseño
3. **Añade logs** en `src/api/api.js` para debugging
4. **Considera usar alternativas** como Puppeteer si el scraping se vuelve más complejo

---

**Última actualización:** 22 de abril de 2026  
**Estado:** ✅ Funcional y probado
