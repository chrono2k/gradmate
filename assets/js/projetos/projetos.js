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
    
    // Data inicial: 1º de janeiro do ano atual
    const startDate = new Date(new Date().getFullYear(), 0, 1);
    const startDateStr = startDate.toISOString().split('T')[0]; // ISO para flatpickr
    
    // Data final: hoje
    const endDate = new Date();
    const endDateStr = endDate.toISOString().split('T')[0];
    
    // Se já existe instância do flatpickr, use o setDate para sincronizar e abrir no mês correto
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
                    <button class="btn btn-warning btn-icon" onclick="editCourse(${projeto.id})" title="Editar">
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
    // Se clicar no mesmo status, remove o filtro (toggle)
    if (currentStatusFilter === status) {
        clearStatusFilter();
        return;
    }
    
    currentStatusFilter = status;
    
    // Atualizar visual dos cards (destacar o ativo)
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
    // Align with DOM: hidden input is 'projectId'
    const hiddenId = document.getElementById('projectId');
    if (hiddenId) hiddenId.value = '';

    // Reset course select
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
async function saveCourse() {
    // Align field IDs with DOM structure in views/projeto/projetos.php
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
            // Update existing project
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
            // Create new project
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
async function editCourse(id) {
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

document.getElementById('courseForm').addEventListener('submit', (e) => {
    e.preventDefault();
    saveCourse();
});

// Alias to support the refresh button in the view calling loadProject()
function loadProject() {
    return loadProjetos();
}


