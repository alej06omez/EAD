// n: destinos declarados, m: registros, k: paquetes distintos.
// Se supone longitud acotada por campo y acceso promedio O(1) a Map.

// Conserva el registro más reciente por ID. Si empatan, gana el último.
// Tiempo O(m + k) y espacio auxiliar O(k).
export function consolidarPaquetes(paquetes) {
    const recientes = new Map();

    // Recorre los m registros y almacena hasta k entradas.
    for (const paquete of paquetes) {
        const anterior = recientes.get(paquete.id);

        if (!anterior ||
            Number(paquete.timestamp) >= Number(anterior.timestamp)) {
            recientes.set(paquete.id, paquete);
        }
    }

    // Copia los k registros elegidos en O(k) tiempo y espacio.
    return Array.from(recientes.values());
}

// Separa la entrada en destinos y registros. Tiempo y espacio O(n + m).
export function leerCaso(caso) {
    // Normaliza la entrada y localiza el separador. O(L) en el peor caso.
    // L es la longitud de la cadena, O(n + m) con campos acotados.
    let entrada = caso.trim();
    if (entrada.startsWith("'") && entrada.endsWith("'")) {
        entrada = entrada.slice(1, -1);
    }

    const separador = entrada.indexOf('--');
    if (separador === -1) {
        throw new Error('Separa los destinos y los registros con --.');
    }

    // Lee los n destinos en O(n) tiempo y espacio.
    const destinos = entrada.slice(0, separador).split(',').map(nombre => nombre.trim());
    // Lee los m registros en O(m) tiempo y espacio.
    const paquetes = entrada.slice(separador + 2).split(';').map(registro => {
        const [id, destino, peso, estado, timestamp] = registro.trim().split(/\s+/);
        return { id, destino, peso, estado, timestamp };
    });

    return { destinos, paquetes };
}

// Calcula los totales por destino y devuelve el ranking como texto.
// Tiempo O(n + m + k + n log n) y espacio auxiliar O(n + k).
export function generarRanking(destinos, paquetes) {
    // Inicializa los n destinos en cero. O(n) tiempo y espacio.
    const estadisticas = new Map();
    for (const destination of destinos) {
        estadisticas.set(destination, { destination, totalPackages: 0, totalWeight: 0 });
    }

    // Consolida en O(m + k) y acumula los k registros elegidos en O(k).
    // La consolidación usa O(k) espacio auxiliar.
    for (const paquete of consolidarPaquetes(paquetes)) {
        const total = estadisticas.get(String(paquete.destino));
        if (!total) {
            throw new Error(`Destino no declarado: ${paquete.destino}`);
        }
        total.totalPackages++;
        total.totalWeight += Number(paquete.peso);
    }

    // Convierte el mapa en un arreglo en O(n) tiempo y espacio.
    const ranking = Array.from(estadisticas.values());
    // Ordena por peso, cantidad y nombre. Se asume O(n log n) tiempo
    // y O(n) espacio auxiliar para sort, con comparaciones de costo acotado.
    ranking.sort((a, b) =>
        b.totalWeight - a.totalWeight ||
        b.totalPackages - a.totalPackages ||
        a.destination.localeCompare(b.destination)
    );

    // Numera y une las n líneas en O(n) tiempo y espacio.
    return ranking.map(({ destination, totalPackages, totalWeight }, indice) =>
        `${indice + 1}) ${destination} ${totalPackages} ${totalWeight}`
    ).join('\n');
}

// Lee el caso y devuelve una línea por destino en el orden solicitado.
// Tiempo total O(n + m + k + n log n), equivalente a O(m + n log n).
// Espacio auxiliar total O(n + m + k), equivalente a O(n + m).
export function analizarPaquetes(caso) {
    const { destinos, paquetes } = leerCaso(caso);
    return generarRanking(destinos, paquetes);
}
