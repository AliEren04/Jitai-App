const db = new Dexie("JitaiDB");

db.version(1).stores({
    logs: "++id, timestamp, event_type, scenario_type, action"
});

const Logger = {
    async addLog(type, scenario, action) {
        try {
            await db.logs.add({
                timestamp: Date.now(),
                event_type: type,
                scenario_type: scenario,
                action: action
            });
            window.dispatchEvent(new CustomEvent('new-log-added'));
        } catch(error) {
            console.error(`DB Write Error ${error}`);
        }
    },
    async getLogs() {
        return await db.logs.orderBy('timestamp').reverse().toArray();
    },
    async clearLogs() {
        await db.logs.clear();
        window.dispatchEvent(new CustomEvent('new-log-added'));
    }
};