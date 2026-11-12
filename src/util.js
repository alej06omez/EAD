export function consolidarPaquetes(paquetes) {
    const recientes = new Map();

    for (const paquete of paquetes) {
        const anterior = recientes.get(paquete.id);

        if (!anterior ||
            Number(paquete.timestamp) >= Number(anterior.timestamp)) {
            recientes.set(paquete.id, paquete);
        }
    }

    return Array.from(recientes.values());
}
