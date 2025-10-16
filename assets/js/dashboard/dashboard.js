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

// ======= Legend labels (editable, local only) =======
const LEGEND_KEY = 'gradmate_calendar_legend';
const DEFAULT_LEGEND = {
    1: '4º termo – Upload do projeto (Teams)',
    2: '5º termo – Qualificação / PITCH',
    3: '6º termo – Entrega dados p/ ficha',
    4: '6º termo – Entrega versão final (Teams)',
    5: '6º termo – Defesa do TCC',
    6: '6º termo – Versão corrigida'
};

function getLegendLabels() {
    try {
        const raw = localStorage.getItem(LEGEND_KEY);
        const saved = raw ? JSON.parse(raw) : {};
        return { ...DEFAULT_LEGEND, ...saved };
    } catch (e) {
        return { ...DEFAULT_LEGEND };
    }
}

function setLegendLabel(idx, text) {
    const labels = getLegendLabels();
    labels[idx] = text && text.trim() ? text.trim() : DEFAULT_LEGEND[idx];
    localStorage.setItem(LEGEND_KEY, JSON.stringify(labels));
}

function applyLegendLabels() {
    const items = document.querySelectorAll('.legend .legend-item');
    let labels;
    const raw = localStorage.getItem(LEGEND_KEY);
    if (!raw) {
        // Initialize from current DOM text to avoid surprising changes
        labels = {};
        items.forEach((item, i) => {
            const idx = i + 1;
            const span = item.querySelector('span');
            labels[idx] = span && span.textContent ? span.textContent.trim() : DEFAULT_LEGEND[idx];
        });
        try { localStorage.setItem(LEGEND_KEY, JSON.stringify(labels)); } catch {}
    } else {
        labels = getLegendLabels();
    }
    items.forEach((item, i) => {
        const idx = i + 1; // assume order 1..6
        const span = item.querySelector('span');
        if (!span) return;
        span.textContent = labels[idx] || DEFAULT_LEGEND[idx];
        span.dataset.legendIndex = String(idx);
        span.classList.add('legend-editable');
        span.title = 'Clique para editar';
        span.tabIndex = 0;
    });
}

function setupLegendEditing() {
    const beginEdit = (span) => {
        span.contentEditable = 'true';
        span.focus();
        try { document.execCommand('selectAll', false, null); } catch {}
    };
    const commitEdit = (span, restoreIfEmpty = true) => {
        const idx = Number(span.dataset.legendIndex);
        let text = span.textContent || '';
        if (!text.trim() && restoreIfEmpty) {
            text = DEFAULT_LEGEND[idx];
        }
        setLegendLabel(idx, text);
        span.textContent = text;
        span.contentEditable = 'false';
    };
    document.querySelectorAll('.legend .legend-item span').forEach((span) => {
        span.addEventListener('click', () => beginEdit(span));
        span.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') { e.preventDefault(); span.blur(); }
            if (e.key === 'Escape') { e.preventDefault(); span.textContent = getLegendLabels()[Number(span.dataset.legendIndex)]; span.blur(); }
        });
        span.addEventListener('blur', () => commitEdit(span));
    });
}


document.addEventListener('DOMContentLoaded', () => {
    applyLegendLabels();
    setupLegendEditing();
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



// Persistência local (opcional) removida para simplificar
function renderYearCalendar(skipFetch = false) {
    document.getElementById('monthYear').textContent = `Ano ${selectedYear}`;

    const build = () => {
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

            daysOfWeek.forEach(day => {
                const header = document.createElement('div');
                header.className = 'day-header';
                header.textContent = day;
                monthGrid.appendChild(header);
            });

            const firstDay = new Date(selectedYear, month, 1);
            const lastDay = new Date(selectedYear, month + 1, 0);
            const firstDayOfWeek = firstDay.getDay();
            const lastDateOfMonth = lastDay.getDate();

            for (let i = 0; i < firstDayOfWeek; i++) {
                const emptyCell = document.createElement('div');
                monthGrid.appendChild(emptyCell);
            }

            const today = new Date();
            for (let date = 1; date <= lastDateOfMonth; date++) {
                const dayCell = document.createElement('div');
                dayCell.className = 'day-cell';

                const dateStr = `${selectedYear}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
                const status = dateStatuses[dateStr];
                if (status) {
                    dayCell.classList.add(`status-${status}`);
                    dayCell.classList.add('has-status');
                }
                dayCell.textContent = date;

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
    };

    if (skipFetch) {
        build();
    } else {
        loadStatus().then(() => build());
    }
}

async function toggleStatus(dateStr) {
    const prevStatus = dateStatuses[dateStr] || null;
    // Ciclo de status: null -> 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> null
    const nextStatus = prevStatus ? (prevStatus === 6 ? null : prevStatus + 1) : 1;

    // Otimista: atualiza UI imediatamente
    if (nextStatus) {
        dateStatuses[dateStr] = nextStatus;
    } else {
        delete dateStatuses[dateStr];
    }
    renderYearCalendar(true);

    // Tentativa de persistência
    try {
        if (nextStatus) {
            await apiPut('date', { date: dateStr, status: nextStatus });
        } else {
            await apiDelete('date', { date: dateStr });
        }
        // sucesso: mantém otimista
    } catch (error) {
        // Reverter em caso de erro
        if (prevStatus) {
            dateStatuses[dateStr] = prevStatus;
        } else {
            delete dateStatuses[dateStr];
        }
    renderYearCalendar(true);
        console.error('Erro ao atualizar status:', error);
        showToast('Erro', 'Não foi possível salvar o status do dia', 'error');
    }
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

// ======= Exportar Calendário do Semestre (PDF) =======
function downloadSemester() {
    const { jsPDF } = window.jspdf || window.jspdf || {};
    if (!jsPDF) {
        showToast && showToast('Erro', 'Biblioteca jsPDF não carregada', 'error');
        return;
    }

    const semSelect = document.getElementById('semesterSelect');
    const semester = semSelect ? Number(semSelect.value) : 1;
    const monthsRange = semester === 1 ? [0, 5] : [6, 11]; // 0-based

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;

    // Cabeçalho centralizado
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    const line1 = 'Fatec Garça – Fatec Júlio Julinho Marcondes de Moura';
    doc.text(line1, pageWidth / 2, 15, { align: 'center' });
    doc.setFontSize(14);
    const line2 = `Calendário de Orientação dos TCCs – ${selectedYear}/${semester}`;
    doc.text(line2, pageWidth / 2, 23, { align: 'center' });

    // Tabela de calendários à esquerda (6 meses em 2 colunas x 3 linhas)
    const calStartX = margin;
    const calStartY = 48; // start a bit lower to detach from header
    const cellW = 5.5;
    const cellH = 5.5;
    const monthGap = 5;
    const calCols = 2;
    const calRows = 3;

    const drawMonthTable = (mIndex, x, y) => {
        // Título do mês
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(30);
        doc.text(months[mIndex], x + 19, y);

        // Cabeçalho dias da semana
        const dw = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(99, 102, 241);
        for (let i = 0; i < 7; i++) {
            doc.text(dw[i], x + i * cellW + 2, y + 5.5);
        }

        // Dias
        const firstDay = new Date(selectedYear, mIndex, 1);
        const lastDay = new Date(selectedYear, mIndex + 1, 0);
        const firstDayOfWeek = firstDay.getDay();
        let row = 0;
        let col = firstDayOfWeek;

        for (let d = 1; d <= lastDay.getDate(); d++) {
            const dateStr = `${selectedYear}-${String(mIndex + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const status = dateStatuses[dateStr];
            const cx = x + col * cellW;
            const cy = y + 8 + row * cellH;

            // Fundo do status com cantos arredondados
            if (status) {
                const colorMap = {
                    1: [59, 130, 246], 2: [199, 17, 175], 3: [16, 185, 129],
                    4: [185, 16, 16], 5: [123, 16, 185], 6: [203, 211, 4]
                };
                const c = colorMap[status] || [255, 255, 255];
                doc.setFillColor(c[0], c[1], c[2]);
                doc.roundedRect(cx, cy, cellW, cellH, 1, 1, 'F');
            }
            // Borda mais suave
            doc.setDrawColor(226, 232, 240);
            doc.setLineWidth(0.2);
            doc.roundedRect(cx, cy, cellW, cellH, 1, 1);
            // Número do dia com melhor posicionamento
            doc.setTextColor(30);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7);
            doc.text(String(d), cx + cellW/2, cy + cellH/2 + 1, { align: 'center' });

            col++;
            if (col === 7) {
                col = 0;
                row++;
            }
        }
    };

    // Desenhar 6 meses em grade 2x3
    let mIdx = monthsRange[0];
    for (let r = 0; r < calRows; r++) {
        for (let c = 0; c < calCols; c++) {
            if (mIdx > monthsRange[1]) break;
            const mx = calStartX + c * (7 * cellW + monthGap + 10);
            const my = calStartY + r * (7 * cellH + 26); // more vertical spacing to fill page height
            drawMonthTable(mIdx, mx, my);
            mIdx++;
        }
    }

    // Legenda à direita
    const legendX = 120;
    const legendY = calStartY;
    const labels = getLegendLabels();
    const legendItems = [
        { label: labels[1], color: [59, 130, 246] },
        { label: labels[2], color: [199, 17, 175] },
        { label: labels[3], color: [16, 185, 129] },
        { label: labels[4], color: [185, 16, 16] },
        { label: labels[5], color: [123, 16, 185] },
        { label: labels[6], color: [203, 211, 4] }
    ];

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Legenda:', legendX, legendY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    let ly = legendY + 6;
    legendItems.forEach(item => {
        // Quadradinho colorido
        doc.setFillColor(item.color[0], item.color[1], item.color[2]);
        doc.rect(legendX, ly - 2.5, 4, 4, 'F');
        doc.setDrawColor(100);
        doc.rect(legendX, ly - 2.5, 4, 4);
        // Texto
        doc.setTextColor(30);
        doc.text(item.label, legendX + 6, ly);
        ly += 6;
    });

    // Rodapé
    doc.setFontSize(7);
    doc.setTextColor(120);
    doc.text('Gerado por GradMate', margin, 285);

    // Salvar
    const fileName = `Calendario_TCC_${selectedYear}_${semester}.pdf`;
    doc.save(fileName);
}