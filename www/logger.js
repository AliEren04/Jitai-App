const LoggerPage = {
    init() {
        this.logContainer = document.getElementById("log-display");
        this.modal = document.getElementById("custom-modal");
        this.refreshLogs();

        window.addEventListener("new-log-added", () => this.refreshLogs());

        // Storage Permission Button
        const storageBtn = document.getElementById("btn-request-storage");
        if (storageBtn) {
            storageBtn.onclick = () => this.requestStorage();
        }

        // Export Button
        const exportBtn = document.getElementById("export-logs-btn");
        if (exportBtn) {
            exportBtn.onclick = async () => {
                const result = await Logger.saveLogsToFile();
                if (result.success) {
                    this.showModal("EXPORT_SUCCESS", `File saved: ${result.fileName}`, async () => {
                        this.showModal("CLEAN_UP", "Clear database for next participant?", async () => {
                            await Logger.clearLogs();
                        }, true);
                    }, false);
                } else {
                    this.showModal("EXPORT_ERROR", result.message, null, false);
                }
            };
        }

        this.updateStorageUI();
    },

    async updateStorageUI() {
  
        const statusText = document.getElementById("storage-status-text");
        const statusDot = document.getElementById("storage-dot");
    
        if (localStorage.getItem('storage_granted') === 'true') {
            statusText.innerText = "Filesystem: Granted";
            statusDot.className = "dot-green";
            document.getElementById("btn-request-storage").style.display = "none";
        }
    },

    async requestStorage() {
        localStorage.setItem('storage_granted', 'true');
        this.updateStorageUI();
        this.showModal("Storage", "Storage access configured", null, false);
    },

    showModal(title, body, onConfirm, showCancel = true) {
        document.getElementById("modal-title").innerText = title;
        document.getElementById("modal-body").innerText = body;
        const confirmBtn = document.getElementById("modal-confirm");
        const cancelBtn = document.getElementById("modal-cancel");

        this.modal.style.display = "flex";
        cancelBtn.style.display = showCancel ? "block" : "none";

        confirmBtn.onclick = () => {
            this.modal.style.display = "none";
            if (onConfirm) onConfirm();
        };

        cancelBtn.onclick = () => {
            this.modal.style.display = "none";
        };
    },

    async refreshLogs() {
        const logs = await Logger.getLogs();
        this.renderLogs(logs);
    },

    renderLogs(logs) {
        if (!this.logContainer) return;
        const rawHtml = logs.map(log => {
            const time = new Date(log.timestamp).toLocaleTimeString("en-GB");
            return `<div class="log-entry ${log.event_type.toLowerCase()}">
                        <span class="log-meta">[${time}]</span>
                        <span class="log-type">${log.event_type}</span>
                        <span class="log-body">${log.scenario_type}: ${log.action}</span>
                    </div>`;
        }).join("");
        this.logContainer.innerHTML = DOMPurify.sanitize(rawHtml);
        this.logContainer.scrollTop = 0;
    }
};

document.addEventListener("DOMContentLoaded", () => LoggerPage.init());