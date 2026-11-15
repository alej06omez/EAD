import { Paquete } from '../src/Paquete.js';
import { consolidarPaquetes, generarRanking, leerCaso } from '../src/util.js';

const formulario = document.getElementById('elFormulario');
const entrada = document.getElementById('laInfo');
const salida = document.getElementById('salida');
const btnOrdenar = document.getElementById("ordenar");
const btnMostrar = document.getElementById("mostrar");
const btnLimpiar = document.getElementById("limpiar");
const btnCleanSalida = document.getElementById("cleanSalida");

let paquetesBD = [];
const destinosBD = new Set();

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
        paquetesBD.push(obj)
        return obj.toString();
    });
    let paquetesGuardados=consolidarPaquetes(paquetesBD)
    paquetesBD = []
    paquetesBD = paquetesGuardados
    // Une las m líneas en O(m) tiempo y espacio.
    return textos.join('\n');
}

// Lista los registros cargados y muestra su fecha.
function mostrarPaquetes(inicio, fin) {

    if (inicio > fin || inicio >= paquetesBD.length) {
        return 'revisate los rangos';}

    if (inicio === fin) {
        return paquetesBD[inicio].toString() + '\n\n';
    }
    if (fin - inicio < 4) {
        let resultado = "";

        for (let i = inicio; i <= fin; i++) {
            resultado += paquetesBD[i].toString() + "\n\n";
        }

        return resultado;
    }
    // El texto mostrado ocupa O(m) espacio.
    //recursividad
    else{
        let rango = fin - inicio;
        let cuarto = Math.floor(rango/4);
        
        let r1 = mostrarPaquetes (inicio, inicio + cuarto -1)
        let r2 = mostrarPaquetes(inicio + cuarto, inicio + ((2*cuarto) -1))
        let r3 = mostrarPaquetes(inicio + (2*cuarto), inicio + ((3*cuarto) - 1))
        let r4 = mostrarPaquetes(inicio + (3*cuarto), fin)

        return r1 + r2 + r3 + r4
    }
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
    
    paquetesBD = [];
    destinosBD.clear();
    entrada.value = '';
    salida.value = '';
}

// Envía el caso al servidor y carga los datos que devuelve.
formulario.addEventListener('submit', async (event) => {
    event.preventDefault();

    const textoPaquete = entrada.value;
    try {
        // La transferencia procesa O(L) bytes para una entrada de tamaño L.
        const respuesta = await fetch('/casita', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: textoPaquete,
        });

        if (!respuesta.ok) {
            salida.value = 'Ocurrió un error.';
            return;
        }

        // Decodifica la respuesta en O(L) tiempo y espacio.
        const guardado = await respuesta.json();
        

        const paquete = ingresarPaquete(guardado);

        // Escribe el mensaje y las m líneas de salida.
        salida.value = 'Paquete ingresado correctamente.\n';
        salida.value += paquete;
    } catch (error) {
        salida.value = 'Error con el servidor.';
        console.error(error);
    }
});

// Muestra los registros guardados.
btnMostrar.addEventListener('click', (event) => {
    event.preventDefault();
    salida.value = '';
    if (paquetesBD.length === 0) {
        salida.value = 'No hay paquetes ingresados.';
        return;
    }
    else{
        let inicio = 0;
        let final = paquetesBD.length - 1;
        let textomostrar = mostrarPaquetes(inicio, final);
        salida.value = textomostrar;
    }
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

btnCleanSalida.addEventListener('click', (event) => {
    event.preventDefault();
    salida.value = '';
    entrada.value = '';
});