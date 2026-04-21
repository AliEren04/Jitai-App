
const { LocalNotifications } = Capacitor.Plugins;

//Elements from dom constants
const simulation1 = document.getElementById("btn-start-1");
const simulation2 = document.getElementById("btn-start-2");
const simulation3 = document.getElementById("btn-start-3");
const permBtn = document.getElementById("btn-request-perm");
const statusText = document.getElementById("perm-status-text");
const statusDot = document.getElementById("status-dot");
const permHelp = document.getElementById("perm-help-text");

//Navigtion Logic//
/**
 * Handles view switching (Navigation)
 * @param {string} viewName - The ID of the section to show (e.g. 'home', 'log')
 */
function navigate(viewName) {
    // Change of Views
    document.querySelectorAll('.page-view').forEach(view => {
        view.classList.remove('active');
    });
    const targetView = document.getElementById(viewName + '-view');
    if (targetView) targetView.classList.add('active');

    //Update Sidebar Active State
    document.querySelectorAll('.nav-links li').forEach(li => {
        li.classList.remove('active-link');
    });

    // Close Sidebar on Mobile
    document.getElementById('sidebar').classList.remove('open');
    
    console.log(`Mapsd to: ${viewName}`);
}

// Hamburger Toggle For Mobile (app designed as mobile app)
document.getElementById('menu-toggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
});

//UI Update based on permissions grant state
async function updatePermissionUI() {
    const check = await LocalNotifications.checkPermissions();
    
    if (check.display === 'granted') {
        statusText.innerText = "Notifications: Granted";
        statusText.style.color = "#00ff00";
        statusDot.className = "dot-green";
        permHelp.innerText = "Jitai Simulation System is ready to deliver intervention notifications";
        permBtn.style.display = "none"; 
    } else {
        statusText.innerText = "Notifications: Denied";
        statusText.style.color = "#ff4444";
        statusDot.className = "dot-red";
        permBtn.style.display = "block";
    }
}

/**
 * Permission Requesting
 */
permBtn.addEventListener("click", async () => {
    const request = await LocalNotifications.requestPermissions();
    if (request.display === 'granted') {
        await Logger.addLog('SYSTEM', 'PERMISSIONS', 'USER_GRANTED_ACCESS');
    } else {
        await Logger.addLog('SYSTEM', 'PERMISSIONS', 'USER_DENIED_ACCESS');
    }
    updatePermissionUI();
});



//Notification Interaction Listener 
LocalNotifications.addListener('localNotificationActionPerformed', async (notification) => {
    const scenario = notification.notification.extra.scenario;
    await Logger.addLog('USER', scenario, 'NUDGE_INTERACTION_SUCCESS');
    navigate('log');
});


//Simulation Notifation Logic
async function runSimulationWifi() {
    const scenario = 'PUBLIC_WIFI';
    await Logger.addLog('SYSTEM', scenario, 'ANALYSING_NETWORK_PACKETS');
    setTimeout(async () => {
       try{
        await LocalNotifications.schedule({
            notifications: [{
                 id: 101,
                 title: "Unsafe Browsing Warning",
                 body: "Network: 'Airport Free WiFi' | Encryption: None (Open) | Risk: High, 14 unverified peers detected on this subnet. Your unencrypted traffic (HTTP) is currently visible. Tap to enable VPN tunneling.",
                 schedule: { at: new Date(Date.now() + 500) },
                 extra: { scenario: scenario, complexity: 'high' }


            }]
        }); 
       }catch(err){
            console.error("Phishing Notification Error", err);
       }
    }, 15000);

}


async function runSimulationPhishing() {
    const scenario = 'SMS_PHISHING';
    await Logger.addLog('SYSTEM', scenario, 'HEURISTIC_URL_ANALYSIS');

    setTimeout(async () => {
        try {
            await LocalNotifications.schedule({
                notifications: [{
                    id: 102,
                    title: "Malicious Link Detected",
                    body:  "Link: 'bit.ly/secure-auth-8' | Result: Domain spoofing detected. This URL mimics Gov.uk but resolves to a known malicious IP in a different jurisdiction. Tap to block sender.",
                    schedule: { at: new Date(Date.now() + 500) },
                    extra: { scenario: scenario, complexity: 'high' }
                }]
            });
            await Logger.addLog('SYSTEM', scenario, 'NUDGE_DELIVERED_COMPLEX');
        } catch (err) {
            console.error("Phishing Notification Error", err);
        }
    }, 15000);
}

async function runSimulationPermissions() {
    const scenario = 'APP_PERMISSIONS';
    await Logger.addLog('SYSTEM', scenario, 'MONITORING_BACKGROUND_PROCESSES');

    setTimeout(async () => {
        try {
            await LocalNotifications.schedule({
                notifications: [{
                    id: 103,
                    title: "Privacy Exposure Warning",
                    body: "Access: Location & Microphone | Frequency: 22 requests in 60s. Data is currently being staged for external transmission. Tap to revoke background permissions.",
                    schedule: { at: new Date(Date.now() + 500) },
                    extra: { scenario: scenario, complexity: 'high' }
                }]
            });
            await Logger.addLog('SYSTEM', scenario, 'NUDGE_DELIVERED_COMPLEX');
        } catch (err) {
            console.error("Permission Notification Error", err);
        }
    }, 15000); 
}


//Event Listeners 

simulation1.addEventListener("click", runSimulationWifi);
simulation2.addEventListener("click", runSimulationPhishing);
simulation3.addEventListener("click", runSimulationPermissions);
document.addEventListener('DOMContentLoaded', () => {
    updatePermissionUI();
});

