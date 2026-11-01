import { Paquete } from '../src/Paquete.js';

const formulario = document.getElementById('elFormulario');
const salida = document.getElementById('salida');
//const btnOrdenar = document.getElementById("ordenar");
const btnMostrar = document.getElementById("mostrar");
//const btnCalcular = document.getElementById("calcular");

//btnOrdenar.addEventListener('click', ordenarPaquetes);
btnMostrar.addEventListener('click', mostrarPaquetes);
//btnCalcular.addEventListener('click', calcular);

let paquetesBD = [];
let ordenado = false;

function ingresarPaquete(id, destino, peso, status, timestamp) {
    let obj = new Paquete(id, destino, peso, status, timestamp);
    paquetesBD.push(obj);
    return obj.toString();
}

function mostrarPaquetes() {
    salida.value = '';
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

formulario.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(formulario);
    const datos = Object.fromEntries(formData.entries());

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

        mostrarPaquetes();
    } catch (error) {
        salida.value = 'Error con el servidor.';
        console.error(error);
    }
});


btnMostrar.addEventListener('click', (event) => {
    event.preventDefault();
    mostrarPaquetes();
});