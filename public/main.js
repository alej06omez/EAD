import { Paquete } from '../src/Paquete.js';
import { Destinos } from '../src/Destinos.js';
import { consolidarPaquetes } from '../src/util.js';
    

const formulario = document.getElementById('elFormulario');
const entrada = document.getElementById('laInfo');
const salida = document.getElementById('salida');
const btnOrdenar = document.getElementById("ordenar");
const btnMostrar = document.getElementById("mostrar");
const btnCalcular = document.getElementById("calcular");
const btnLimpiar = document.getElementById("limpiar");

let paquetesBD = [];
let destinosBD = [];
let controladorGuardado = new AbortController();
// hasta aqui O(1) -- lo de arriba

// Funciones - extraer al src/utils o algo asi - revisar doc

//Separar paquete (usada para ingresar varios paquetes de golpe desde un texto)
function separarpaquete(cadena) { //O(n^2)
    console.log('Tipo:', typeof cadena, 'Valor:', cadena); //O(1)
    const [destinos, paquetesJuntos] = cadena.split('--'); //O(n)=O(n)
    
    console.log(paquetesBD); //O(1)
    console.log(destinosBD); //O(1)
    ingresarDestinos(destinos); //O(n)

    //O(n)=(n) = O(n^2)
    return paquetesJuntos.split(';').map((paquete) => { //O(n)=(n) = O(n)
        const [id, destino, peso, status, timestamp] = paquete.split(' ');//O(n)=(n) = O(n)
        return { id, destino, peso, status, timestamp }; //O(1)=O(n)
    });
}


function ingresarPaquete(cadena) { //O(n^2)
    const paquetes = separarpaquete(cadena); // arreglo de paquetes O(n^2)

    const textos = paquetes.map((p) => {
        const obj = new Paquete(p.id, p.destino, p.peso, p.status, p.timestamp); //O(1)
        paquetesBD.push(obj);//O(1)
        return obj.toString();//O(1)
    }); //O(n) = O(n)

    return textos.join('\n');
}
//Separa destinos y los guarda en el arreglo de destinos
function ingresarDestinos(cadenaDestinos) { //O(n)
    const nuevos = cadenaDestinos.split(',').map(nombre => new Destinos(nombre.trim())); //O(n) = O(n)
    destinosBD.push(...nuevos); //O(1)
    return nuevos; //O(1)
}

function mostrarPaquetes() { //solo esta esto de manera funcional, revisar docs
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

    const consolidados = consolidarPaquetes(paquetesBD);

    const pesoTotal = consolidados.reduce(
        (suma, p) => suma + Number(p.peso), 0
    );

    salida.value =
        `Cantidad de paquetes diferentes: ${consolidados.length}\n` +
        `Peso total: ${pesoTotal}`;
}

function ordenarPaquetes() {
    if (paquetesBD.length === 0) {
        salida.value = 'No hay paquetes ingresados.';
        return;
    }
    paquetesBD.sort((a, b) => Number(a.peso) - Number(b.peso));
    mostrarPaquetes();
}

function limpiarCaso() {
    controladorGuardado.abort();
    controladorGuardado = new AbortController();
    paquetesBD = [];
    destinosBD = [];
    entrada.value = '';
    salida.value = '';
}
//hasta aqui se extrae al utils

// lo del servidor, no extraer
formulario.addEventListener('submit', async (event) => {
    event.preventDefault();

    const textoPaquete = entrada.value;
    const { signal } = controladorGuardado;
    //no lo muevan O(1) -- lo de arriba
    try {
        const respuesta = await fetch('/casita', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: textoPaquete,
            signal
        }); //O(1)

        if (signal.aborted) return;

        if (!respuesta.ok) {
            salida.value = 'Ocurrió un error.';
            return;
        } //o(1)

        const guardado = await respuesta.json(); //o(1)
        if (signal.aborted) return;

        const paquete = ingresarPaquete(guardado); //o(n^2)

        //de aqui para abajo es O(1)
        salida.value = 'Paquete ingresado correctamente.\n';
        salida.value += paquete;
    } catch (error) {
        if (signal.aborted) return;
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
    limpiarCaso();
});
