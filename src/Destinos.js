export class Destinos {
    // Guarda el nombre del destino. O(1).
    constructor(nombre) {
        this.nombre = nombre;
    }

    // Devuelve el nombre del destino. O(1).
    toString() {
        return this.nombre;
    }
}
