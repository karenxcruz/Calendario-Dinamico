# 📅 Calendario Académico Dinámico

Un gestor de tareas y calendario interactivo diseñado específicamente para facilitar la organización académica del máster virtual de la profesora Urbelania. 

Este proyecto web permite visualizar rápidamente las actividades del mes, categorizarlas por colores y llevar un control detallado de los pendientes, todo desde una interfaz amigable y adaptable a dispositivos móviles.

## ✨ Características Principales

* **Vista Mensual Interactiva:** Calendario que se ajusta automáticamente al año y mes actual, permitiendo la navegación temporal.
* **Categorización Visual:** Las actividades se muestran en el calendario como etiquetas (pills) de colores según su tipo:
  * 📘 **Clase en directo** (Azul)
  * 📗 **Envío de Actividad** (Verde)
  * 📕 **Examen / Cuestionario** (Rojo)
  * 📙 **Participación en Foro** (Naranja)
  * 🟪 **Lectura / Documentación** (Morado)
* **Gestión de Pendientes:** Panel lateral dinámico que muestra el detalle de las tareas al hacer clic en un día específico.
* **Sistema de Estados:** Opción para marcar actividades como "Completadas", lo cual las tacha visualmente en el calendario general.
* **Almacenamiento Local:** Los datos se guardan directamente en el navegador del usuario (`localStorage`), eliminando la necesidad de bases de datos externas o configuraciones complejas.
* **Diseño Responsive:** Totalmente adaptable para visualizarse sin problemas tanto en computadoras de escritorio como en teléfonos móviles.

## 🛠️ Tecnologías Utilizadas

* **HTML5:** Estructura semántica de la aplicación.
* **CSS3:** Estilos, uso de Flexbox y CSS Grid, y Media Queries para el diseño responsive.
* **JavaScript (Vanilla):** Lógica del calendario, manipulación del DOM y gestión del `localStorage`.
* **FontAwesome:** Iconografía de la interfaz.

## 🚀 Despliegue en Vivo

El proyecto está configurado para ser alojado como un sitio web estático. Puedes acceder a la versión en vivo alojada en Render a través del siguiente enlace:
👉 **[Enlace a tu proyecto en Render]** *(Nota: Actualizar este enlace cuando Render genere la URL)*

## 💻 Arrancar localmente
👉  python -m http.server