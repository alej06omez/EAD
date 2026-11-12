import { Paquete } from '../src/Paquete.js';
import { consolidarPaquetes, generarRanking, leerCaso } from '../src/util.js';

const formulario = document.getElementById('elFormulario');
const entrada = document.getElementById('laInfo');
const salida = document.getElementById('salida');
const btnOrdenar = document.getElementById("ordenar");
const btnMostrar = document.getElementById("mostrar");
const btnCalcular = document.getElementById("calcular");
const btnLimpiar = document.getElementById("limpiar");

let paquetesBD = [];
const destinosBD = new Set();
let controladorGuardado = new AbortController();

// n: destinos, m: registros, k: paquetes distintos. Se suponen campos acotados.

// Agrega un caso al estado de la página y devuelve sus registros como texto.
// Tiempo y espacio O(n + m), medidos para el caso que se agrega.
function ingresarPaquete(cadena) {
    const { destinos, paquetes } = leerCaso(cadena);
    // Guarda los destinos en O(n) tiempo y hasta O(n) espacio adicionales.
    for (const destino of destinos) {
        destinosBD.add(destino);
    }

    // Crea los m paquetes y sus líneas de salida en O(m) tiempo y espacio.
    const textos = paquetes.map((p) => {
        const obj = new Paquete(p.id, p.destino, p.peso, p.estado, p.timestamp);
        paquetesBD.push(obj);
        return obj.toString();
    });

    // Une las m líneas en O(m) tiempo y espacio.
    return textos.join('\n');
}

// Lista los registros cargados y muestra su fecha.
function mostrarPaquetes() {
    salida.value = '';
    if (paquetesBD.length === 0) {
        salida.value = 'No hay paquetes ingresados.';
        return;
    }
    // Reescribir el texto acumulado en cada vuelta puede costar O(m²).
    // El texto mostrado ocupa O(m) espacio.
    for (let i = 0; i < paquetesBD.length; i++) {
        const fechaLegible = new Date(paquetesBD[i].timestamp).toLocaleString();
        salida.value +=
            paquetesBD[i].toString() +
            '\nFecha: ' + fechaLegible +
            '\n\n';
    }
}

// Muestra la cantidad de paquetes distintos y su peso total.
// Tiempo O(m + k) y espacio auxiliar O(k).
function calcular() {
    if (paquetesBD.length === 0) {
        salida.value = 'No hay paquetes ingresados.';
        return;
    }

    // Conserva los k paquetes en O(m + k) tiempo y O(k) espacio.
    const consolidados = consolidarPaquetes(paquetesBD);

    // Suma los k pesos en O(k) tiempo y O(1) espacio adicional.
    const pesoTotal = consolidados.reduce(
        (suma, p) => suma + Number(p.peso), 0
    );

    salida.value =
        `Cantidad de paquetes diferentes: ${consolidados.length}\n` +
        `Peso total: ${pesoTotal}`;
}

// Muestra el ranking de los destinos cargados.
// Tiempo O(n + m + k + n log n) y espacio auxiliar O(n + k).
function mostrarRanking() {
    if (paquetesBD.length === 0) {
        salida.value = 'No hay paquetes ingresados.';
        return;
    }
    try {
        salida.value = generarRanking(destinosBD, paquetesBD);
    } catch (error) {
        salida.value = error.message;
    }
}

// Cancela los guardados pendientes y vacía la entrada, la salida y los datos.
function limpiarCaso() {
    controladorGuardado.abort();
    controladorGuardado = new AbortController();
    paquetesBD = [];
    destinosBD.clear();
    entrada.value = '';
    salida.value = '';
}

// Envía el caso al servidor y carga los datos que devuelve.
formulario.addEventListener('submit', async (event) => {
    event.preventDefault();

    const textoPaquete = entrada.value;
    const { signal } = controladorGuardado;
    try {
        // La transferencia procesa O(L) bytes para una entrada de tamaño L.
        const respuesta = await fetch('/casita', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: textoPaquete,
            signal
        });

        if (signal.aborted) return;

        if (!respuesta.ok) {
            salida.value = 'Ocurrió un error.';
            return;
        }

        // Decodifica la respuesta en O(L) tiempo y espacio.
        const guardado = await respuesta.json();
        if (signal.aborted) return;

        const paquete = ingresarPaquete(guardado);

        // Escribe el mensaje y las m líneas de salida.
        salida.value = 'Paquete ingresado correctamente.\n';
        salida.value += paquete;
    } catch (error) {
        if (signal.aborted) return;
        salida.value = 'Error con el servidor.';
        console.error(error);
    }
});

// Muestra los registros guardados.
btnMostrar.addEventListener('click', (event) => {
    event.preventDefault();
    mostrarPaquetes();
});

// Calcula los totales globales.
btnCalcular.addEventListener('click', (event) => {
    event.preventDefault();
    calcular();
});

// Genera y muestra el ranking por destino.
btnOrdenar.addEventListener('click', (event) => {
    event.preventDefault();
    mostrarRanking();
});

// Reinicia el formulario y sus datos.
btnLimpiar.addEventListener('click', (event) => {
    event.preventDefault();
    limpiarCaso();
});
