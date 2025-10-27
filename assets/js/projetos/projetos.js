let projetos = [];
let allCourses = [];
let editingId = null;
let currentPage = 1;
const itemsPerPage = 10;
let currentStatusFilter = null; // Filtro ativo de status

document.addEventListener('DOMContentLoaded', () => {
    initializeDateFilter(); // Configurar datas padrão
    loadProjetos();
    loadCourses();
});

/**
 * Inicializar filtro de data com valores padrão
 */
function initializeDateFilter() {
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    
    if (!startDateInput || !endDateInput) return;
    
    const startDate = new Date(new Date().getFullYear(), 0, 1);
    const startDateStr = startDate.toISOString().split('T')[0];
    
    const endDate = new Date();
    const endDateStr = endDate.toISOString().split('T')[0];
    
    if (startDateInput._flatpickr) {
        startDateInput._flatpickr.setDate(startDateStr, true, "Y-m-d");
    } else {
        startDateInput.value = startDateStr;
    }
    if (endDateInput._flatpickr) {
        endDateInput._flatpickr.setDate(endDateStr, true, "Y-m-d");
    } else {
        endDateInput.value = endDateStr;
    }
}

/**
 * Formatar data no formato brasileiro dd/mm/yyyy
 */
function formatDateBR(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

/**
 * Converter data brasileira (dd/mm/yyyy) para Date object
 */
function parseDateBR(dateStr) {
    if (!dateStr || dateStr.indexOf('/') === -1) return null;
    const parts = dateStr.split('/');
    if (parts.length !== 3) return null;
    // Formato: dd/mm/yyyy -> new Date(year, month-1, day)
    return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
}

/**
 * Aplicar filtro de data
 */
function applyDateFilter() {
    currentPage = 1; // Reset para primeira página
    applyFiltersAndRender();
}


function renderProjetosTable(filteredProjetos) {
    const tbody = document.getElementById('projectTableBody');
    tbody.innerHTML = '';

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = filteredProjetos.slice(start, end);


    tbody.innerHTML = pageItems.map(projeto => `
        <tr>
            <td>
                <div class="course-name">
                    <div class="course-icon">${projeto.name.substring(0, 2).toUpperCase()}</div>
                    ${projeto.name}
                </div>
            </td>
            <td>
                <div class="course" title="${projeto.course?.name || ''}">
                    ${projeto.course?.name || 'Sem Curso'}
                </div>
            </td>
            <td>
                <div class="observation" title="${projeto.observation || ''}">
                    ${projeto.observation || 'Sem observações'}
                </div>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-warning btn-icon" onclick="editProject(${projeto.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                
                </div>
            </td>
        </tr>
    `).join('');
}

function renderPagination(filteredProjetos) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    const totalPages = Math.ceil(filteredProjetos.length / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.className = i === currentPage ? 'active' : '';
        btn.onclick = () => {
            currentPage = i;
            renderProjetosTable(filteredProjetos);
            renderPagination(filteredProjetos);
        };
        pagination.appendChild(btn);
    }
}

/**
 * Carregar projetos do servidor
 */
async function loadProjetos() {
    const tbody = document.getElementById('projectTableBody');
    tbody.innerHTML = `
        <tr>
            <td colspan="5" style="text-align: center; padding: 40px;">
                <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: var(--primary);"></i>
                <p style="margin-top: 10px; color: var(--text-gray);">Carregando projetos...</p>
            </td>
        </tr>
    `;

    try {
        const response = await apiGet('project/?status=all');

        if (response.success) {
            projetos = response.projects;
            applyFiltersAndRender();
            updateStats();
        } else {
            throw new Error(response.message || 'Erro ao carregar projetos');
        }

    } catch (error) {
        console.error('Erro ao carregar projetos:', error);
        tbody.innerHTML = `
            <tr>
                <td colspan="5">
                    <div class="empty-state">
                        <i class="fas fa-exclamation-triangle" style="color: var(--danger);"></i>
                        <h3>Erro ao carregar projetos</h3>
                        <p>${error.message}</p>
                        <button class="btn btn-primary" onclick="loadProjetos()" style="margin-top: 15px;">
                            <i class="fas fa-sync-alt"></i> Tentar Novamente
                        </button>
                    </div>
                </td>
            </tr>
        `;
        showToast('Erro', 'Não foi possível carregar os projetos', 'error');
    }
}

/**
 * Aplicar filtros de status e busca, depois renderizar
 */
let advancedFilters = { teacher: '', student: '', courseId: '', year: '' };

function toggleAdvancedFilters(){
    const el = document.getElementById('advancedFilters');
    if (!el) return;
    el.style.display = (el.style.display === 'none' || !el.style.display) ? 'block' : 'none';
}
function clearAdvancedFilters(){
    advancedFilters = { teacher: '', student: '', courseId: '', year: '' };
    const ids = ['filterTeacher','filterStudent','filterCourse','filterYear'];
    ids.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    applyFiltersAndRender();
}

function applyFiltersAndRender() {
    const tbody = document.getElementById('projectTableBody');
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    let filteredProjetos = projetos;
    
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    
    if (startDateInput && endDateInput) {
        // Flatpickr com altInput usa um input oculto (ISO) e um visível (BR). Pegue a data da instância quando possível.
        let startDate = startDateInput._flatpickr ? startDateInput._flatpickr.selectedDates[0] : null;
        let endDate = endDateInput._flatpickr ? endDateInput._flatpickr.selectedDates[0] : null;
        
        // Fallback: tentar ler do valor do input (pode ser ISO ou BR)
        if (!startDate && startDateInput.value) {
            startDate = startDateInput.value.includes('-') ? new Date(startDateInput.value + 'T00:00:00') : parseDateBR(startDateInput.value);
        }
        if (!endDate && endDateInput.value) {
            endDate = endDateInput.value.includes('-') ? new Date(endDateInput.value + 'T23:59:59') : parseDateBR(endDateInput.value);
        }
        
        if (startDate && endDate) {
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(23, 59, 59, 999);
            
            filteredProjetos = filteredProjetos.filter(projeto => {
                if (!projeto.created_at && !projeto.createdAt) return true; // Incluir se não tiver data
                const projectDate = new Date(projeto.created_at || projeto.createdAt);
                return projectDate >= startDate && projectDate <= endDate;
            });
        }
    }
    
    if (currentStatusFilter) {
        filteredProjetos = filteredProjetos.filter(projeto => 
            (projeto.status || 'Pré-projeto') === currentStatusFilter
        );
    }
    if (searchTerm) {
        filteredProjetos = filteredProjetos.filter(projeto =>
            projeto.name.toLowerCase().includes(searchTerm) ||
            (projeto.observation && projeto.observation.toLowerCase().includes(searchTerm))
        );
    }

    const t = (document.getElementById('filterTeacher')?.value || advancedFilters.teacher || '').toLowerCase();
    const s = (document.getElementById('filterStudent')?.value || advancedFilters.student || '').toLowerCase();
    const cId = (document.getElementById('filterCourse')?.value || advancedFilters.courseId || '');

    if (t) {
        filteredProjetos = filteredProjetos.filter(p =>
            (p.teachers || p.orientadores || []).some(o => (o.name || '').toLowerCase().includes(t))
        );
    }
    if (s) {
        filteredProjetos = filteredProjetos.filter(p =>
            (p.students || p.alunos || []).some(a => (a.name || '').toLowerCase().includes(s))
        );
    }
    if (cId) {
        filteredProjetos = filteredProjetos.filter(p => String(p.course?.id || '') === String(cId));
    }

    if (filteredProjetos.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5">
                    <div class="empty-state">
                        <i class="fas fa-inbox"></i>
                        <h3>Nenhum projeto encontrado</h3>
                        <p>${currentStatusFilter ? `Nenhum projeto com status "${currentStatusFilter}"` : (searchTerm ? 'Tente buscar por outro termo' : 'Comece cadastrando um novo projeto')}</p>
                        ${currentStatusFilter ? '<button class="btn btn-secondary" onclick="clearStatusFilter()" style="margin-top: 15px;"><i class="fas fa-times"></i> Limpar Filtro</button>' : ''}
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    currentPage = 1;
    renderProjetosTable(filteredProjetos);
    renderPagination(filteredProjetos);
}

/**
 * Filtrar projetos por status (chamado ao clicar nos cards)
 */
function filterByStatus(status) {
    if (currentStatusFilter === status) {
        clearStatusFilter();
        return;
    }
    
    currentStatusFilter = status;
    
    document.querySelectorAll('.stat-card').forEach(card => {
        card.classList.remove('active');
    });
    document.querySelector(`.stat-card[data-status="${status}"]`)?.classList.add('active');
    
    applyFiltersAndRender();
}

/**
 * Limpar filtro de status
 */
function clearStatusFilter() {
    currentStatusFilter = null;
    document.querySelectorAll('.stat-card').forEach(card => {
        card.classList.remove('active');
    });
    applyFiltersAndRender();
}

/**
 * Formatar data
 */
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

/**
 * Atualizar estatísticas dos cards
 */
function updateStats() {
    // Contar projetos por status
    const statusCounts = {
        'Pré-projeto': 0,
        'Qualificação': 0,
        'Defesa': 0,
        'Concluído': 0,
        'Trancado': 0
    };
    
    projetos.forEach(projeto => {
        const status = projeto.status || 'Pré-projeto';
        if (statusCounts.hasOwnProperty(status)) {
            statusCounts[status]++;
        }
    });
    
    // Atualizar contadores nos cards
    document.getElementById('countPreProjeto').textContent = statusCounts['Pré-projeto'];
    document.getElementById('countQualificacao').textContent = statusCounts['Qualificação'];
    document.getElementById('countDefesa').textContent = statusCounts['Defesa'];
    document.getElementById('countConcluido').textContent = statusCounts['Concluído'];
    document.getElementById('countTrancado').textContent = statusCounts['Trancado'];
}

/**
 * Carregar lista de cursos
 */
async function loadCourses() {
    try {
        const response = await apiGet('course');
        allCourses = response.courses || response;

        const select = document.getElementById('projectCourse');
        if (select) {
            select.innerHTML = '<option value="">Selecione um curso...</option>' +
                allCourses.map(course =>
                    `<option value="${course.id}">${course.name}</option>`
                ).join('');
        }
        const filterCourse = document.getElementById('filterCourse');
        if (filterCourse) {
            filterCourse.innerHTML = '<option value="">Todos os cursos</option>' +
                allCourses.map(course =>
                    `<option value="${course.id}">${course.name}</option>`
                ).join('');
        }
    } catch (error) {
        console.error('Erro ao carregar cursos:', error);
        const select = document.getElementById('projectCourse');
        if (select) {
            select.innerHTML = '<option value="">Erro ao carregar cursos</option>';
        }
    }
}

/**
 * Abrir modal para novo cadastro
 */

function openModal() {
    editingId = null;
    document.getElementById('modalTitle').textContent = 'Novo Projeto';
    document.getElementById('courseForm').reset();

    const hiddenId = document.getElementById('projectId');
    if (hiddenId) hiddenId.value = '';

    const courseSelect = document.getElementById('projectCourse');
    if (courseSelect) courseSelect.value = '';

    const overlay = document.getElementById('modalOverlay');
    overlay.classList.add('active');
    overlay.style.display = 'flex';

    document.body.style.overflow = 'hidden';
}

/**
 * Fechar modal
 */
function closeModal() {
    const overlay = document.getElementById('modalOverlay');
    overlay.classList.remove('active');
    overlay.style.display = 'none';
    document.body.style.overflow = 'auto';
}

/**
 * Salvar projeto (criar ou editar)
 */
async function saveProject() {
    const nameInput = document.getElementById('projectName');
    const obsInput = document.getElementById('courseObservation');
    const courseSelect = document.getElementById('projectCourse');

    const nome = (nameInput?.value || '').trim();
    const observacao = (obsInput?.value || '').trim();
    const courseId = courseSelect?.value ? parseInt(courseSelect.value) : null;

    if (!nome) {
        showToast('Erro', 'Por favor, preencha o nome do projeto', 'error');
        return;
    }

    if (nome.length < 3) {
        showToast('Erro', 'O nome do projeto deve ter no mínimo 3 caracteres', 'error');
        return;
    }

    if (!courseId) {
        showToast('Erro', 'Por favor, selecione um curso', 'error');
        return;
    }

    const saveButton = event.target;
    saveButton.disabled = true;
    saveButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...';

    try {
        if (editingId) {
            const response = await apiPut('project/', {
                id: editingId,
                name: nome,
                observation: observacao || null,
                courseId: courseId
            });

            if (response.success) {
                showToast('Sucesso', response.message || 'Projeto atualizado com sucesso', 'success');
            }
        } else {
            const response = await apiPost('project/', {
                name: nome,
                observation: observacao || null,
                courseId: courseId
            });

            if (response.success) {
                showToast('Sucesso', response.message || 'Projeto criado com sucesso', 'success');
            }
        }

        closeModal();
        await loadProjetos();

    } catch (error) {
        console.error('Erro ao salvar projeto:', error);
        showToast('Erro', error.message, 'error');
    } finally {
    saveButton.disabled = false;
    saveButton.innerHTML = '<i class="fas fa-save"></i> Salvar Projeto';
    }
}

/**
 * Editar projeto existente
 */
async function editProject(id) {
    try {
        window.location.href =
            url_base + "views/projeto/projeto.php?id_projeto=" + id;
    } catch (error) {
        console.error('Erro ao carregar projeto:', error);
        showToast('Erro', 'Não foi possível carregar os dados do projeto', 'error');
    }
}


/**
 * Deletar projeto
 */
async function deleteCourse(id) {
    const projeto = projetos.find(c => c.id === id);
    if (!projeto) return;
    const courseStatus = projeto.status.toLowerCase()=='ativo'

    if (!confirm(`Tem certeza que deseja ${courseStatus?'desativar':'ativar'} o projeto "${projeto.name}"?`)) {
        return;
    }

    try {
        const response = courseStatus? await apiDelete('course/', { id: id }):await apiPost('course/active', { id: id })
        if(response.success){
            showToast('Sucesso', response.message, 'success');
            await loadProjetos();
        }

    } catch (error) {
        console.error(`Erro ao ${courseStatus?'desativar':'ativar'} projeto:`, error);
        showToast('Erro', error.message, 'error');
    }
}

/**
 * Buscar projetos com filtros avançados
 */
async function searchCoursesAdvanced(filters = {}) {
    try {
        const response = await apiPost('course/search', filters);

        if (response.success) {
            projetos = response.courses;
        }
    } catch (error) {
        console.error('Erro na busca:', error);
        showToast('Erro', 'Erro ao buscar projetos', 'error');
    }
}



document.getElementById('searchInput').addEventListener('input', () => {
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(applyFiltersAndRender, 500);
});

document.getElementById('modalOverlay').addEventListener('click', (e) => {
    if (e.target.id === 'modalOverlay') {
        closeModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Eventos dos filtros avançados
;['filterTeacher','filterStudent','filterCourse','filterYear'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const handler = () => applyFiltersAndRender();
    if (id === 'filterTeacher' || id === 'filterStudent') {
        el.addEventListener('input', () => {
            clearTimeout(window.__advFilterDebounce);
            window.__advFilterDebounce = setTimeout(handler, 300);
        });
    } else {
        el.addEventListener('change', handler);
    }
});

document.getElementById('courseForm').addEventListener('submit', (e) => {
    e.preventDefault();
    saveProject();
});


flatpickr("#startDate", {
    locale: { ...flatpickr.l10ns.pt, firstDayOfWeek: 0 },
    dateFormat: "Y-m-d",
    altInput: true,
    altFormat: "d/m/Y",
    altInputClass: "gm-date-input",
    onChange: function(selectedDates, dateStr, instance) {
        applyDateFilter();
    },
    defaultDate: document.getElementById('startDate').value || undefined,
});

flatpickr("#endDate", {
    locale: { ...flatpickr.l10ns.pt, firstDayOfWeek: 0 },
    dateFormat: "Y-m-d",
    altInput: true,
    altFormat: "d/m/Y",
    altInputClass: "gm-date-input",
    onChange: function(selectedDates, dateStr, instance) {
        applyDateFilter();
    },
    defaultDate: document.getElementById('endDate').value || undefined,
});


async function downloadAllOrientationReportsZip(selectedYear, selectedMonth) {
    try {
        if (!window.jspdf || !window.jspdf.jsPDF) { return alert('Gerador de PDF indisponível'); }
        if (typeof JSZip === 'undefined') { return alert('Compactador ZIP indisponível'); }

        const computeFiltered = () => {
            const baseList = (typeof projetos !== 'undefined' && Array.isArray(projetos)) ? projetos : (Array.isArray(window.projetos) ? window.projetos : []);
            let list = baseList.slice();
            const searchTerm = (document.getElementById('searchInput')?.value || '').toLowerCase();

            const startDateInput = document.getElementById('startDate');
            const endDateInput = document.getElementById('endDate');
            let startDate = null, endDate = null;
            if (startDateInput && startDateInput._flatpickr?.selectedDates?.[0]) startDate = new Date(startDateInput._flatpickr.selectedDates[0]);
            else if (startDateInput?.value) startDate = startDateInput.value.includes('-') ? new Date(startDateInput.value + 'T00:00:00') : null;
            if (endDateInput && endDateInput._flatpickr?.selectedDates?.[0]) endDate = new Date(endDateInput._flatpickr.selectedDates[0]);
            else if (endDateInput?.value) endDate = endDateInput.value.includes('-') ? new Date(endDateInput.value + 'T23:59:59') : null;
            if (startDate && endDate) {
                startDate.setHours(0,0,0,0); endDate.setHours(23,59,59,999);
                list = list.filter(p => {
                    if (!p.created_at && !p.createdAt) return true;
                    const dt = new Date(p.created_at || p.createdAt);
                    return dt >= startDate && dt <= endDate;
                });
            }
            if (window.currentStatusFilter) {
                list = list.filter(p => (p.status || 'Pré-projeto') === window.currentStatusFilter);
            }
            if (searchTerm) {
                list = list.filter(p => (p.name||'').toLowerCase().includes(searchTerm) || (p.observation||'').toLowerCase().includes(searchTerm));
            }
            const t = (document.getElementById('filterTeacher')?.value || '').toLowerCase();
            const s = (document.getElementById('filterStudent')?.value || '').toLowerCase();
            const cId = (document.getElementById('filterCourse')?.value || '');
            if (t) list = list.filter(p => (p.teachers || p.orientadores || []).some(o => (o.name||'').toLowerCase().includes(t)));
            if (s) list = list.filter(p => (p.students || p.alunos || []).some(a => (a.name||'').toLowerCase().includes(s)));
            if (cId) list = list.filter(p => String(p.course?.id||'') === String(cId));
            return list;
        };

        const filtered = computeFiltered();
        if (!filtered.length) { console.warn('ZIP: lista vazia', {projetos, windowProjetos: window.projetos}); return alert('Nenhum projeto para processar.'); }

        const zip = new JSZip();
        const now = new Date();
        const year = (selectedYear && Number.isInteger(selectedYear)) ? selectedYear : now.getFullYear();
        const month = (selectedMonth && Number.isInteger(selectedMonth)) ? String(selectedMonth).padStart(2,'0') : String(now.getMonth() + 1).padStart(2, '0');
        const { jsPDF } = window.jspdf;

        const btn = (typeof event !== 'undefined' && event && event.currentTarget) ? event.currentTarget : document.querySelector('button[onclick="openZipMonthModal()"]');
        if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'; }

        for (const p of filtered) {
            let detail = null;
            try { detail = await apiGet(`project/${p.id}`); } catch {}
            const project = detail?.project || detail || p;

            const pdfBuf = await (async function makePdf(project) {
                const doc = new jsPDF({unit: 'mm', format: 'a4', orientation: 'portrait'});
                const margin = 18;
                const pageWidth = doc.internal.pageSize.getWidth();
                const contentWidth = pageWidth - (2 * margin);
                let y = margin;

                try { doc.setFont('times', 'bold'); } catch { doc.setFont('helvetica', 'bold'); }
                doc.setFontSize(14);
                doc.text('FICHA DE REGISTRO DE ORIENTAÇÃO DE TCC', pageWidth / 2, y, { align: 'center' });
                y += 10;

                try { doc.setFont('times', 'normal'); } catch { doc.setFont('helvetica', 'normal'); }
                doc.setFontSize(11);

                const curso = project?.course?.name || 'N/A';
                { const line = `Curso: ${curso}`; const w = doc.splitTextToSize(line, contentWidth); doc.text(w, margin, y); y += w.length * 6; }
                const __status = String(project?.status || '');
                const __norm = __status.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
                const discipline = __norm.includes('pre') ? 'TG1' : 'TG2';
                { const line = `Disciplina: ${discipline}`; const w = doc.splitTextToSize(line, contentWidth); doc.text(w, margin, y); y += w.length * 6; }

                const students = Array.isArray(project?.students) ? project.students : [];
                if (students.length) {
                    for (const s of students) {
                        { const nm = `Nome: ${s?.name || 'N/A'}`; const w = doc.splitTextToSize(nm, contentWidth); doc.text(w, margin, y); y += w.length * 6; }
                        { const re = `RA: ${s?.registration || s?.ra || 'N/A'}    E-mail: ${(s?.user?.username) || 'N/A'}`; const w2 = doc.splitTextToSize(re, contentWidth); doc.text(w2, margin, y); y += w2.length * 6; }
                    }
                } else { doc.text('Alunos: N/A', margin, y); y += 6; }

                const teachers = Array.isArray(project?.teachers) ? project.teachers : [];
                if (teachers.length) {
                    try { doc.setFont('times', 'bold'); } catch { doc.setFont('helvetica', 'bold'); }
                    doc.text('Orientador(es):', margin, y); y += 6;
                    try { doc.setFont('times', 'normal'); } catch { doc.setFont('helvetica', 'normal'); }
                    teachers.forEach(t => { const tw = doc.splitTextToSize(`- ${t?.name || 'N/A'}`, contentWidth); doc.text(tw, margin, y); y += tw.length * 6; });
                    y += 2;
                }

                const reports = (project?.reports || []).filter(r => {
                    const raw = r.created_at || r.updated_at || r.date;
                    if (!raw) return false;
                    const d = new Date(raw);
                    return d.getFullYear() === year && (d.getMonth() + 1) === Number(month);
                });
                try { doc.setFont('times', 'bold'); } catch { doc.setFont('helvetica', 'bold'); }
                doc.text('Locais e datas das orientações:', margin, y); y += 5;
                try { doc.setFont('times', 'normal'); } catch { doc.setFont('helvetica', 'normal'); }

                for (const r of reports) {
                    const dt = new Date(r.created_at || r.updated_at || r.date);
                    const dStr = isNaN(dt) ? '' : `${String(dt.getDate()).padStart(2, '0')}/${String(dt.getMonth() + 1).padStart(2, '0')}/${dt.getFullYear()}`;
                    const line = `- ${(r.local || 'Local não informado')}${dStr ? ' - ' + dStr : ''}`;
                    const wrapped = doc.splitTextToSize(line, contentWidth);
                    doc.text(wrapped, margin, y); y += wrapped.length * 6;
                }
                y += 6;

                const pushList = (title, items) => {
                    try { doc.setFont('times', 'bold'); } catch { doc.setFont('helvetica', 'bold'); }
                    doc.text(title, margin, y); y += 5;
                    try { doc.setFont('times', 'normal'); } catch { doc.setFont('helvetica', 'normal'); }
                    if (!items.length) { doc.text('- (sem registros)', margin + 4, y); y += 6; }
                    else { items.forEach(txt => { const w = doc.splitTextToSize(`- ${String(txt)}`, contentWidth); doc.text(w, margin, y); y += w.length * 6; }); }
                    y += 2;
                };

                const topics = reports.map(r => r.description).filter(Boolean);
                const pendRealizadas = reports.filter(r => String(r.status).toLowerCase() === 'concluido' && r.pendency).map(r => r.pendency);
                const pendNaoRealizadas = reports.filter(r => String(r.status).toLowerCase() !== 'concluido' && r.pendency).map(r => r.pendency);
                const feedbacks = reports.map(r => r.feedback).filter(Boolean);
                const nextSteps = reports.map(r => r.next_steps).filter(Boolean);

                pushList('Tópicos abordados:', topics);
                pushList('Pendências realizadas:', pendRealizadas);
                pushList('Pendências não realizadas:', pendNaoRealizadas);
                pushList('Feedbacks do orientador:', feedbacks);
                pushList('Próximos Passos:', nextSteps);

                const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
                const hoje = new Date();
                const dd = String(hoje.getDate()).padStart(2, '0');
                const mmNome = meses[hoje.getMonth()];
                const yyyy = hoje.getFullYear();
                doc.setFontSize(9);
                doc.text(`Garça/SP, ${dd} de ${mmNome} de ${yyyy}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });

                return doc.output('arraybuffer');
            })(project);
            console.log(project.reports);
            console.log(project.reports==null);
            if(project.reports == null)
                continue

            const safe = (project?.name || 'Projeto').replace(/[^a-z0-9]/gi, '_').slice(0, 40);
            zip.file(`FICHA_ORIENTACAO_${safe}_${year}-${month}.pdf`, pdfBuf);
        }

        const blob = await zip.generateAsync({ type: 'blob' });
        const a = document.createElement('a');
        const url = URL.createObjectURL(blob);
        a.href = url;
        a.download = `relatorios_orientacao_${year}-${month}.zip`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);

        if (btn) { btn.disabled = false; btn.innerHTML = '<i class=\"fas fa-download\"></i>'; }
    } catch (e) {
        console.error(e);
        alert('Falha ao gerar ZIP');
    }
}

function openZipMonthModal(){
    let el = document.getElementById('modalZipMonth');
    if(!el){
        el = document.createElement('div');
        el.id = 'modalZipMonth';
        el.className = 'modal-overlay active';
        el.innerHTML = `
      <div class=\"modal\">
        <div class=\"modal-header\">
          <h3 class=\"modal-title\"><i class=\"fas fa-calendar\"></i> Selecionar mês de referência</h3>
          <button class=\"modal-close\" onclick=\"closeZipMonthModal()\"><i class=\"fas fa-times\"></i></button>
        </div>
        <div class=\"modal-body\">
          <div class=\"info-field\">
            <label>Mês</label>
            <input type=\"text\" id=\"zipMonthFilter\" placeholder=\"mm/aaaa\" autocomplete=\"off\" style=\"padding:8px 12px; border-radius:8px; border:2px solid #cbd5e1; width:150px;\" />
          </div>
        </div>
        <div class=\"modal-footer\">
          <button class=\"btn btn-secondary\" onclick=\"closeZipMonthModal()\">Cancelar</button>
          <button class=\"btn btn-success\" onclick=\"confirmDownloadAllOrientationReportsZip()\"><i class=\"fas fa-download\"></i> Baixar ZIP</button>
        </div>
      </div>`;
        document.body.appendChild(el);
    } else {
        el.classList.add('active');
    }
    try{
        const inp = document.getElementById('zipMonthFilter');
        if(window.flatpickr && !inp._flatpickr){
            window.flatpickr(inp, {
                locale: (window.flatpickr?.l10ns?.pt) ? { ...window.flatpickr.l10ns.pt, firstDayOfWeek: 0 } : undefined,
                altInput: true,
                plugins: [new monthSelectPlugin({ shorthand: true, dateFormat: 'Y-m', altFormat: 'm/Y' })]
            });
        }
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth()+1).padStart(2,'0');
        if (document.getElementById('zipMonthFilter')._flatpickr) {
            document.getElementById('zipMonthFilter')._flatpickr.setDate(`${y}-${m}`, true, 'Y-m');
        } else {
            document.getElementById('zipMonthFilter').value = `${y}-${m}`;
        }
    }catch{}
    document.body.style.overflow = 'hidden';
}
function closeZipMonthModal(){
    const el = document.getElementById('modalZipMonth');
    if(el){ el.classList.remove('active'); el.remove(); }
    document.body.style.overflow = 'auto';
}
function confirmDownloadAllOrientationReportsZip(){
    const inp = document.getElementById('zipMonthFilter');
    let year=null, month=null;
    if(inp && inp._flatpickr && inp._flatpickr.selectedDates[0]){
        const d = inp._flatpickr.selectedDates[0];
        year = d.getFullYear();
        month = d.getMonth()+1;
    } else if (inp && inp.value){
        const m1 = inp.value.trim().match(/^(\d{4})-(\d{2})$/);
        if(m1){ year = parseInt(m1[1],10); month = parseInt(m1[2],10); }
    }
    closeZipMonthModal();
    downloadAllOrientationReportsZip(year, month);
}
