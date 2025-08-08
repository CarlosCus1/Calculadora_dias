// script.js

// Constantes y configuración
const FORMATO_FECHA_REGEX = /^\d{2}\/\d{2}\/\d{2}$/;
const feriadosCache = new Map();

// Utilidades de fecha
const utilidadesFecha = {
    formatearFecha: (fecha) => {
        const dia = String(fecha.getDate()).padStart(2, '0');
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const año = String(fecha.getFullYear()).slice(-2);
        return `${dia}/${mes}/${año}`;
    },
    esFormatoFechaValido: (fechaStr) => {
        if (!FORMATO_FECHA_REGEX.test(fechaStr)) return false;
        const [dia, mes, año] = fechaStr.split('/').map(Number);
        const siglo = año < 50 ? 2000 : 1900;
        const fecha = new Date(siglo + año, mes - 1, dia);
        return fecha.getDate() === dia && fecha.getMonth() === mes - 1 && fecha.getFullYear() % 100 === año;
    },
    calcularDiferenciaDias: (fechaStr) => {
        const [dia, mes, año] = fechaStr.split('/').map(Number);
        const fechaIngresada = new Date(2000 + año, mes - 1, dia);
        const hoy = new Date();
        const diferenciaTiempo = fechaIngresada.getTime() - hoy.getTime();
        return Math.ceil(diferenciaTiempo / (1000 * 60 * 60 * 24));
    },
    esDomingo: (fechaStr) => {
        const [dia, mes, año] = fechaStr.split('/').map(Number);
        const fecha = new Date(2000 + año, mes - 1, dia);
        return fecha.getDay() === 0;
    },
    esFeriado: (fechaStr) => {
        const [dia, mes, año] = fechaStr.split('/').map(Number);
        const year = año < 50 ? 2000 + año : 1900 + año;
        const feriados = obtenerFeriados(year);
        return feriados.includes(fechaStr);
    },
    esFechaFutura: (fechaStr) => {
        const [dia, mes, año] = fechaStr.split('/').map(Number);
        const fechaIngresada = new Date(2000 + año, mes - 1, dia);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        return fechaIngresada >= hoy;
    }
};

// Cálculo de feriados
function calcularPascua(year) {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(year, month - 1, day);
}

function obtenerFeriados(year) {
    if (feriadosCache.has(year)) {
        return feriadosCache.get(year);
    }

    const pascua = calcularPascua(year);
    const juevesSanto = new Date(pascua);
    juevesSanto.setDate(pascua.getDate() - 3);
    const viernesSanto = new Date(pascua);
    viernesSanto.setDate(pascua.getDate() - 2);

    const formatDate = (date) => utilidadesFecha.formatearFecha(date);
    const feriados = [
        `01/01/${year.toString().slice(-2)}`,
        formatDate(juevesSanto),
        formatDate(viernesSanto),
        `01/05/${year.toString().slice(-2)}`,
        `07/06/${year.toString().slice(-2)}`,
        `29/06/${year.toString().slice(-2)}`,
        `23/07/${year.toString().slice(-2)}`,
        `28/07/${year.toString().slice(-2)}`,
        `29/07/${year.toString().slice(-2)}`,
        `06/08/${year.toString().slice(-2)}`,
        `30/08/${year.toString().slice(-2)}`,
        `08/10/${year.toString().slice(-2)}`,
        `01/11/${year.toString().slice(-2)}`,
        `08/12/${year.toString().slice(-2)}`,
        `09/12/${year.toString().slice(-2)}`,
        `25/12/${year.toString().slice(-2)}`
    ];

    feriadosCache.set(year, feriados);
    localStorage.setItem(`feriados-${year}`, JSON.stringify(feriados));
    return feriados;
}

function cargarFeriadosDesdeCache() {
    const anioActual = new Date().getFullYear();
    for (let i = 0; i < 5; i++) { // Cargar algunos años alrededor del actual
        const anio = anioActual - 2 + i;
        const feriadosGuardados = localStorage.getItem(`feriados-${anio}`);
        if (feriadosGuardados) {
            feriadosCache.set(anio, JSON.parse(feriadosGuardados));
        }
    }
}


function resaltarDias(element, fecha) {
    const diaSemana = fecha.getDay();
    const fechaStr = utilidadesFecha.formatearFecha(fecha);
    const year = fecha.getFullYear();
    const feriadosAño = obtenerFeriados(year);

    if (diaSemana === 0 || feriadosAño.includes(fechaStr)) {
        element.classList.add('feriado');
    } else {
        element.classList.remove('feriado');
    }
}

// Utilidades de UI
function mostrarToast(mensaje, tipo = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = mensaje;
    toast.className = `toast ${tipo}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function mostrarLoading(mostrar) {
    const loading = document.getElementById('loading');
    loading.style.display = mostrar ? 'flex' : 'none';
}

function mostrarConfirmacion(mensaje) {
    return new Promise(resolve => {
        const modal = document.getElementById('confirm-modal');
        const messageEl = document.getElementById('confirm-message');
        const okBtn = document.getElementById('confirm-ok');
        const cancelBtn = document.getElementById('confirm-cancel');

        messageEl.textContent = mensaje;
        modal.classList.add('show');

        const close = (decision) => {
            modal.classList.remove('show');
            // Limpiamos los listeners para evitar fugas de memoria
            okBtn.replaceWith(okBtn.cloneNode(true));
            cancelBtn.replaceWith(cancelBtn.cloneNode(true));
            resolve(decision);
        };

        document.getElementById('confirm-ok').onclick = () => close(true);
        document.getElementById('confirm-cancel').onclick = () => close(false);
    });
}

function formatearFechasParaTextarea(fechas) {
    const isSmallScreen = window.innerWidth <= 480;
    const fechasOrdenadas = fechas.sort((a, b) => {
        const [diaA, mesA, añoA] = a.split('/').map(Number);
        const [diaB, mesB, añoB] = b.split('/').map(Number);
        return new Date(2000 + añoA, mesA - 1, diaA) - new Date(2000 + añoB, mesB - 1, diaB);
    });

    const grupos = [];
    for (let i = 0; i < fechasOrdenadas.length; i += 10) {
        const grupo = fechasOrdenadas.slice(i, i + 10);
        if (isSmallScreen) {
            grupos.push(grupo.join(', '));
        } else {
            grupos.push(grupo.join(' '));
        }
    }
    return grupos.join('\n');
}

class GestorCalendario {
    constructor() {
        this.fechasSeleccionadas = new Set();
        this.mesActual1 = new Date();
        this.mesActual1.setDate(1);
        this.mesActual2 = new Date();
        this.mesActual2.setDate(1);
        this.mesActual2.setMonth(this.mesActual2.getMonth() + 1);

        this.diasContenedor1 = document.querySelector('#calendario-dias-1');
        this.diasContenedor2 = document.querySelector('#calendario-dias-2');
        this.mesActualSpan1 = document.getElementById('mes-actual-1');
        this.mesActualSpan2 = document.getElementById('mes-actual-2');
        this.listaFechas = document.getElementById('lista-fechas');
        this.contador = document.getElementById('contador-fechas');

        this.generarCalendarios();
        this.configurarEventos();
    }

    generarCalendarios() {
        this.mesActualSpan1.textContent = this.mesActual1.toLocaleString('es-PE', { 
            month: 'long', 
            year: 'numeric' 
        }).replace(/^\w/, c => c.toUpperCase());
        this.diasContenedor1.innerHTML = '';
        this.generarDias(this.mesActual1, this.diasContenedor1);

        this.mesActualSpan2.textContent = this.mesActual2.toLocaleString('es-PE', { 
            month: 'long', 
            year: 'numeric' 
        }).replace(/^\w/, c => c.toUpperCase());
        this.diasContenedor2.innerHTML = '';
        this.generarDias(this.mesActual2, this.diasContenedor2);
    }

    generarDias(mesActual, diasContenedor) {
        const primerDia = new Date(mesActual.getFullYear(), mesActual.getMonth(), 1).getDay();
        const diasEnMes = new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 0).getDate();

        for (let i = 0; i < primerDia; i++) {
            const div = document.createElement('div');
            div.className = 'dia vacio';
            diasContenedor.appendChild(div);
        }

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        
        for (let dia = 1; dia <= diasEnMes; dia++) {
            const fecha = new Date(mesActual.getFullYear(), mesActual.getMonth(), dia);
            const fechaStr = utilidadesFecha.formatearFecha(fecha);
            const div = document.createElement('div');
            div.className = 'dia';
            div.textContent = dia;
            resaltarDias(div, fecha);
            
            if (fecha < hoy) {
                div.classList.add('vacio');
            } else {
                if (this.fechasSeleccionadas.has(fechaStr)) {
                    div.classList.add('seleccionada');
                }
                div.addEventListener('click', () => this.toggleFecha(fechaStr, div));
            }
            diasContenedor.appendChild(div);
        }
    }

    toggleFecha(fechaStr, div) {
        if (this.fechasSeleccionadas.has(fechaStr)) {
            this.fechasSeleccionadas.delete(fechaStr);
            div.classList.remove('seleccionada');
        } else {
            if (this.fechasSeleccionadas.size >= 100) {
                mostrarToast('Máximo 100 fechas permitidas', 'error');
                return;
            }
            this.fechasSeleccionadas.add(fechaStr);
            div.classList.add('seleccionada');
        }
        this.actualizarLista();
        this.sincronizarSeleccion();
    }

    sincronizarSeleccion() {
        const dias1 = this.diasContenedor1.querySelectorAll('.dia');
        dias1.forEach(dia => {
            const fecha = new Date(this.mesActual1.getFullYear(), this.mesActual1.getMonth(), parseInt(dia.textContent));
            const fechaStr = utilidadesFecha.formatearFecha(fecha);
            if (this.fechasSeleccionadas.has(fechaStr)) {
                dia.classList.add('seleccionada');
            } else {
                dia.classList.remove('seleccionada');
            }
        });

        const dias2 = this.diasContenedor2.querySelectorAll('.dia');
        dias2.forEach(dia => {
            const fecha = new Date(this.mesActual2.getFullYear(), this.mesActual2.getMonth(), parseInt(dia.textContent));
            const fechaStr = utilidadesFecha.formatearFecha(fecha);
            if (this.fechasSeleccionadas.has(fechaStr)) {
                dia.classList.add('seleccionada');
            } else {
                dia.classList.remove('seleccionada');
            }
        });
    }

    actualizarLista() {
        this.listaFechas.innerHTML = '';
        const fechasOrdenadas = Array.from(this.fechasSeleccionadas).sort((a, b) => {
            const [diaA, mesA, añoA] = a.split('/').map(Number);
            const [diaB, mesB, añoB] = b.split('/').map(Number);
            return new Date(2000 + añoA, mesA - 1, diaA) - new Date(2000 + añoB, mesB - 1, diaB);
        });

        fechasOrdenadas.forEach((fecha, index) => {
            const dias = utilidadesFecha.calcularDiferenciaDias(fecha);
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td class="${utilidadesFecha.esDomingo(fecha) || utilidadesFecha.esFeriado(fecha) ? 'feriado' : ''}">${fecha}</td>
                <td>${dias}</td>
            `;
            this.listaFechas.appendChild(tr);
        });

        this.contador.textContent = `Fechas seleccionadas: ${this.fechasSeleccionadas.size}`;
    }

    copiarFechas() {
        const fechas = Array.from(this.fechasSeleccionadas).sort();
        if (fechas.length === 0) {
            mostrarToast('No hay fechas seleccionadas para copiar', 'error');
            return;
        }
        const texto = formatearFechasParaTextarea(fechas);
        navigator.clipboard.writeText(texto)
            .then(() => mostrarToast('Fechas copiadas al portapapeles'))
            .catch(err => mostrarToast('Error al copiar: ' + err, 'error'));
    }

    async limpiarTodo() {
        if (this.fechasSeleccionadas.size > 0) {
            const confirmado = await mostrarConfirmacion('¿Seguro que quieres limpiar todas las fechas seleccionadas?');
            if (!confirmado) {
                return;
            }
        }

        this.fechasSeleccionadas.clear();
        
        // Regresar al mes actual
        this.mesActual1 = new Date();
        this.mesActual1.setDate(1);
        this.mesActual2 = new Date();
        this.mesActual2.setDate(1);
        this.mesActual2.setMonth(this.mesActual2.getMonth() + 1);

        this.generarCalendarios();
        this.actualizarLista();
        mostrarToast('Todas las fechas han sido eliminadas');
    }

    configurarEventos() {
        document.getElementById('tema').addEventListener('click', () => this.cambiarTema());
        document.getElementById('copiarFechas').addEventListener('click', () => this.copiarFechas());
        document.getElementById('limpiarTodo').addEventListener('click', () => this.limpiarTodo());
        document.getElementById('siguientePagina').addEventListener('click', () => showPage('page2'));
        
        document.getElementById('mes-anterior-1').addEventListener('click', () => this.cambiarMeses(-1));
        document.getElementById('mes-siguiente-1').addEventListener('click', () => this.cambiarMeses(1));
        document.getElementById('mes-anterior-2').addEventListener('click', () => this.cambiarMeses(-1));
        document.getElementById('mes-siguiente-2').addEventListener('click', () => this.cambiarMeses(1));
    }

    /**
     * Cambia los meses de ambos calendarios de forma sincronizada.
     * @param {number} offset - El número de meses a mover (-1 para anterior, 1 para siguiente).
     */
    cambiarMeses(offset) {
        // Siempre se mueve el primer calendario y el segundo lo sigue.
        this.mesActual1.setMonth(this.mesActual1.getMonth() + offset);
        this.mesActual2 = new Date(this.mesActual1);
        this.mesActual2.setMonth(this.mesActual2.getMonth() + 1);
        this.generarCalendarios();
    }

    cambiarTema() {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        document.getElementById('tema').innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        if (document.getElementById('tema2')) {
            document.getElementById('tema2').innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        }
        localStorage.setItem('temaOscuro', isDark);
    }
}

class GestorMontos {
    constructor() {
        this.cliente = document.getElementById('cliente');
        this.descCliente = document.getElementById('descCliente');
        this.linea = document.getElementById('linea');
        this.pedido = document.getElementById('pedido');
        this.monto = document.getElementById('monto');
        this.fechasInput = document.getElementById('fechas');
        this.resumenTabla = document.querySelector('#resumen-tabla');
        this.detalleTabla = document.querySelector('#detalle-tabla');
        this.detalleThead = document.querySelector('#detalle-thead');
        this.configurarEventos();
    }

    configurarEventos() {
        document.getElementById('distribuir').addEventListener('click', () => this.calcular());
        document.getElementById('limpiar2').addEventListener('click', () => this.limpiar());
        document.getElementById('descargarExcel').addEventListener('click', () => this.descargarExcel());
        document.getElementById('atrasPagina').addEventListener('click', () => showPage('page1'));
        document.getElementById('tema2').addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            document.getElementById('tema2').innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            document.getElementById('tema').innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            localStorage.setItem('temaOscuro', isDark);
        });

        this.monto.addEventListener('input', () => {
            let value = this.monto.value;
            if (value < 0) {
                this.monto.value = 0;
                mostrarToast('El monto no puede ser negativo', 'error');
            }
        });

        this.fechasInput.addEventListener('input', () => {
            const fechas = this.fechasInput.value.split('\n').flatMap(line => line.split(/,\s*|\s+/).filter(f => f));
            const invalidas = fechas.filter(f => f.trim() && (!utilidadesFecha.esFormatoFechaValido(f) || !utilidadesFecha.esFechaFutura(f)));
            if (invalidas.length > 0) {
                mostrarToast('Algunas fechas son inválidas o pasadas', 'error');
            }
            this.fechasInput.value = formatearFechasParaTextarea(fechas);
        });
    }

    calcular() {
        if (!this.descCliente.value || !this.linea.value || !this.pedido.value || !this.monto.value || !this.fechasInput.value) {
            mostrarToast('Todos los campos son requeridos, excepto Código Cliente', 'error');
            return;
        }
        
        const monto = parseFloat(this.monto.value);
        if (isNaN(monto) || monto <= 0) {
            mostrarToast('Ingrese un monto válido mayor a 0', 'error');
            return;
        }
        
        const fechas = this.fechasInput.value.split('\n').flatMap(line => line.split(/,\s*|\s+/).filter(f => f))
            .filter(f => utilidadesFecha.esFormatoFechaValido(f) && utilidadesFecha.esFechaFutura(f));
        if (fechas.length === 0) {
            mostrarToast('Ingrese al menos una fecha válida y futura', 'error');
            return;
        }

        const meses = {};
        fechas.forEach(fecha => {
            const [, mes, año] = fecha.split('/').map(Number);
            const key = `${mes}/${año}`;
            meses[key] = (meses[key] || 0) + 1;
            if (meses[key] > 20) {
                mostrarToast(`Máximo 20 fechas por mes (${key})`, 'error');
                return;
            }
        });

        if (Object.keys(meses).length > 12) {
            mostrarToast('Máximo 12 meses permitidos', 'error');
            return;
        }

        mostrarLoading(true);
        setTimeout(() => {
            try {
                this.procesarCalculo(monto, fechas);
                mostrarToast('Cálculo completado correctamente');
            } catch (error) {
                console.error('Error en cálculo:', error);
                mostrarToast('Error al procesar el cálculo', 'error');
            } finally {
                mostrarLoading(false);
            }
        }, 100);
    }

    procesarCalculo(monto, fechas) {
        const montoPorFecha = (monto / fechas.length).toFixed(2);
        const montosPorFecha = {};
        fechas.forEach(fecha => montosPorFecha[fecha] = parseFloat(montoPorFecha));

        this.detalleThead.innerHTML = '';
        this.detalleTabla.innerHTML = '';
        
        const fechasOrdenadas = [...fechas].sort((a, b) => {
            const [diaA, mesA, añoA] = a.split('/').map(Number);
            const [diaB, mesB, añoB] = b.split('/').map(Number);
            return new Date(2000 + añoA, mesA - 1, diaA) - new Date(2000 + añoB, mesB - 1, diaB);
        });

        const mesesUnicos = [...new Set(fechasOrdenadas.map(f => f.slice(3)))].sort((a, b) => {
            const [mesA, añoA] = a.split('/').map(Number);
            const [mesB, añoB] = b.split('/').map(Number);
            return new Date(2000 + añoA, mesA - 1) - new Date(2000 + añoB, mesB - 1);
        });

        const filaMeses = document.createElement('tr');
        mesesUnicos.forEach(m => {
            const [mes, año] = m.split('/').map(Number);
            const montoMes = fechasOrdenadas
                .filter(f => f.slice(3) === m)
                .reduce((sum, f) => sum + montosPorFecha[f], 0);
            const porcentaje = ((montoMes / monto) * 100).toFixed(0);
            
            filaMeses.innerHTML += `
                <th>${new Date(2000 + año, mes - 1).toLocaleString('es-PE', { month: 'long' }).toUpperCase()}</th>
                <th>${porcentaje}%</th>
            `;
        });
        this.detalleThead.appendChild(filaMeses);

        const filaEncabezados = document.createElement('tr');
        mesesUnicos.forEach(() => {
            filaEncabezados.innerHTML += `
                <th>FECHA</th>
                <th>S/. MONTO</th>
            `;
        });
        this.detalleThead.appendChild(filaEncabezados);

        const fechasPorMes = mesesUnicos.map(m => fechasOrdenadas.filter(f => f.slice(3) === m));
        const maxFilas = Math.max(...fechasPorMes.map(fechasMes => fechasMes.length));
        
        for (let i = 0; i < maxFilas; i++) {
            const fila = document.createElement('tr');
            mesesUnicos.forEach((m, idx) => {
                const fechasMes = fechasPorMes[idx];
                if (i < fechasMes.length) {
                    const fecha = fechasMes[i];
                    fila.innerHTML += `
                        <td>${fecha}</td>
                        <td class="monto-container">
                            <span class="monto-prefijo">S/</span>
                            <input type="text" inputmode="decimal" 
                                   value="${montosPorFecha[fecha].toFixed(2)}" 
                                   class="monto-fecha" 
                                   data-fecha="${fecha}">
                        </td>
                    `;
                } else {
                    fila.innerHTML += '<td></td><td></td>';
                }
            });
            this.detalleTabla.appendChild(fila);
        }

        const filaTotales = document.createElement('tr');
        filaTotales.className = 'totales-fila';
        mesesUnicos.forEach(m => {
            const totalMes = fechasOrdenadas
                .filter(f => f.slice(3) === m)
                .reduce((sum, f) => sum + montosPorFecha[f], 0);
            
            filaTotales.innerHTML += `
                <td><strong>TOTAL</strong></td>
                <td><strong>S/ ${totalMes.toFixed(2)}</strong></td>
            `;
        });
        this.detalleTabla.appendChild(filaTotales);

        // Actualizar la tabla de resumen y los totales usando los métodos de ayuda
        this.actualizarTotales(montosPorFecha, fechasOrdenadas, mesesUnicos);
        this.agregarEventosInputs(montosPorFecha, fechasOrdenadas, mesesUnicos);
    }

    _renderizarResumen(montosPorFecha, fechas) {
        const montoTotal = parseFloat(this.monto.value);
        this.resumenTabla.innerHTML = '';
        const resumen = {};
        fechas.forEach(fecha => {
            const [, mes, año] = fecha.split('/').map(Number);
            const key = `${mes}/${año}`;
            resumen[key] = (resumen[key] || 0) + (montosPorFecha[fecha] || 0);
        });
        
        let totalMontoCalculado = 0;
        Object.entries(resumen).forEach(([key, montoMes]) => {
            const [mes, año] = key.split('/').map(Number);
            const porcentaje = ((montoMes / montoTotal) * 100).toFixed(2);
            totalMontoCalculado += montoMes;
            
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${new Date(2000 + año, mes - 1).toLocaleString('es-PE', { month: 'long' }).toUpperCase()} ${año}</td>
                <td>S/ ${montoMes.toFixed(2)}</td>
                <td>${porcentaje}%</td>
            `;
            this.resumenTabla.appendChild(fila);
        });
        
        const totalFila = document.createElement('tr');
        totalFila.innerHTML = `
            <td>Totales</td>
            <td class="${totalMontoCalculado.toFixed(2) === montoTotal.toFixed(2) ? 'valido' : 'invalido'}">S/ ${totalMontoCalculado.toFixed(2)}</td>
            <td>${((totalMontoCalculado / montoTotal) * 100).toFixed(0)}%</td>
        `;
        this.resumenTabla.appendChild(totalFila);
    }

    _actualizarTotalesDetalle(montosPorFecha, fechas, mesesUnicos) {
        const filaTotales = document.querySelector('.totales-fila');
        if (!filaTotales) return;

        filaTotales.innerHTML = '';
        mesesUnicos.forEach(m => {
            const totalMes = fechas.filter(f => f.slice(3) === m).reduce((sum, f) => sum + (montosPorFecha[f] || 0), 0);
            filaTotales.innerHTML += `<td><strong>TOTAL</strong></td><td><strong>S/ ${totalMes.toFixed(2)}</strong></td>`;
        });
    }

    agregarEventosInputs(montosPorFecha, fechas, mesesUnicos) {
        document.querySelectorAll('.monto-fecha').forEach(input => {
            input.addEventListener('input', () => {
                let value = input.value;
                value = value.replace(/[^0-9.]/g, '');
                const parts = value.split('.');
                if (parts.length > 2) {
                    value = parts[0] + '.' + parts.slice(1).join('');
                }
                input.value = value;

                if (parseFloat(value) < 0) {
                    input.value = '0.00';
                    mostrarToast('El monto no puede ser negativo', 'error');
                }
            });

            input.addEventListener('blur', () => {
                const fecha = input.dataset.fecha;
                let valor = parseFloat(input.value) || 0;
                if (valor < 0) valor = 0;
                montosPorFecha[fecha] = valor;
                input.value = valor.toFixed(2);
                this.actualizarTotales(montosPorFecha, fechas, mesesUnicos);
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    input.blur();
                }
            });
        });
    }

    actualizarTotales(montosPorFecha, fechas, mesesUnicos) {
        this._renderizarResumen(montosPorFecha, fechas);
        this._actualizarTotalesDetalle(montosPorFecha, fechas, mesesUnicos);
    }

    async limpiar() {
        const confirmado = await mostrarConfirmacion('¿Seguro que quieres limpiar todos los datos del formulario?');
        if (!confirmado) {
            return;
        }
        this.cliente.value = '';
        this.descCliente.value = '';
        this.linea.value = '';
        this.pedido.value = '';
        this.monto.value = '';
        this.fechasInput.value = '';
        this.resumenTabla.innerHTML = '';
        this.detalleTabla.innerHTML = '';
        this.detalleThead.innerHTML = '';
        mostrarToast('Formulario limpiado');
    }

    descargarExcel() {
        if (!this.descCliente.value || !this.linea.value || !this.pedido.value || !this.monto.value || !this.fechasInput.value) {
            mostrarToast('Complete todos los campos requeridos', 'error');
            return;
        }

        const monto = parseFloat(this.monto.value);
        if (isNaN(monto) || monto <= 0) {
            mostrarToast('Ingrese un monto válido', 'error');
            return;
        }

        mostrarLoading(true);
        setTimeout(() => {
            try {
                this.generarYDescargarExcel();
                mostrarToast('Excel generado correctamente');
            } catch (error) {
                console.error('Error al generar Excel:', error);
                mostrarToast('Error al generar Excel', 'error');
            } finally {
                mostrarLoading(false);
            }
        }, 100);
    }

    generarYDescargarExcel() {
        const monto = parseFloat(this.monto.value);
        const fechas = this.fechasInput.value.split('\n').flatMap(line => line.split(/,\s*|\s+/).filter(f => f))
            .filter(f => utilidadesFecha.esFormatoFechaValido(f) && utilidadesFecha.esFechaFutura(f));
        
        const montosPorFecha = {};
        document.querySelectorAll('.monto-fecha').forEach(input => {
            const fecha = input.dataset.fecha;
            montosPorFecha[fecha] = parseFloat(input.value) || 0;
        });
    
        // Normalizar cadenas para evitar problemas con caracteres especiales
        const normalizeString = (str) => {
            return (str || '')
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-zA-Z0-9\s-]/g, '') // Permite guiones
                .replace(/\s+/g, '_'); // Reemplaza espacios con guiones bajos
        };
    
        const data = [
            ['REPORTE DE DISTRIBUCION DE MONTOS POR FECHA'],
            [],
            ['Informacion General'],
            ['Cliente:', normalizeString(this.descCliente.value)],
            ['Linea:', normalizeString(this.linea.value)],
            ['Pedido:', normalizeString(this.pedido.value)],
            ['Monto Total:', `S/ ${monto.toFixed(2)}`],
            ['Total Fechas:', fechas.length],
            [],
            ['Resumen Mensual'],
            ['Mes', 'Monto (S/)', 'Porcentaje']
        ];
    
        const resumenRows = Array.from(this.resumenTabla.querySelectorAll('tr'));
        resumenRows.forEach(row => {
            const montoValue = parseFloat(row.cells[1].textContent.replace('S/ ', '')) || 0;
            data.push([
                normalizeString(row.cells[0].textContent.trim()),
                montoValue,
                row.cells[2].textContent.trim()
            ]);
        });
    
        data.push([], ['Detalle por Fecha']);
        
        const mesesUnicos = [...new Set(fechas.map(f => f.slice(3)))].sort((a, b) => {
            const [mesA, añoA] = a.split('/').map(Number);
            const [mesB, añoB] = b.split('/').map(Number);
            return new Date(2000 + añoA, mesA - 1) - new Date(2000 + añoB, mesB - 1);
        });
    
        const headerMeses = [];
        const headerSub = [];
        mesesUnicos.forEach(m => {
            const [mes, año] = m.split('/').map(Number);
            const nombreMes = new Date(2000 + año, mes - 1).toLocaleString('es-PE', { month: 'long' }).toUpperCase();
            const montoMes = fechas
                .filter(f => f.slice(3) === m)
                .reduce((sum, f) => sum + (montosPorFecha[f] || 0), 0);
            const porcentaje = ((montoMes / monto) * 100).toFixed(0);
            
            headerMeses.push(normalizeString(nombreMes), `${porcentaje}%`);
            headerSub.push('FECHA', 'S/. MONTO');
        });
        
        data.push(headerMeses, headerSub);
    
        const fechasOrdenadas = [...fechas].sort((a, b) => {
            const [diaA, mesA, añoA] = a.split('/').map(Number);
            const [diaB, mesB, añoB] = b.split('/').map(Number);
            return new Date(2000 + añoA, mesA - 1, diaA) - new Date(2000 + añoB, mesB - 1, diaB);
        });
    
        const fechasPorMes = mesesUnicos.map(m => 
            fechasOrdenadas.filter(f => f.slice(3) === m)
        );
    
        const maxFilas = Math.max(...fechasPorMes.map(fechasMes => fechasMes.length));
    
        for (let i = 0; i < maxFilas; i++) {
            const row = [];
            
            mesesUnicos.forEach((m, index) => {
                if (i < fechasPorMes[index].length) {
                    const fecha = fechasPorMes[index][i];
                    row.push(fecha, montosPorFecha[fecha] || 0);
                } else {
                    row.push('', '');
                }
            });
            
            data.push(row);
        }
    
        const totalRow = [];
        mesesUnicos.forEach(m => {
            const totalMes = fechasOrdenadas
                .filter(f => f.slice(3) === m)
                .reduce((sum, f) => sum + (montosPorFecha[f] || 0), 0);
            totalRow.push('TOTAL', totalMes);
        });
        data.push(totalRow);
    
        // Depurar el contenido de data
        console.log('Datos que se escribirán en el Excel:', data);
    
        const ws = XLSX.utils.aoa_to_sheet(data);

        // --- Mejoras de Estructura y Estilo para Excel ---

        // 1. Fusión de Celdas para Títulos
        const merges = [
            // Título principal
            { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }, 
            // Título 'Informacion General'
            { s: { r: 2, c: 0 }, e: { r: 2, c: 1 } },
            // Título 'Resumen Mensual'
            { s: { r: 9, c: 0 }, e: { r: 9, c: 2 } },
            // Título 'Detalle por Fecha'
            { s: { r: 12 + resumenRows.length, c: 0 }, e: { r: 12 + resumenRows.length, c: mesesUnicos.length * 2 - 1 } }
        ];
        ws['!merges'] = merges;

        // 2. Formato de Celdas (lo que es compatible con la versión gratuita)
        const range = XLSX.utils.decode_range(ws['!ref']);
        for (let row = 0; row <= range.e.r; row++) {
            for (let col = 0; col <= range.e.c; col++) {
                const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
                const cell = ws[cellAddress];
                if (!cell) continue;
    
                // Aplicar formato de moneda a las celdas de monto
                if ((row >= 10 && row < 10 + resumenRows.length && col === 1) || 
                    (row > 13 + resumenRows.length && col % 2 === 1 && typeof cell.v === 'number')) {
                    cell.t = 'n';
                    cell.z = '"S/" #,##0.00';
                }
            }
        }

        // 3. Ancho de Columnas
        ws['!cols'] = [];
        for (let col = 0; col <= range.e.c; col++) {
            ws['!cols'].push({ wch: col === 0 ? 25 : (col % 2 !== 0 ? 15 : 12) });
        }

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
    
        const lineaSafe = normalizeString(this.linea.value);
        const descClienteSafe = normalizeString(this.descCliente.value);
        const nombreArchivo = `fechas_${lineaSafe}_${descClienteSafe}.xlsx`;
    
        XLSX.writeFile(wb, nombreArchivo);
    }
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    window.scrollTo(0, 0);
}

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('temaOscuro') === 'true') {
        document.body.classList.add('dark-theme');
        document.querySelectorAll('#tema, #tema2').forEach(btn => {
            btn.innerHTML = '<i class="fas fa-sun"></i>';
        });
    }

    cargarFeriadosDesdeCache();

    const gestorCalendario = new GestorCalendario();
    const gestorMontos = new GestorMontos();
});