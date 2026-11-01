import { Paquete } from '../src/Paquete.js';

const formulario = document.getElementById('elFormulario');
const salida = document.getElementById('salida');
const btnOrdenar = document.getElementById("ordenar");
const btnMostrar = document.getElementById("mostrar");
const btnCalcular = document.getElementById("calcular");
const btnLimpiar = document.getElementById("limpiar");

btnOrdenar.addEventListener('click', ordenarPaquetes);
btnMostrar.addEventListener('click', mostrarPaquetes);
btnCalcular.addEventListener('click', calcular);
btnLimpiar.addEventListener('click', limpiarSalida);
let paquetesBD = [];
let ordenado = false;


// Funciones - extraer al src/utils o algo asi - revisar doc
function ingresarPaquete(id, destino, peso, status, timestamp) { //no tiene lo del split y como debe imprimirlo con el formato que el pide
    let obj = new Paquete(id, destino, peso, status, timestamp);
    paquetesBD.push(obj);
    return obj.toString();
}

function mostrarPaquetes() { //no contiene la parte de recorrer y lo de la complejidad
    salida.value = '';      //solo lo recorre con la fecha legible para comprobar
    if (paquetesBD.length === 0) {
        salida.value = 'No hay paquetes ingresados.';
        return;
    }
    for (let i = 0; i < paquetesBD.length; i++) {
    const fechaLegible = new Date(paquetesBD[i].timestamp).toLocaleString();
    salida.value +=
        paquetesBD[i].toString() +
        '\nFecha: ' + fechaLegible +
        '\n\n';
}
}

function calcular() { //no contiene la parte de recorrer y lo de la complejidad y habla el doc de calculos
}

function ordenarPaquetes() { //no contiene la parte de recorrer y lo de la complejidad
    if (paquetesBD.length === 0) {
        salida.value = 'No hay paquetes ingresados.';
        return;
    }}
function limpiarSalida() {
    salida.value = '';
}
//hasta aqui se extrae al utils



// lo del servidor, no extraer
formulario.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(formulario);
    const datos = Object.fromEntries(formData.entries());
    //no lo muevan
    try {
        const respuesta = await fetch('/casita', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });

        if (!respuesta.ok) {
            salida.value = 'Ocurrió un error.';
            return;
        }

        const guardado = await respuesta.json();
        //console.log('Paquete guardado en el servidor:', guardado); --Pruebas
        ingresarPaquete(guardado.id, guardado.destino, guardado.peso, guardado.status, guardado.timestamp);

        salida.value = 'Paquete ingresado correctamente.';
        salida.value += guardado.toString();
    } catch (error) {
        salida.value = 'Error con el servidor.';
        console.error(error);
    }
});


btnMostrar.addEventListener('click', (event) => {
    event.preventDefault();
    mostrarPaquetes();
});

btnCalcular.addEventListener('click', (event) => {
    event.preventDefault();
    calcular();
});

btnOrdenar.addEventListener('click', (event) => {
    event.preventDefault();
    ordenarPaquetes();
});

btnLimpiar.addEventListener('click', (event) => {
    event.preventDefault();
    limpiarSalida();
});