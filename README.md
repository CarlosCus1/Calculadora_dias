# 📅 Calculadora de Días v2.0

Una calculadora de días interactiva con feriados peruanos, modo oscuro y funcionalidad offline.

![Versión](https://img.shields.io/badge/versión-2.0-blue)
![Licencia](https://img.shields.io/badge/licencia-MIT-green)
![Estado](https://img.shields.io/badge/estado-activo-success)

## ✨ Características Principales

### Funcionalidades Core
- 📊 **Cálculo de diferencias de fechas** - Ingresa una fecha y obtén los días transcurridos
- ➕ **Suma de días** - Ingresa un número de días y obtén la fecha resultante
- 🎉 **Feriados peruanos** - Identificación automática de feriados fijos y móviles
- 🌙 **Modo oscuro** - Con detección automática de preferencias del sistema

### Nuevas Características v2.0
- 📱 **PWA (Progressive Web App)** - Instalable y funciona offline
- 📜 **Historial de cálculos** - Guardado automático con localStorage
- 📋 **Exportación múltiple** - XLSX, CSV y copia al portapapeles
- ⌨️ **Atajos de teclado** - Navegación rápida y eficiente
- 🔔 **Notificaciones toast** - Feedback visual de acciones
- ♿ **Accesibilidad mejorada** - ARIA labels y navegación por teclado

## 🚀 Mejoras Implementadas

### Optimizaciones de Rendimiento
| Aspecto | Antes | Después |
|---------|-------|---------|
| CSS Variables | ❌ Valores hardcodeados | ✅ Sistema de variables CSS |
| Responsive | ❌ Limitado | ✅ Mobile-first completo |
| Accesibilidad | ❌ Básica | ✅ ARIA labels, focus visible |
| Offline | ❌ No disponible | ✅ Service Worker |
| Estado | ❌ Sin persistencia | ✅ LocalStorage |

### Optimizaciones de Código
- **CSS**: Sistema de variables CSS para fácil personalización
- **JavaScript**: Estado centralizado con objeto `AppState`
- **HTML**: Estructura semántica con roles ARIA

## 🎨 Sistema de Diseño

### Variables CSS Principales
```css
:root {
  --color-primary: #007bff;
  --color-success: #28a745;
  --color-danger: #dc3545;
  --color-info: #17a2b8;
  --spacing-md: 16px;
  --border-radius: 8px;
  --transition-base: 0.3s ease;
}
```

### Colores Semánticos
- 🔴 **Feriado/Domingo** - Rojo (`#dc3545`)
- 🔵 **Sábado** - Azul (`#17a2b8`)
- ⚫ **Día hábil** - Color por defecto

## ⌨️ Atajos de Teclado

| Atajo | Acción |
|-------|--------|
| `Ctrl + D` | Alternar modo oscuro |
| `Ctrl + L` | Limpiar todos los campos |
| `Ctrl + H` | Abrir/cerrar historial |
| `Ctrl + N` | Agregar nueva fila |
| `Escape` | Cerrar panel de historial |

## 📱 Instalación PWA

### En Desktop (Chrome/Edge)
1. Visita la aplicación
2. Click en el icono de instalación en la barra de direcciones
3. Confirma la instalación

### En Móvil (Android)
1. Visita la aplicación en Chrome
2. Menú → "Añadir a pantalla de inicio"
3. Confirma la instalación

### En iOS
1. Visita la aplicación en Safari
2. Botón de compartir → "Añadir a pantalla de inicio"

## 🏗️ Estructura del Proyecto

```
Calculadora_dias_v1_revisada/
├── index.html          # Página principal
├── manifest.json       # Configuración PWA
├── sw.js              # Service Worker
├── README.md          # Documentación
├── assets/
│   └── images/
│       └── favicon.svg
├── css/
│   └── styles.css     # Estilos con variables CSS
└── js/
    └── script.js      # Lógica de la aplicación
```

## 💡 Sugerencias Innovadoras para Futuras Versiones

### 1. 🌐 Sincronización en la Nube
- Integración con Google Drive o Dropbox
- Sincronización de historial entre dispositivos
- Backup automático de configuraciones

### 2. 📊 Dashboard de Estadísticas
- Gráfico de días calculados por mes
- Estadísticas de uso personal
- Exportación de reportes PDF

### 3. 🔔 Notificaciones Inteligentes
- Recordatorios de fechas importantes
- Alertas de feriados próximos
- Notificaciones push configurables

### 4. 🎯 Calculadoras Especializadas
- Calculadora de días laborables
- Calculadora de vacaciones
- Calculadora de plazos legales

### 5. 🌍 Internacionalización
- Soporte multiidioma (español, inglés, portugués)
- Feriados por país configurable
- Formatos de fecha regionales

### 6. 📱 Widgets
- Widget de escritorio
- Widget para móvil
- Extensión de navegador

### 7. 🤖 Integraciones
- API REST para desarrolladores
- Webhooks para automatizaciones
- Integración con calendarios (Google, Outlook)

### 8. 🎨 Personalización Avanzada
- Temas personalizables
- Modo de alto contraste mejorado
- Tamaños de fuente configurables

### 9. 📈 Análisis de Productividad
- Tiempo ahorrado calculado
- Métricas de uso
- Sugerencias de optimización

### 10. 🔒 Seguridad y Privacidad
- Encriptación de datos locales
- Modo incógnito
- Exportación/importación de datos

## 🛠️ Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Variables, Grid, Flexbox, Animations
- **JavaScript ES6+** - Módulos, async/await, localStorage
- **Service Workers** - Cache y offline
- **Web App Manifest** - PWA
- **XLSX.js** - Exportación Excel

## 📋 Feriados de Perú Incluidos

| Fecha | Feriado |
|-------|---------|
| 01/01 | Año Nuevo |
| Jueves Santo | Variable (se calcula) |
| Viernes Santo | Variable (se calcula) |
| 01/05 | Día del Trabajo |
| 29/06 | San Pedro y San Pablo |
| 23/07 | Día de la Fuerza Aérea del Perú |
| 28/07 | Fiestas Patrias |
| 29/07 | Fiestas Patrias |
| 06/08 | Batalla de Junín |
| 30/08 | Santa Rosa de Lima |
| 08/10 | Combate de Angamos |
| 01/11 | Día de Todos los Santos |
| 08/12 | Inmaculada Concepción |
| 09/12 | Batalla de Ayacucho |
| 25/12 | Navidad |

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request para sugerencias y mejoras.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Carlos Cusi**
- Asistencia y colaboración de Gemini (Google)

---

⭐ Si te gusta este proyecto, ¡dale una estrella!
