import {Paquete} from './src/Paquete.js';

const formulario = document.getElementById('elFormulario');
const salida = document.getElementById('salida');
const btnOrdenar = document.getElementById("ordenar");
const btnConsultar = document.getElementById("calcular");

btnOrdenar.addEventListener('click',ordenarVehiculos);
btnConsultar.addEventListener('click',listarVehiculos);

let PaqueteBD = []
let ordenado = false;

function mostrarInformacion(paquete) {
    return `
ID: ${paquete.id}
Destino: ${paquete.destino}
Peso: ${paquete.peso}
Estado: ${paquete.status}
    `;
}

function ingresarPaquete(){
    let id = document.getElementById("id").value;
    let destino = document.getElementById("destino").value;
    let peso = document.getElementById("peso").value;
    let status = document.getElementById("status").value;
    let timpestamp; //por definir tambien

    let obj = new Paquete(id,destino,peso,status,timpestamp)
    PaqueteBD.push(obj)
    salida.value = obj.toString();
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

        


    } catch (error) {
        salida.value = 'Error con el servidor.';
        console.error(error);
    }
});