let selectedYear = new Date().getFullYear();
let dateStatuses = {};
const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const topbar = document.getElementById('topbar');
const mainContent = document.getElementById('mainContent');



document.addEventListener('DOMContentLoaded', () => {
    // loadStatus();
});

async function loadStatus() {

    try {
        const response = await apiGet(`date/?year=${selectedYear}`);
        dateStatuses = response.success ? Object.fromEntries(
                response.statuses.map(item => [item.date, item.status])
            ): {};
    } catch (error) {
    }
}
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



// function loadData() {
//     const saved = localStorage.getItem('dateStatuses');
//     if (saved) {
//         dateStatuses = JSON.parse(saved);
//     }
// }
//
// function saveData() {
//     localStorage.setItem('dateStatuses', JSON.stringify(dateStatuses));
// }

function renderYearCalendar() {
    document.getElementById('monthYear').textContent = `Ano ${selectedYear}`;
    loadStatus().then(r => {
        const yearCalendar = document.getElementById('yearCalendar');
        yearCalendar.innerHTML = '';

        for (let month = 0; month < 12; month++) {
            const monthSection = document.createElement('div');
            monthSection.className = 'month-section';

            const monthTitle = document.createElement('div');
            monthTitle.className = 'month-title';
            monthTitle.textContent = months[month];
            monthSection.appendChild(monthTitle);

            const monthGrid = document.createElement('div');
            monthGrid.className = 'month-grid';

            // Headers dos dias
            daysOfWeek.forEach(day => {
                const header = document.createElement('div');
                header.className = 'day-header';
                header.textContent = day;
                monthGrid.appendChild(header);
            });

            // Dias do mês
            const firstDay = new Date(selectedYear, month, 1);
            const lastDay = new Date(selectedYear, month + 1, 0);
            const firstDayOfWeek = firstDay.getDay();
            const lastDateOfMonth = lastDay.getDate();

            // Células vazias antes do primeiro dia
            for (let i = 0; i < firstDayOfWeek; i++) {
                const emptyCell = document.createElement('div');
                monthGrid.appendChild(emptyCell);
            }

            // Dias do mês
            const today = new Date();
            console.log('-')
            console.log(dateStatuses)
            for (let date = 1; date <= lastDateOfMonth; date++) {
                const dayCell = document.createElement('div');
                dayCell.className = 'day-cell';

                const dateStr = `${selectedYear}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
                const status = dateStatuses[dateStr];
                if (status) {
                    dayCell.classList.add(`status-${status}`);
                    dayCell.classList.add('has-status');
                    // dayCell.textContent = status;
                } else {
                }
                dayCell.textContent = date;

                // Marcar hoje
                if (date === today.getDate() && month === today.getMonth() && selectedYear === today.getFullYear()) {
                    if (!status) {
                        dayCell.classList.add('today');
                    }
                }

                dayCell.addEventListener('click', () => toggleStatus(dateStr));
                monthGrid.appendChild(dayCell);
            }

            monthSection.appendChild(monthGrid);
            yearCalendar.appendChild(monthSection);
        }

    })
}

async function toggleStatus(dateStr) {
    const currentStatus = dateStatuses[dateStr];
    let newStatus = currentStatus ? (currentStatus === 3 ? null : currentStatus + 1) : 1;

    if (newStatus) {
        dateStatuses[dateStr] = newStatus;
    } else {
        delete dateStatuses[dateStr];
    }

    console.log(dateStr)
    await apiPost('date', {
        date: dateStr
    }).then(renderYearCalendar());

}

function previousYear() {
    selectedYear--;
    renderYearCalendar();
}

function nextYear() {
    selectedYear++;
    renderYearCalendar();
}

function currentYear() {
    selectedYear = new Date().getFullYear();
    renderYearCalendar();
}

function resetCalendar() {
    if (confirm('Tem certeza que deseja limpar todos os status?')) {
        dateStatuses = {};
        // saveData();
        renderYearCalendar();
    }
}

// loadData();
renderYearCalendar();
