# Calculadora de Días

Este proyecto es una calculadora de días interactiva basada en la web que permite a los usuarios calcular la diferencia entre fechas o determinar una fecha futura añadiendo un número específico de días. Incluye funcionalidades para gestionar múltiples cálculos, resaltar días festivos y fines de semana, y exportar los resultados a un archivo XLSX.

## Características

*   **Cálculo de Días Interactivo**: Los cálculos se realizan automáticamente a medida que el usuario ingresa datos en los campos de fecha o número de días, sin necesidad de un botón "Calcular" explícito.
    *   Calcula el número de días entre una fecha ingresada y la fecha actual (mañana).
    *   Calcula una fecha futura añadiendo un número específico de días a la fecha actual (mañana).
*   **Gestión de Filas Dinámica**: Añade o elimina múltiples filas de entrada para realizar varios cálculos simultáneamente.
*   **Exclusividad de Entrada**: Los campos de "Fecha" y "Número de días" son mutuamente excluyentes por fila. Al ingresar un valor en uno, el otro se deshabilita y se limpia, guiando al usuario sobre qué tipo de cálculo se realizará.
*   **Resaltado de Días Especiales**: Resalta automáticamente los domingos y días festivos en rojo, y los sábados no feriados en azul, en los resultados.
*   **Feriados Dinámicos**: Los días feriados fijos se reconocen para cualquier año, y los feriados movibles (como Jueves y Viernes Santo) se calculan dinámicamente para el año en curso.
*   **Exportación a XLSX**: Descarga todos los cálculos y resultados en un archivo de hoja de cálculo XLSX.
*   **Modo Oscuro**: Alterna entre un tema claro y oscuro para una mejor experiencia de usuario.
*   **Formato de Fecha Automático (`dd/mm/yyyy`)**: Formatea automáticamente la entrada de fecha a `dd/mm/yyyy` mientras el usuario escribe.
*   **Limpieza de Fecha Mejorada**: Al enfocar un campo de fecha, todo su contenido se selecciona, permitiendo una limpieza rápida y completa al presionar `Backspace` o cualquier tecla de escritura.
*   **Mensajes de Error y Retroalimentación Visual**: Proporciona mensajes claros para entradas inválidas y resalta los resultados calculados.
*   **Tooltips Informativos**: Los botones y campos deshabilitados ahora tienen tooltips para ofrecer información adicional al usuario.
*   **Información de la Aplicación**: La versión de la aplicación (`cc_calculadora v1.0`) y la información de autoría/colaboración se muestran discretamente en la parte inferior derecha como un tooltip al pasar el ratón.

## Tecnologías Utilizadas

*   **HTML5**: Para la estructura de la página web.
*   **CSS3**: Para el estilo y la presentación, incluyendo el modo oscuro.
*   **JavaScript**: Para la lógica central de la calculadora, la manipulación del DOM y las interacciones del usuario.
*   **SheetJS (xlsx.full.min.js)**: Una biblioteca de terceros utilizada para la funcionalidad de exportación de datos a XLSX.

## Estructura del Proyecto

```
.
├── index.html
├── README.md
├── assets/
│   └── images/
│       └── logo_cip.png
├── css/
│   └── styles.css
├── js/
│   └── script.js
└── temp/
    └── feriados_respaldo.json
    └── holidays.json
```

## Cómo Usar

1.  **Clonar el Repositorio**:
    ```bash
    git clone https://github.com/tu-usuario/Calculadora-d-as.github.io.git
    ```
2.  **Abrir `index.html`**: Navega al directorio del proyecto y abre el archivo `index.html` en tu navegador web preferido.

### Interfaz de Usuario

*   **Campos de Entrada**:
    *   **Fecha (dd/mm/yyyy)**: Ingresa una fecha en formato día/mes/año (4 dígitos para el año).
    *   **Número de días**: Ingresa un número de días.
    *   **Resultado**: Muestra el resultado del cálculo.
*   **Botones**:
    *   **`+`**: Añade una nueva fila de entrada.
    *   **`-`**: Elimina la fila de entrada adyacente.
    *   **⬇️ Xlsx**: Descarga los resultados en un archivo XLSX.
    *   **Limpiar**: Borra todas las entradas y filas adicionales.
    *   **🌙 (Alternar Modo)**: Cambia entre el modo claro y oscuro.

## Días Feriados

Los días feriados fijos están definidos en `js/script.js` y se replican anualmente. Los feriados movibles (como Jueves y Viernes Santo) se calculan dinámicamente para el año en curso.

## Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un `issue` o envía un `pull request`.

## Licencia

Este proyecto está bajo la licencia [MIT](LICENSE).
