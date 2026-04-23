"""
Ejemplo de Cliente Python para la API de MundoDonghua

Este script muestra cómo consumir la API REST de MundoDonghua
usando Python y requests.

Requisitos:
    pip install requests

Uso:
    python ejemplo_cliente.py
"""

import requests
import json
from typing import List, Dict, Optional

# Configuración
BASE_URL = "http://localhost:3000/api"

class MundoDonghuaAPI:
    """Cliente para la API de MundoDonghua"""
    
    def __init__(self, base_url: str = BASE_URL):
        self.base_url = base_url
        self.session = requests.Session()
        
    def obtener_ultimos_episodios(self) -> List[Dict]:
        """
        Obtiene los últimos episodios agregados
        
        Returns:
            List[Dict]: Lista de episodios con estructura:
            {
                "titulo": str,
                "episodio_nro": str,
                "fecha": str,
                "url_slug": str,
                "thumbnail": str
            }
        """
        try:
            response = self.session.get(f"{self.base_url}/latestAnimes")
            response.raise_for_status()
            data = response.json()
            return data.get('episodios', [])
        except requests.exceptions.RequestException as e:
            print(f"Error al obtener últimos episodios: {e}")
            return []
    
    def obtener_lista_donghuas(self) -> List[Dict]:
        """
        Obtiene la lista completa de donghuas
        
        Returns:
            List[Dict]: Lista de donghuas
        """
        try:
            response = self.session.get(f"{self.base_url}/donghuas")
            response.raise_for_status()
            data = response.json()
            return data.get('donghuas', [])
        except requests.exceptions.RequestException as e:
            print(f"Error al obtener lista de donghuas: {e}")
            return []
    
    def obtener_detalle_donghua(self, slug: str) -> Optional[Dict]:
        """
        Obtiene el detalle de un donghua específico
        
        Args:
            slug (str): Slug del donghua (ej: "sword-snow-stride")
            
        Returns:
            Optional[Dict]: Información del donghua con:
            {
                "titulo": str,
                "sinopsis": str,
                "estado": str,
                "thumbnail": str,
                "generos": List[str],
                "capitulos": List[Dict],
                "total_capitulos": int
            }
        """
        try:
            response = self.session.get(f"{self.base_url}/donghua/{slug}")
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error al obtener detalle del donghua: {e}")
            return None
    
    def buscar_donghua(self, titulo: str) -> List[Dict]:
        """
        Busca donghuas por título
        
        Args:
            titulo (str): Título o palabras clave a buscar
            
        Returns:
            List[Dict]: Lista de resultados
        """
        try:
            response = self.session.get(f"{self.base_url}/search/{titulo}")
            response.raise_for_status()
            data = response.json()
            return data.get('animes', [])
        except requests.exceptions.RequestException as e:
            print(f"Error al buscar donghua: {e}")
            return []
    
    def obtener_servidores_video(self, id_donghua: str, capitulo: str) -> List[Dict]:
        """
        Obtiene los servidores de video para un episodio
        
        Args:
            id_donghua (str): ID o slug del donghua
            capitulo (str): Número del capítulo
            
        Returns:
            List[Dict]: Lista de servidores con URLs de video
        """
        try:
            response = self.session.get(f"{self.base_url}/video/{id_donghua}/{capitulo}")
            response.raise_for_status()
            data = response.json()
            return data.get('video', [])
        except requests.exceptions.RequestException as e:
            print(f"Error al obtener servidores de video: {e}")
            return []
    
    def obtener_por_genero(self, genero: str, pagina: int = 1) -> List[Dict]:
        """
        Obtiene donghuas por género
        
        Args:
            genero (str): Nombre del género (acción, aventura, etc.)
            pagina (int): Número de página
            
        Returns:
            List[Dict]: Lista de donghuas del género
        """
        try:
            response = self.session.get(f"{self.base_url}/genres/{genero}/{pagina}")
            response.raise_for_status()
            data = response.json()
            return data.get('animes', [])
        except requests.exceptions.RequestException as e:
            print(f"Error al obtener por género: {e}")
            return []
    
    def obtener_por_letra(self, letra: str, pagina: int = 1) -> List[Dict]:
        """
        Obtiene donghuas que empiezan con una letra
        
        Args:
            letra (str): Letra (A-Z)
            pagina (int): Número de página
            
        Returns:
            List[Dict]: Lista de donghuas
        """
        try:
            response = self.session.get(f"{self.base_url}/letter/{letra.upper()}/{pagina}")
            response.raise_for_status()
            data = response.json()
            return data.get('animes', [])
        except requests.exceptions.RequestException as e:
            print(f"Error al obtener por letra: {e}")
            return []


def ejemplo_uso():
    """Ejemplos de uso de la API"""
    
    # Crear instancia del cliente
    api = MundoDonghuaAPI()
    
    print("=" * 60)
    print("EJEMPLO DE USO - API MUNDODONGHUA")
    print("=" * 60)
    
    # 1. Obtener últimos episodios
    print("\n1. ÚLTIMOS EPISODIOS:")
    print("-" * 60)
    episodios = api.obtener_ultimos_episodios()
    for i, ep in enumerate(episodios[:5], 1):
        print(f"{i}. {ep['titulo']} - Episodio {ep.get('episodio_nro', 'N/A')}")
        print(f"   URL: {ep['url_slug']}")
    
    # 2. Buscar un donghua
    print("\n2. BÚSQUEDA DE DONGHUA:")
    print("-" * 60)
    busqueda = input("Ingresa el título a buscar (o presiona Enter para 'soul land'): ").strip()
    if not busqueda:
        busqueda = "soul land"
    
    resultados = api.buscar_donghua(busqueda)
    print(f"\nResultados para '{busqueda}':")
    for i, resultado in enumerate(resultados[:5], 1):
        print(f"{i}. {resultado['titulo']}")
        print(f"   URL: {resultado['url_slug']}")
    
    # 3. Obtener detalle de un donghua
    if resultados:
        print("\n3. DETALLE DE DONGHUA:")
        print("-" * 60)
        primer_resultado = resultados[0]
        slug = primer_resultado['url_slug'].split('/')[-1]
        
        detalle = api.obtener_detalle_donghua(slug)
        if detalle:
            print(f"Título: {detalle.get('titulo', 'N/A')}")
            print(f"Estado: {detalle.get('estado', 'N/A')}")
            print(f"Géneros: {', '.join(detalle.get('generos', []))}")
            print(f"Total de capítulos: {detalle.get('total_capitulos', 0)}")
            print(f"\nSinopsis: {detalle.get('sinopsis', 'N/A')[:200]}...")
    
    # 4. Obtener por género
    print("\n4. DONGHUAS POR GÉNERO (Acción):")
    print("-" * 60)
    por_genero = api.obtener_por_genero('accion', 1)
    for i, donghua in enumerate(por_genero[:5], 1):
        print(f"{i}. {donghua['titulo']}")
    
    # 5. Obtener lista completa
    print("\n5. LISTA COMPLETA DE DONGHUAS:")
    print("-" * 60)
    lista = api.obtener_lista_donghuas()
    print(f"Total de donghuas disponibles: {len(lista)}")
    print("\nPrimeros 10:")
    for i, donghua in enumerate(lista[:10], 1):
        print(f"{i}. {donghua['titulo']}")
        if donghua.get('generos'):
            print(f"   Géneros: {', '.join(donghua['generos'])}")
    
    print("\n" + "=" * 60)
    print("FIN DE EJEMPLOS")
    print("=" * 60)


def exportar_a_json(datos: List[Dict], archivo: str):
    """
    Exporta los datos a un archivo JSON
    
    Args:
        datos: Lista de diccionarios a exportar
        archivo: Ruta del archivo de salida
    """
    with open(archivo, 'w', encoding='utf-8') as f:
        json.dump(datos, f, ensure_ascii=False, indent=2)
    print(f"Datos exportados a {archivo}")


def ejemplo_exportar():
    """Ejemplo de cómo exportar datos a JSON"""
    api = MundoDonghuaAPI()
    
    # Exportar últimos episodios
    episodios = api.obtener_ultimos_episodios()
    exportar_a_json(episodios, 'ultimos_episodios.json')
    
    # Exportar lista completa
    donghuas = api.obtener_lista_donghuas()
    exportar_a_json(donghuas, 'lista_donghuas.json')


if __name__ == "__main__":
    # Ejecutar ejemplos
    try:
        ejemplo_uso()
        
        # Preguntar si desea exportar
        print("\n¿Deseas exportar los datos a archivos JSON? (s/n): ", end="")
        respuesta = input().strip().lower()
        if respuesta == 's':
            ejemplo_exportar()
            
    except KeyboardInterrupt:
        print("\n\nPrograma interrumpido por el usuario.")
    except Exception as e:
        print(f"\nError inesperado: {e}")
