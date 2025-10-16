let projetos = [];
let editingId = null;
let currentPage = 1;
const itemsPerPage = 10;

document.addEventListener('DOMContentLoaded', () => {
    loadProjetos();
});


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
<!--            <td>-->
<!--                <div class="description" title="${projeto.description || ''}">-->
<!--                    ${projeto.description || 'Sem descrição'}-->
<!--                </div>-->
<!--            </td>-->
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
<!--                    <button class="btn btn-danger btn-icon" onclick="deleteCourse(${projeto.id})" title="Excluir">-->
<!--                        <i class="fas fa-trash"></i>-->
<!--                    </button>-->
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
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();

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
            console.log(response)
            projetos = response.projects;
            let filteredProjetos = projetos;
            if (searchTerm) {
                filteredProjetos = projetos.filter(projeto =>
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
                                <p>${searchTerm ? 'Tente buscar por outro termo' : 'Comece cadastrando um novo projeto'}</p>
                            </div>
                        </td>
                    </tr>
                `;
                return;
            }
            renderProjetosTable(filteredProjetos);
            renderPagination(filteredProjetos);
            updateStats()
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
    document.getElementById('totalProjects').textContent = projetos.length;
    //TODO mudar a regra para projetos com e sem pendencias
    document.getElementById('noPendencyProjects').textContent = projetos.filter(c => c.status === 'Pré-projeto').length;
    document.getElementById('pendencyProjects').textContent = projetos.filter(c => c.status === 'Pré-projeto').length;

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

    const nome = (nameInput?.value || '').trim();
    const observacao = (obsInput?.value || '').trim();

    if (!nome) {
        showToast('Erro', 'Por favor, preencha o nome do projeto', 'error');
        return;
    }

    if (nome.length < 3) {
        showToast('Erro', 'O nome do projeto deve ter no mínimo 3 caracteres', 'error');
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
                observation: observacao || null
            });

            if (response.success) {
                showToast('Sucesso', response.message || 'Projeto atualizado com sucesso', 'success');
            }
        } else {
            // Create new project
            const response = await apiPost('project/', {
                name: nome,
                observation: observacao || null
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
    window.searchTimeout = setTimeout(loadProjetos, 500);
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


