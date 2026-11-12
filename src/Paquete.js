import { Destinos } from "./Destinos.js";

export class Paquete {
    // Guarda los datos del registro y prepara su destino. O(1) por registro.
    constructor(id, destino, peso, estado, timestamp) {
        this.id = id;

        // Verifica que destino sea un objeto Destinos
        if (destino instanceof Destinos) {
            this.destino = destino;
        } else {
            destino = new Destinos(destino);
            this.destino = destino;
        }

        this.peso = peso;
        this.estado = estado;
        this.timestamp = timestamp;
    }

    // Devuelve el registro como texto. O(1) si los campos tienen longitud acotada.
    toString() {
        return "id:" + this.id +
            " destino:[" + this.destino.toString() + "]" +
            " peso:" + this.peso +
            " estado:" + this.estado +
            " timestamp:" + this.timestamp;
    }
}
