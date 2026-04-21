const { Filesystem, Directory, Encoding } = Capacitor.Plugins;
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
    },

    async saveLogsToFile() {
        const logs = await this.getLogs();
        if (logs.length === 0) return { success: false, message: "No logs to save." };

        const textContent = logs.map(log => {
            const time = new Date(log.timestamp).toISOString();
            return `[${time}] TYPE: ${log.event_type} | SCENARIO: ${log.scenario_type} | ACTION: ${log.action}`;
        }).join("\n");

        try {
            let testerNumber = 1;
            let fileName = `Tester_${testerNumber}_Log.txt`;
            let fileExists = true;

            // Increment filename until find an available tester x 
            while (fileExists) {
                try {
                    await Filesystem.stat({
                        path: fileName,
                        directory: Directory.Documents
                    });
                    testerNumber++;
                    fileName = `Tester_${testerNumber}_Log.txt`;
                } catch (e) {
                    // If stat fails the file doesn't exist yet
                    fileExists = false;
                }
            }

            // Writing file to documents folder
            const result = await Filesystem.writeFile({
                path: fileName,
                data: textContent,
                directory: Directory.Documents,
                encoding: Encoding.UTF8
            });

            return { success: true, fileName: fileName, uri: result.uri };
        } catch (error) {
            console.error("Filesystem Error:", error);
            return { success: false, message: error.message };
        }
    }
};