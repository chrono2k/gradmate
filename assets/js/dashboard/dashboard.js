document.addEventListener('DOMContentLoaded', () => {
    loadCursos();
});

const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const topbar = document.getElementById('topbar');
const mainContent = document.getElementById('mainContent');

menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
});


document.querySelectorAll('.nav-dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const dropdown = toggle.closest('.nav-dropdown');
        dropdown.classList.toggle('open');
    });
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        if (!link.classList.contains('nav-dropdown-toggle')) {
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        }
    });
});

function checkWidth() {
    if (window.innerWidth <= 768) {
        sidebar.classList.add('collapsed');
        topbar.classList.add('expanded');
        mainContent.classList.add('expanded');
    } else {
        sidebar.classList.remove('collapsed', 'open');
        topbar.classList.remove('expanded');
        mainContent.classList.remove('expanded');
    }
}

window.addEventListener('resize', checkWidth);
checkWidth();

document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    }
});