let contadorFilas = 1;
const feriadosBase = {
    "01/01": "Año Nuevo",
    // "17/04": "Jueves Santo", // Se calculará dinámicamente
    // "18/04": "Viernes Santo", // Se calculará dinámicamente
    "01/05": "Día del Trabajo",
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

// Función para calcular la fecha de Pascua (Algoritmo de Meeus/Jones/Butcher)
function calcularPascua(año) {
  const a = año % 19;
  const b = Math.floor(año / 100);
  const c = año % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mesPascua = Math.floor((h + l - 7 * m + 114) / 31);
  const diaPascua = ((h + l - 7 * m + 114) % 31) + 1;

  return new Date(año, mesPascua - 1, diaPascua);
}

// Función para obtener feriados movibles (Semana Santa)
function obtenerFeriadosMovibles(año) {
  const pascua = calcularPascua(año);
  const juevesSanto = new Date(pascua);
  juevesSanto.setDate(pascua.getDate() - 3); // Pascua - 3 días
  const viernesSanto = new Date(pascua);
  viernesSanto.setDate(pascua.getDate() - 2); // Pascua - 2 días

  return [
    `${juevesSanto.getFullYear()}-${String(juevesSanto.getMonth() + 1).padStart(2, '0')}-${String(juevesSanto.getDate()).padStart(2, '0')}`,
    `${viernesSanto.getFullYear()}-${String(viernesSanto.getMonth() + 1).padStart(2, '0')}-${String(viernesSanto.getDate()).padStart(2, '0')}`
  ];
}

function generarFeriadosAnuales(feriadosBase, año) {
  let feriadosAnuales = [];

  // Añadir feriados fijos
  for (const fecha in feriadosBase) {
    const [dia, mes] = fecha.split('/');
    feriadosAnuales.push(`${año}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`);
  }

  // Añadir feriados movibles (Semana Santa)
  feriadosAnuales = feriadosAnuales.concat(obtenerFeriadosMovibles(año));

  return feriadosAnuales;
}

// Inicializar feriados para el año actual
const añoActual = new Date().getFullYear();
feriados = generarFeriadosAnuales(feriadosBase, añoActual);

function agregarFila() {
  if (contadorFilas < 50) {
    contadorFilas++;
    const nuevoInput = document.createElement("div");
    nuevoInput.className = "fecha-input";
    nuevoInput.innerHTML = `
      <input type="text" id="fecha${contadorFilas}" placeholder="Fecha (dd/mm/yyyy)" oninput="formatearFechaInput(this); dispararCalculo(${contadorFilas});" onfocus="this.select();">
      <span class="error-message" id="errorFecha${contadorFilas}"></span>
      <input type="number" id="dias${contadorFilas}" placeholder="Número de días" oninput="dispararCalculo(${contadorFilas});">
      <span class="error-message" id="errorDias${contadorFilas}"></span>
      <input type="text" id="resultado${contadorFilas}" readonly placeholder="Resultado">
      <button onclick="eliminarFila(this)">-</button>
    `;
    document.getElementById("fechasAdicionales").appendChild(nuevoInput);
    actualizarPlaceholderDias();
  } else {
    alert("Máximo 50 filas permitidas.");
  }
}

function eliminarFila(boton) {
  boton.parentElement.remove();
  contadorFilas--;
  actualizarPlaceholderDias();
}

function actualizarPlaceholderDias() {
  const filas = document.querySelectorAll(".fecha-input");
  filas.forEach((fila, index) => {
    const inputDias = fila.querySelector("input[type='number']");
    inputDias.placeholder = `N° día ${index + 1}`;
  });
}

function calcular(filaId = null) { // Ahora acepta un ID de fila opcional
  const hoy = new Date();
  hoy.setDate(hoy.getDate() + 1); // Contar desde mañana

  const filasAProcesar = filaId ? [filaId] : Array.from({ length: contadorFilas }, (_, i) => i + 1);

  filasAProcesar.forEach(i => {
    const fechaInput = document.getElementById(`fecha${i}`);
    const diasInput = document.getElementById(`dias${i}`);
    const resultadoInput = document.getElementById(`resultado${i}`);
    const errorFecha = document.getElementById(`errorFecha${i}`);
    const errorDias = document.getElementById(`errorDias${i}`);

    // Limpiar mensajes de error y resaltado previo
    if (errorFecha) errorFecha.textContent = '';
    if (errorDias) errorDias.textContent = '';
    if (resultadoInput) resultadoInput.classList.remove('resaltar-resultado');

    const fechaStr = fechaInput ? fechaInput.value : '';
    const diasStr = diasInput ? diasInput.value : '';

    let calculoRealizado = false;

    if (fechaStr) {
      const fechaIngresada = parsearFecha(fechaStr);
      if (fechaIngresada) {
        const diferencia = calcularDiferenciaDias(hoy, fechaIngresada);
        if (resultadoInput) resultadoInput.value = `${diferencia} días`;
        if (resultadoInput) resaltarDias(resultadoInput, fechaIngresada);
        calculoRealizado = true;
      } else {
        if (errorFecha) errorFecha.textContent = 'Formato de fecha inválido (dd/mm/aa)';
        if (resultadoInput) resultadoInput.value = ''; // Limpiar resultado si hay error
      }
    }

    if (diasStr) {
      const dias = parseInt(diasStr, 10); // Asegurar base 10
      if (!isNaN(dias)) {
        const nuevaFecha = calcularFecha(hoy, dias);
        const fechaFormateada = formatearFecha(nuevaFecha);
        if (resultadoInput) resultadoInput.value = fechaFormateada;
        if (resultadoInput) resaltarDias(resultadoInput, nuevaFecha);
        calculoRealizado = true;
      } else {
        if (errorDias) errorDias.textContent = 'Ingrese un número válido';
        if (resultadoInput) resultadoInput.value = ''; // Limpiar resultado si hay error
      }
    }

    // Si no se realizó ningún cálculo y ambos campos están vacíos, limpiar el resultado
    if (!calculoRealizado && !fechaStr && !diasStr) {
      if (resultadoInput) resultadoInput.value = '';
      if (errorFecha) errorFecha.textContent = '';
      if (errorDias) errorDias.textContent = '';
    } else if (calculoRealizado) {
      if (resultadoInput) {
        resultadoInput.classList.add('resaltar-resultado');
        setTimeout(() => {
          resultadoInput.classList.remove('resaltar-resultado');
        }, 1000); // Eliminar la clase después de 1 segundo
      }
    }
  });
}

function dispararCalculo(filaId) {
  const fechaInput = document.getElementById(`fecha${filaId}`);
  const diasInput = document.getElementById(`dias${filaId}`);
  const tooltipMensaje = "Para ingresar aquí, primero limpia el otro campo.";

  // Si la fecha tiene valor, deshabilitar días
  if (fechaInput && fechaInput.value.trim() !== '') {
    if (diasInput) {
      diasInput.value = ''; // Limpiar el campo de días
      diasInput.disabled = true;
      diasInput.title = tooltipMensaje; // Añadir tooltip
    }
    if (fechaInput) fechaInput.title = ''; // Limpiar tooltip si estaba deshabilitado
  }
  // Si los días tienen valor, deshabilitar fecha
  else if (diasInput && diasInput.value.trim() !== '') {
    if (fechaInput) {
      fechaInput.value = ''; // Limpiar el campo de fecha
      fechaInput.disabled = true;
      fechaInput.title = tooltipMensaje; // Añadir tooltip
    }
    if (diasInput) diasInput.title = ''; // Limpiar tooltip si estaba deshabilitado
  }
  // Si ambos están vacíos, habilitar ambos y limpiar tooltips
  else {
    if (fechaInput) {
      fechaInput.disabled = false;
      fechaInput.title = '';
    }
    if (diasInput) {
      diasInput.disabled = false;
      diasInput.title = '';
    }
  }

  calcular(filaId);
}

function calcularDiferenciaDias(fechaInicio, fechaFin) {
  const diferenciaTiempo = fechaFin.getTime() - fechaInicio.getTime();
  return Math.ceil(diferenciaTiempo / (1000 * 3600 * 24));
}

function calcularFecha(fechaInicio, dias) {
  let nuevaFecha = new Date(fechaInicio);
  nuevaFecha.setDate(nuevaFecha.getDate() + dias);
  return nuevaFecha;
}

function formatearFecha(fecha) {
  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const año = String(fecha.getFullYear()); // Año completo
  return `${dia}/${mes}/${año}`;
}

function parsearFecha(fechaStr) {
  const partes = fechaStr.split("/");
  if (partes.length === 3) {
    const dia = parseInt(partes[0], 10);
    const mes = parseInt(partes[1], 10) - 1;
    const año = parseInt(partes[2], 10); // Ahora el año es de 4 dígitos
    const fecha = new Date(año, mes, dia);
    if (fecha && fecha.getMonth() === mes && fecha.getDate() === dia) {
      return fecha;
    }
  }
  return null;
}

function formatearFechaInput(input) {
  let value = input.value.replace(/\D/g, "");
  if (value.length >= 2) value = value.slice(0, 2) + "/" + value.slice(2);
  if (value.length >= 5) value = value.slice(0, 5) + "/" + value.slice(5, 9); // Cambiado a 9 para YYYY
  input.value = value;
}

function resaltarDias(element, fecha) {
  const diaSemana = fecha.getDay();
  const fechaStr = `${fecha.getFullYear()}-${String(
    fecha.getMonth() + 1
  ).padStart(2, "0")}-${String(fecha.getDate()).padStart(2, "0")}`;
  const diaMesStr = `${String(fecha.getDate()).padStart(2, "0")}/${String(fecha.getMonth() + 1).padStart(2, "0")}`;

  // Limpiar clases previas
  element.classList.remove("feriado", "sabado");

  // Verificar si es domingo, feriado movible o feriado fijo
  if (diaSemana === 0 || feriados.includes(fechaStr) || feriadosBase.hasOwnProperty(diaMesStr)) {
    element.classList.add("feriado"); // Domingo o feriado
  } else if (diaSemana === 6) { // Sábado
    element.classList.add("sabado");
  }
}

function descargarXLSX() {
  const wb = XLSX.utils.book_new();
  const ws_data = [["Fecha", "Días", "Resultado"]];
  for (let i = 1; i <= contadorFilas; i++) {
    const fecha = document.getElementById(`fecha${i}`).value;
    const dias = document.getElementById(`dias${i}`).value;
    const resultado = document.getElementById(`resultado${i}`).value;
    ws_data.push([fecha, dias, resultado]);
  }
  const ws = XLSX.utils.aoa_to_sheet(ws_data);
  XLSX.utils.book_append_sheet(wb, ws, "Resultados");
  XLSX.writeFile(wb, "resultados.xlsx");
}

function limpiar() {
  document.getElementById("fecha1").value = "";
  document.getElementById("dias1").value = "";
  document.getElementById("resultado1").value = "";
  document.getElementById("fechasAdicionales").innerHTML = "";
  contadorFilas = 1;

  // Re-habilitar los campos de la primera fila y limpiar tooltips
  document.getElementById("fecha1").disabled = false;
  document.getElementById("fecha1").title = '';
  document.getElementById("dias1").disabled = false;
  document.getElementById("dias1").title = '';

  // Limpiar mensajes de error de la primera fila
  const errorFecha1 = document.getElementById("errorFecha1");
  const errorDias1 = document.getElementById("errorDias1");
  if (errorFecha1) errorFecha1.textContent = '';
  if (errorDias1) errorDias1.textContent = '';
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}
