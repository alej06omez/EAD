import {Paquete} from '../src/Paquete.js';

const formulario = document.getElementById('elFormulario');
const salida = document.getElementById('salida');
const btnOrdenar = document.getElementById("ordenar");
const btnMostrar = document.getElementById("mostrar");
const btnConsultar = document.getElementById("calcular");

btnOrdenar.addEventListener('click',ordenarVehiculos);
btnMostrar.addEventListener('click',mostrarVehiculos);
btnConsultar.addEventListener('click',listarVehiculos);

let PaqueteBD = []
let ordenado = false;



function ingresarPaquete(id, destino, peso, status, timestamp) {
    let obj = new Paquete(id, destino, peso, status, timestamp);
    PaqueteBD.push(obj);
    return obj.toString();
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

        const resultado = await respuesta.json();

        salida.value = ingresarPaquete(resultado.id, resultado.destino, resultado.peso, resultado.status, resultado.timestamp);


    } catch (error) {
        salida.value = 'Error con el servidor.';
        console.error(error);
    }
});