import { Paquete } from '../src/Paquete.js';
import { Destinos } from '../src/Destinos.js';

const formulario = document.getElementById('elFormulario');
const salida = document.getElementById('salida');
const btnOrdenar = document.getElementById("ordenar");
const btnMostrar = document.getElementById("mostrar");
const btnCalcular = document.getElementById("calcular");
const btnLimpiar = document.getElementById("limpiar");

let paquetesBD = [];
let destinosBD = [];

// Funciones - extraer al src/utils o algo asi - revisar doc

//Separar paquete (usada para ingresar varios paquetes de golpe desde un texto)
function separarpaquete(cadena) {
    console.log('Tipo:', typeof cadena, 'Valor:', cadena); 
    const [destinos, paquetesJuntos] = cadena.split('--');
    
    console.log(paquetesBD);
    console.log(destinosBD);
    ingresarDestinos(destinos);

    return paquetesJuntos.split(';').map((paquete) => {
        const [id, destino, peso, status, timestamp] = paquete.split(' ');
        return { id, destino, peso, status, timestamp };
    });
}

//Crear objeto(s) a partir de un texto con el formato "destino1,destino2-id,destino,peso,status,timestamp;..."
function ingresarPaquete(cadena) {
    const paquetes = separarpaquete(cadena); // arreglo de paquetes

    const textos = paquetes.map((p) => {
        const obj = new Paquete(p.id, p.destino, p.peso, p.status, p.timestamp);
        paquetesBD.push(obj);
        return obj.toString();
    });

    return textos.join('\n');
}
//Separa destinos y los guarda en el arreglo de destinos
function ingresarDestinos(cadenaDestinos) {
    const nuevos = cadenaDestinos.split(',').map(nombre => new Destinos(nombre.trim()));
    destinosBD.push(...nuevos);
    return nuevos;
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

// TODO: aquí falta definir qué debe calcular (ej: peso total, cantidad por destino, etc.)
function calcular() {
    if (paquetesBD.length === 0) {
        salida.value = 'No hay paquetes ingresados.';
        return;
    }
    const pesoTotal = paquetesBD.reduce((suma, p) => suma + Number(p.peso), 0);
    salida.value = `Cantidad de paquetes: ${paquetesBD.length}\nPeso total: ${pesoTotal}`;
}

function ordenarPaquetes() {
    if (paquetesBD.length === 0) {
        salida.value = 'No hay paquetes ingresados.';
        return;
    }
    paquetesBD.sort((a, b) => Number(a.peso) - Number(b.peso));
    mostrarPaquetes();
}

function limpiarSalida() {
    salida.value = '';
}
//hasta aqui se extrae al utils

// lo del servidor, no extraer
formulario.addEventListener('submit', async (event) => {
    event.preventDefault();

    const textoPaquete = document.getElementById('laInfo').value;
    //no lo muevan
    try {
        const respuesta = await fetch('/casita', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: textoPaquete
        });

        if (!respuesta.ok) {
            salida.value = 'Ocurrió un error.';
            return;
        }

        const guardado = await respuesta.json();

        const paquete = ingresarPaquete(guardado);
        salida.value = 'Paquete ingresado correctamente.\n';
        salida.value += paquete;
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