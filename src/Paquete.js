import { Destinos } from "./Destinos.js";

export class Paquete {
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

    toString() {
        return "id:" + this.id +
            " destino:[" + this.destino.toString() + "]" +
            " peso:" + this.peso +
            " estado:" + this.estado +
            " timestamp:" + this.timestamp;
    }
}