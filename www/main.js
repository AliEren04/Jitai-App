
/**
 * Handles view switching (Navigation)
 * @param {string} viewName - The ID of the section to show (e.g. 'home', 'log')
 */
function navigate(viewName) {
    // 1. Update Views
    document.querySelectorAll('.page-view').forEach(view => {
        view.classList.remove('active');
    });
    const targetView = document.getElementById(viewName + '-view');
    if (targetView) targetView.classList.add('active');

    // 2. Update Sidebar Active State
    document.querySelectorAll('.nav-links li').forEach(li => {
        li.classList.remove('active-link');
    });
    // This assumes your LI order matches your view order
    // Or you can add specific IDs to your LIs to target them better

    // 3. Close Sidebar on Mobile
    document.getElementById('sidebar').classList.remove('open');
    
    console.log(`Mapsd to: ${viewName}`);
}

// Hamburger Toggle
document.getElementById('menu-toggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
});