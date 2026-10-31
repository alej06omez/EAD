export class Paquete {
    constructor(id, destino, peso, estado, timestamp) {
        this.id = id;
        this.destino = destino;
        this.peso = peso;
        this.estado = estado;
        this.timestamp = timestamp;
    }


    toString() {
        return "id:" + this.id + "  destino:" + this.destino +
            " peso:" + this.peso + "  estado:" + this.estado + "  timestamp:" + this.timestamp;;
    }    
}
