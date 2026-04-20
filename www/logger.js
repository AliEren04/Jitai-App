// logger.js
const LoggerPage = {
    init() {
        this.logContainer = document.getElementById("log-display");
        this.refreshLogs();

        // Listen for new logs added anywhere in the app
        window.addEventListener("new-log-added", () => this.refreshLogs());

        // Connect the "CLEAR_DB" button
        const clearBtn = document.getElementById("clear-logs-btn");
        if (clearBtn) {
            clearBtn.onclick = async () => {
                await Logger.clearLogs();
                console.log("Database Cleared");
            };
        }
    },

    async refreshLogs() {
        const logs = await Logger.getLogs();
        this.renderLogs(logs);
    },

    renderLogs(logs) {
        if (!this.logContainer) return;
        
        // Using the DOMPurify you loaded in the <head>
        const rawHtml = logs.map(log => {
            const time = new Date(log.timestamp).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
            const date = new Date(log.timestamp).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
            const logClass = log.event_type.toLowerCase();

            return `
                <div class="log-entry ${logClass}">
                    <span class="log-meta">[${date} ${time}]</span>
                    <span class="log-content">
                        <span class="log-type">${log.event_type}</span>
                        <span class="log-body">${log.scenario_type}: ${log.action}</span>
                    </span>
                </div>`;
        }).join("");

        this.logContainer.innerHTML = DOMPurify.sanitize(rawHtml);
        this.logContainer.scrollTop = this.logContainer.scrollHeight;
    }
};

document.addEventListener("DOMContentLoaded", () => LoggerPage.init());