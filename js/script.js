/**
 * Calculadora de Días v3.0 - Bootstrap Edition
 * Desarrollado por Carlos Cusi
 * Asistencia y colaboración de Gemini (Google)
 */

// ========================================
// Estado de la Aplicación
// ========================================
const AppState = {
  contadorFilas: 1,
  historial: [],
  darkMode: false,
  historialOffcanvas: null,
  toastInstance: null,
};

// ========================================
// Feriados de Perú (según lista oficial)
// ========================================
const feriadosBase = {
  "01/01": "Año Nuevo",
  "01/05": "Día del Trabajo",
  "07/06": "Batalla de Arica y Día de la Bandera",
  "29/06": "San Pedro y San Pablo",
  "23/07": "Día de la Fuerza Aérea del Perú",
  "28/07": "Fiestas Patrias",
  "29/07": "Fiestas Patrias",
  "06/08": "Batalla de Junín",
  "30/08": "Santa Rosa de Lima",
  "08/10": "Combate de Angamos",
  "01/11": "Día de Todos los Santos",
  "08/12": "Inmaculada Concepción",
  "09/12": "Batalla de Ayacucho",
  "25/12": "Navidad"
};
let feriados = [];

// ========================================
// Inicialización
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  inicializarApp();
});

function inicializarApp() {
  // Inicializar componentes de Bootstrap
  AppState.historialOffcanvas = new bootstrap.Offcanvas(document.getElementById('historialOffcanvas'));
  const toastEl = document.getElementById('toast');
  if (toastEl) {
    AppState.toastInstance = bootstrap.Toast.getOrCreateInstance(toastEl);
  }

  cargarEstadoGuardado();

  const añoActual = new Date().getFullYear();
  feriados = generarFeriadosAnuales(feriadosBase, añoActual);

  configurarAtajosTeclado();
  detectarPreferenciaModoOscuro();
  actualizarBadgeHistorial();

  const primerInput = document.getElementById('fecha1');
  if (primerInput) {
    setTimeout(() => primerInput.focus(), 150);
  }
}

function cargarEstadoGuardado() {
  try {
    const darkModeGuardado = localStorage.getItem('darkMode');
    const theme = darkModeGuardado === 'true' ? 'dark' : 'light';
    AppState.darkMode = darkModeGuardado === 'true';
    document.documentElement.setAttribute('data-bs-theme', theme);
    actualizarIconoModoOscuro();

    const historialGuardado = localStorage.getItem('historial');
    if (historialGuardado) {
      AppState.historial = JSON.parse(historialGuardado);
      renderizarHistorial();
    }
  } catch (e) {
    console.warn('Error al cargar estado guardado:', e);
  }
}

function guardarEstado() {
  try {
    localStorage.setItem('darkMode', AppState.darkMode);
    localStorage.setItem('historial', JSON.stringify(AppState.historial));
  } catch (e) {
    console.warn('Error al guardar estado:', e);
  }
}


// ========================================
// Lógica de Feriados (sin cambios)
// ========================================
function calcularPascua(año) {
  const a = año % 19, b = Math.floor(año / 100), c = año % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451), mes = Math.floor((h + l - 7 * m + 114) / 31), dia = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(año, mes - 1, dia);
}

function obtenerFeriadosMovibles(año) {
  const pascua = calcularPascua(año);
  const juevesSanto = new Date(pascua);
  juevesSanto.setDate(pascua.getDate() - 3);
  const viernesSanto = new Date(pascua);
  viernesSanto.setDate(pascua.getDate() - 2);
  return [formatearFechaISO(juevesSanto), formatearFechaISO(viernesSanto), formatearFechaISO(pascua)];
}

function formatearFechaISO(fecha) {
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
}

function generarFeriadosAnuales(base, año) {
  const anuales = Object.keys(base).map(fecha => `${año}-${fecha.split('/')[1].padStart(2, '0')}-${fecha.split('/')[0].padStart(2, '0')}`);
  return anuales.concat(obtenerFeriadosMovibles(año));
}

// ========================================
// Gestión de Filas (Adaptado a Bootstrap)
// ========================================
function agregarFila() {
  if (AppState.contadorFilas >= 50) {
    mostrarToast('Máximo 50 filas permitidas', 'danger');
    return;
  }
  AppState.contadorFilas++;
  const id = AppState.contadorFilas;
  const nuevoInput = document.createElement("div");
  nuevoInput.className = "card card-calculo mb-3";
  nuevoInput.setAttribute("data-row", id);
  
  nuevoInput.innerHTML = `
    <div class="card-body p-3">
      <!-- Fila 1: Fecha + Días (en móvil) -->
      <div class="row g-2 align-items-center mb-2 mb-sm-0">
        <div class="col-6 col-sm-4 col-md-3">
          <div class="form-floating">
            <input type="text" class="form-control input-fecha" id="fecha${id}" placeholder="dd/mm/yyyy" oninput="formatearFechaInput(this); dispararCalculo(${id});" onfocus="this.select();">
            <label for="fecha${id}">Fecha</label>
          </div>
          <span class="text-danger small" id="errorFecha${id}" role="alert" aria-live="polite"></span>
        </div>
        <div class="col-6 col-sm-3 col-md-2">
          <div class="form-floating">
            <input type="number" class="form-control input-dias" id="dias${id}" placeholder="Días" oninput="dispararCalculo(${id});" onfocus="this.select();">
            <label for="dias${id}">Días</label>
          </div>
          <span class="text-danger small" id="errorDias${id}" role="alert" aria-live="polite"></span>
        </div>
      </div>
      <!-- Fila 2: Resultado + Botón eliminar -->
      <div class="row g-2 align-items-center">
        <div class="col-8 col-sm-5 col-md-5">
          <div class="form-floating">
            <input type="text" class="form-control resultado" id="resultado${id}" placeholder="Resultado" readonly>
            <label for="resultado${id}">Resultado</label>
          </div>
        </div>
        <div class="col-4 col-sm-3 col-md-2">
          <button class="btn btn-danger btn-eliminar w-100" onclick="eliminarFila(this)" title="Eliminar fila" aria-label="Eliminar fila">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>
    </div>
  `;

  document.getElementById("fechasAdicionales").appendChild(nuevoInput);
  setTimeout(() => document.getElementById(`fecha${id}`).focus(), 50);
  mostrarToast('Nueva fila añadida', 'success');
}

function eliminarFila(boton) {
    const fila = boton.closest('.card-calculo');
    if (fila) {
        // Animación de salida simple
        fila.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
        fila.style.opacity = '0';
        fila.style.transform = 'translateX(20px)';
        setTimeout(() => {
            fila.remove();
            // No es necesario decrementar el contador de filas si los IDs son únicos
            mostrarToast('Fila eliminada', 'info');
        }, 300);
    }
}


// ========================================
// Lógica de Cálculo (con pequeñas adaptaciones)
// ========================================
function dispararCalculo(filaId) {
  const fechaInput = document.getElementById(`fecha${filaId}`);
  const diasInput = document.getElementById(`dias${filaId}`);

  if (fechaInput.value.trim() !== '') {
    diasInput.value = '';
    diasInput.disabled = true;
    fechaInput.disabled = false;
  } else if (diasInput.value.trim() !== '') {
    fechaInput.value = '';
    fechaInput.disabled = true;
    diasInput.disabled = false;
  } else {
    fechaInput.disabled = false;
    diasInput.disabled = false;
  }
  calcular(filaId);
}

function calcular(filaId) {
    const hoy = new Date();
    const fechaInput = document.getElementById(`fecha${filaId}`);
    const diasInput = document.getElementById(`dias${filaId}`);
    const resultadoInput = document.getElementById(`resultado${filaId}`);
    const errorFecha = document.getElementById(`errorFecha${filaId}`);
    const errorDias = document.getElementById(`errorDias${filaId}`);

    if (!fechaInput || !diasInput || !resultadoInput) return;

    errorFecha.textContent = '';
    errorDias.textContent = '';
    resultadoInput.value = '';
    limpiarClasesResultado(resultadoInput);

    const fechaStr = fechaInput.value;
    const diasStr = diasInput.value;
    let calculoRealizado = false;

    if (fechaStr) {
        const fechaIngresada = parsearFecha(fechaStr);
        if (fechaIngresada) {
            const fechaFinal = calcularFecha(fechaIngresada, 0); // Usar para normalizar
            const diff = calcularDiferenciaDias(hoy, fechaFinal);
            resultadoInput.value = `${diff} día(s) (${obtenerNombreDia(fechaFinal)})`;
            resaltarDias(resultadoInput, fechaFinal);
            calculoRealizado = true;
             agregarAlHistorial({ tipo: 'diferencia', fecha: fechaStr, resultado: resultadoInput.value, timestamp: Date.now() });
        } else {
            errorFecha.textContent = 'Formato inválido.';
        }
    } else if (diasStr) {
        const dias = parseInt(diasStr, 10);
        if (!isNaN(dias)) {
            // Validar que el número sea positivo
            if (dias < 0) {
                errorDias.textContent = 'Ingrese un número positivo.';
                return;
            }
            const usarGracia = document.getElementById('diasGracia').checked;
            let nuevaFecha = calcularFechaDiasHabiles(hoy, dias, usarGracia);
            let resultadoTexto = formatearFecha(nuevaFecha) + ` (${obtenerNombreDia(nuevaFecha)})`;
            // Mostrar información de días por proceso si aplica
            if (usarGracia && nuevaFecha.diasExtra > 0) {
                resultadoTexto += ` (+${nuevaFecha.diasExtra} proceso)`;
            }
            resultadoInput.value = resultadoTexto;
            resaltarDias(resultadoInput, nuevaFecha);
            calculoRealizado = true;
            agregarAlHistorial({ tipo: 'suma', dias: dias, resultado: resultadoTexto, timestamp: Date.now() });
        } else {
            errorDias.textContent = 'Número inválido.';
        }
    }
}


function calcularDiferenciaDias(fechaInicio, fechaFin) {
    const unDia = 1000 * 60 * 60 * 24;
    const diff = fechaFin.getTime() - fechaInicio.getTime();
    return Math.ceil(diff / unDia);
}

function calcularFecha(fechaInicio, dias) {
  const nuevaFecha = new Date(fechaInicio);
  nuevaFecha.setDate(nuevaFecha.getDate() + dias);
  return nuevaFecha;
}

function formatearFecha(fecha) {
  return `${String(fecha.getDate()).padStart(2, "0")}/${String(fecha.getMonth() + 1).padStart(2, "0")}/${fecha.getFullYear()}`;
}

function parsearFecha(fechaStr) {
  const partes = fechaStr.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/);
  if (!partes) return null;
  const fecha = new Date(partes[3], partes[2] - 1, partes[1]);
  return (fecha && fecha.getMonth() === parseInt(partes[2]) - 1) ? fecha : null;
}

function formatearFechaInput(input) {
  let v = input.value.replace(/\D/g, "").slice(0, 8);
  if (v.length >= 5) {
    input.value = `${v.slice(0,2)}/${v.slice(2,4)}/${v.slice(4)}`;
  } else if (v.length >= 3) {
    input.value = `${v.slice(0,2)}/${v.slice(2)}`;
  } else {
    input.value = v;
  }
}

function limpiarClasesResultado(element) {
    element.classList.remove("feriado", "sabado", "normal");
}

function resaltarDias(element, fecha) {
  limpiarClasesResultado(element);
  const diaSemana = fecha.getDay();
  const fechaISO = formatearFechaISO(fecha);

  // Sábados son días hábiles pero se resaltan en celeste para identificación visual
  if (diaSemana === 0 || feriados.includes(fechaISO)) {
    element.classList.add("feriado");
  } else if (diaSemana === 6) {
    element.classList.add("sabado");
  } else {
    element.classList.add("normal");
  }
}

function obtenerNombreDia(fecha) {
    return ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][fecha.getDay()];
}

// ========================================
// Exportación y Copia (Adaptado)
// ========================================
function obtenerDatosFilas() {
    const datos = [];
    document.querySelectorAll('.card-calculo').forEach(fila => {
        const id = fila.dataset.row;
        const fechaInput = document.getElementById(`fecha${id}`).value || '';
        const diasInput = document.getElementById(`dias${id}`).value || '';
        const resultadoInput = document.getElementById(`resultado${id}`);
        const resultadoCompleto = resultadoInput.value || '';

        if (resultadoCompleto) {
            // Determinar qué mostrar en fecha y días
            let fechaMostrar = '';
            let diasMostrar = '';
            
            // Si hay fecha ingresada, usarla; si no, extraer la fecha calculada
            if (fechaInput) {
                fechaMostrar = fechaInput;
            } else {
                // Extraer solo la fecha del resultado (sin el día de la semana)
                fechaMostrar = resultadoCompleto.split(' (')[0];
            }
            
            // Si hay días ingresados, usarlos; si no, es una diferencia
            if (diasInput) {
                diasMostrar = diasInput;
            } else {
                // Es una diferencia de días
                const matchDias = resultadoCompleto.match(/^(-?\d+)\s*día/);
                if (matchDias) {
                    diasMostrar = matchDias[1] + ' dias';
                }
            }
            
            // Extraer el nombre del día de la semana
            let nombreDia = '';
            const matchDia = resultadoCompleto.match(/\(([A-Za-záéíóúñ]+)\)/);
            if (matchDia) {
                nombreDia = matchDia[1];
            }
            
            // Determinar el tipo de día
            let tipoDia = 'Dia habil';
            if (resultadoInput.classList.contains('feriado')) tipoDia = 'Feriado';
            else if (resultadoInput.classList.contains('sabado')) tipoDia = 'Sabado';
            
            // Si hay "proceso" en el resultado, agregarlo al tipo
            if (resultadoCompleto.includes('proceso')) {
                tipoDia += ' (+2 proceso)';
            }
            
            datos.push({ fecha: fechaMostrar, dias: diasMostrar, resultado: tipoDia, dia: nombreDia });
        }
    });
    return datos;
}

function descargarXLSX() {
  if (typeof XLSX === 'undefined') {
    return mostrarToast('Librería de exportación no encontrada', 'danger');
  }
  const datos = obtenerDatosFilas();
  if (datos.length === 0) {
    return mostrarToast('No hay datos para exportar', 'warning');
  }
  const ws = XLSX.utils.json_to_sheet(datos, {header: ["fecha", "dias", "resultado", "dia"]});
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Resultados");
  XLSX.writeFile(wb, `Calculos_${new Date().toISOString().slice(0,10)}.xlsx`);
  mostrarToast('Exportado a XLSX con éxito', 'success');
}

function copiarResultados() {
    const datos = obtenerDatosFilas();
    if (datos.length === 0) {
        return mostrarToast('No hay nada que copiar', 'warning');
    }
    const texto = datos.map(f => `${f.fecha || (f.dias + 'd')} → ${f.resultado} [${f.tipoDia}]`).join('\n');
    navigator.clipboard.writeText(texto).then(() => {
        mostrarToast('Resultados copiados al portapapeles', 'success');
    }).catch(() => {
        mostrarToast('Error al copiar los resultados', 'danger');
    });
}

// ========================================
// Historial (Adaptado a Bootstrap Offcanvas)
// ========================================
function agregarAlHistorial(item) {
  const ultimo = AppState.historial[0];
  if (ultimo && ultimo.resultado === item.resultado && ultimo.tipo === item.tipo) return;
  
  AppState.historial.unshift(item);
  if (AppState.historial.length > 50) AppState.historial.pop();
  
  guardarEstado();
  renderizarHistorial();
  actualizarBadgeHistorial();
}

function renderizarHistorial() {
  const lista = document.getElementById('historialLista');
  if (!lista) return;
  lista.innerHTML = AppState.historial.map((item, index) => {
    const fecha = item.fecha || `+${item.dias}d`;
    const tiempo = new Date(item.timestamp).toLocaleString('es-PE', { hour: '2-digit', minute: '2-digit' });
    return `<li class="list-group-item list-group-item-action" onclick="usarHistorial(${index})">
              <div><strong>${fecha}</strong> → ${item.resultado}</div>
              <small class="text-muted">${tiempo}</small>
            </li>`;
  }).join('');
}

function usarHistorial(index) {
  const item = AppState.historial[index];
  if (!item) return;

  let filaId = encontrarFilaLibre();
  
  const fechaInput = document.getElementById(`fecha${filaId}`);
  const diasInput = document.getElementById(`dias${filaId}`);
  
  if (item.tipo === 'diferencia') {
    fechaInput.value = item.fecha;
  } else {
    diasInput.value = item.dias;
  }
  
  dispararCalculo(filaId);
  AppState.historialOffcanvas.hide();
  mostrarToast('Cálculo cargado desde el historial', 'info');
}

function limpiarHistorial() {
  AppState.historial = [];
  guardarEstado();
  renderizarHistorial();
  actualizarBadgeHistorial();
  mostrarToast('Historial limpiado', 'success');
}

function actualizarBadgeHistorial() {
  const badge = document.getElementById('historialBadge');
  if (badge) {
    const count = AppState.historial.length;
    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline-block' : 'none';
  }
}

// ========================================
// Modo Oscuro (Adaptado a Bootstrap 5.3)
// ========================================
function toggleDarkMode() {
  AppState.darkMode = !AppState.darkMode;
  const theme = AppState.darkMode ? 'dark' : 'light';
  document.documentElement.setAttribute('data-bs-theme', theme);
  actualizarIconoModoOscuro();
  guardarEstado();
  mostrarToast(`Modo ${theme} activado`, 'info');
}

function actualizarIconoModoOscuro() {
  const btnIcon = document.querySelector('#toggle-dark-mode i');
  if (btnIcon) {
    btnIcon.classList.toggle('bi-moon-stars', !AppState.darkMode);
    btnIcon.classList.toggle('bi-sun', AppState.darkMode);
  }
}

function detectarPreferenciaModoOscuro() {
    if (localStorage.getItem('darkMode') === null && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        AppState.darkMode = true;
        document.documentElement.setAttribute('data-bs-theme', 'dark');
        actualizarIconoModoOscuro();
    }
}


// ========================================
// Atajos de Teclado (Adaptados)
// ========================================
function configurarAtajosTeclado() {
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key.toLowerCase() === 'd') { e.preventDefault(); toggleDarkMode(); }
    if (e.ctrlKey && e.key.toLowerCase() === 'l') { e.preventDefault(); limpiar(); }
    if (e.ctrlKey && e.key.toLowerCase() === 'h') { e.preventDefault(); AppState.historialOffcanvas.toggle(); }
    if (e.ctrlKey && e.key.toLowerCase() === 'n') { e.preventDefault(); agregarFila(); }
    if (e.ctrlKey && e.shiftKey && e.key.toUpperCase() === 'N') { e.preventDefault(); agregarFila(); }
    if (e.key === 'Escape' && document.body.classList.contains('offcanvas-open')) { AppState.historialOffcanvas.hide(); }
  });
}

// ========================================
// Lógica de UI y Utilidades (Adaptadas)
// ========================================

function limpiar() {
    document.querySelectorAll('.card-calculo').forEach((fila, index) => {
        if (index === 0) { // Solo limpiar la primera fila
            const id = fila.dataset.row;
            document.getElementById(`fecha${id}`).value = '';
            document.getElementById(`dias${id}`).value = '';
            document.getElementById(`resultado${id}`).value = '';
            document.getElementById(`errorFecha${id}`).textContent = '';
            document.getElementById(`errorDias${id}`).textContent = '';
            document.getElementById(`fecha${id}`).disabled = false;
            document.getElementById(`dias${id}`).disabled = false;
            limpiarClasesResultado(document.getElementById(`resultado${id}`));
        } else { // Eliminar las demás
            fila.remove();
        }
    });
    AppState.contadorFilas = 1;
    mostrarToast('Campos limpiados', 'success');
}


function mostrarToast(mensaje, tipo = 'info') {
    const toastBody = document.querySelector('#toast .toast-body');
    const toastEl = document.getElementById('toast');
    if (!toastBody || !toastEl || !AppState.toastInstance) return;

    // Asignar color de Bootstrap
    toastEl.classList.remove('text-bg-success', 'text-bg-danger', 'text-bg-warning', 'text-bg-info');
    toastEl.classList.add(`text-bg-${tipo}`);
    
    toastBody.textContent = mensaje;
    AppState.toastInstance.show();
}

function encontrarFilaLibre() {
    for (let i = 1; i <= AppState.contadorFilas; i++) {
        const fila = document.querySelector(`.card-calculo[data-row="${i}"]`);
        if (fila) {
            const fecha = document.getElementById(`fecha${i}`).value;
            const dias = document.getElementById(`dias${i}`).value;
            if (!fecha && !dias) return i;
        }
    }
    if (AppState.contadorFilas < 50) {
        agregarFila();
        return AppState.contadorFilas;
    }
    mostrarToast('Todas las filas están en uso.', 'warning');
    return null;
}

function calculoRapido(dias) {
  const filaId = encontrarFilaLibre();
  if (!filaId) return;
  const diasInput = document.getElementById(`dias${filaId}`);
  diasInput.value = dias;
  dispararCalculo(filaId);
  mostrarToast(`${dias} días calculados`, 'success');
}

function calculoMultiples(arrayDias) {
  arrayDias.forEach((dias, index) => {
    setTimeout(() => {
      const filaId = encontrarFilaLibre();
      if (filaId) {
        const diasInput = document.getElementById(`dias${filaId}`);
        diasInput.value = dias;
        dispararCalculo(filaId);
      }
    }, index * 100);
  });
  mostrarToast(`Calculando ${arrayDias.join(', ')} días...`, 'info');
}

function toggleCombos() {
    const combos = document.getElementById('quickCombos');
    const days = document.getElementById('quickDays');
    const isHidden = combos.style.display === 'none';
    combos.style.display = isHidden ? 'inline-flex' : 'none';
    days.style.display = isHidden ? 'none' : 'inline-flex';
}


function esFeriadoODomingo(fecha) {
    const diaSemana = fecha.getDay();
    const fechaISO = formatearFechaISO(fecha);
    // Sábados (día 6) son considerados días hábiles
    return diaSemana === 0 || feriados.includes(fechaISO);
}


function ajustarAHabil(fecha) {
    let fechaAjustada = new Date(fecha);
    while (esFeriadoOFinSemana(fechaAjustada)) {
        fechaAjustada.setDate(fechaAjustada.getDate() + 1);
    }
    return fechaAjustada;
}

function calcularFechaDiasHabiles(fechaInicio, dias, incluirGracia) {
    let fechaActual = new Date(fechaInicio);
    let diasSumados = 0;
    let diasExtra = 0;
    
    // Sumar días calendario
    fechaActual.setDate(fechaActual.getDate() + dias);

    // Si la opción de proceso está activa, SIEMPRE sumar 2 días por proceso
    if (incluirGracia) {
        fechaActual.setDate(fechaActual.getDate() + 2); // Siempre sumar 2 días por proceso
        diasExtra = 2;
        
        // Luego ajustar si cae en domingo o feriado (sábados son hábiles)
        while (esFeriadoODomingo(fechaActual)) {
            fechaActual.setDate(fechaActual.getDate() + 1);
            diasExtra++;
        }
    }
    
    // Guardar información de días extra para mostrar
    fechaActual.diasExtra = diasExtra;
    
    return fechaActual;
}

function toggleDiasGracia() {
    const isChecked = document.getElementById('diasGracia').checked;
    mostrarToast(isChecked ? 'Modo: +2 días por proceso activado' : 'Modo: Días calendario', 'info');
    // Forzar recalculo de todas las filas con días
    document.querySelectorAll('.input-dias').forEach(input => {
        if (input.value) {
            const filaId = input.id.replace('dias', '');
            calcular(filaId);
        }
    });
}
