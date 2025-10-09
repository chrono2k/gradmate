let cursos = [];
let editingId = null;
let currentPage = 1;
const itemsPerPage = 10;

document.addEventListener('DOMContentLoaded', () => {
    loadCursos();
});


function renderCursosTable(filteredCursos) {
    const tbody = document.getElementById('cursosTableBody');
    tbody.innerHTML = '';

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = filteredCursos.slice(start, end);

    tbody.innerHTML = pageItems.map(curso => `
        <tr>
            <td>
                <div class="course-name">
                    <div class="course-icon">${curso.name.substring(0, 2).toUpperCase()}</div>
                    ${curso.name}
                </div>
            </td>
            <td>
                <div class="observation" title="${curso.observation || ''}">
                    ${curso.observation || 'Sem observações'}
                </div>
            </td>
            <td>${formatDate(curso.created_at)}</td>
            <td>
                <span class="badge ${curso.status.toLowerCase() === 'ativo' ? 'badge-active' : 'badge-inactive'}">
                    <i class="fas fa-check-circle"></i> ${curso.status.charAt(0).toUpperCase() + curso.status.slice(1)}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-warning btn-icon" onclick="editCourse(${curso.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-icon" onclick="deleteCourse(${curso.id})" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function renderPagination(filteredCursos) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    const totalPages = Math.ceil(filteredCursos.length / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.className = i === currentPage ? 'active' : '';
        btn.onclick = () => {
            currentPage = i;
            renderCursosTable(filteredCursos);
            renderPagination(filteredCursos);
        };
        pagination.appendChild(btn);
    }
}

/**
 * Carregar cursos do servidor
 */
async function loadCursos() {
    const tbody = document.getElementById('cursosTableBody');
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();

    tbody.innerHTML = `
        <tr>
            <td colspan="5" style="text-align: center; padding: 40px;">
                <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: var(--primary);"></i>
                <p style="margin-top: 10px; color: var(--text-gray);">Carregando cursos...</p>
            </td>
        </tr>
    `;

    try {
        const response = await apiGet('course/?status=all');

        if (response.success) {
            cursos = response.courses;
            let filteredCursos = cursos;
            if (searchTerm) {
                filteredCursos = cursos.filter(curso =>
                    curso.name.toLowerCase().includes(searchTerm) ||
                    (curso.observation && curso.observation.toLowerCase().includes(searchTerm))
                );
            }

            if (filteredCursos.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="5">
                            <div class="empty-state">
                                <i class="fas fa-inbox"></i>
                                <h3>Nenhum curso encontrado</h3>
                                <p>${searchTerm ? 'Tente buscar por outro termo' : 'Comece cadastrando um novo curso'}</p>
                            </div>
                        </td>
                    </tr>
                `;
                return;
            }
            renderCursosTable(filteredCursos);
            renderPagination(filteredCursos);
            updateStats()
        } else {
            throw new Error(response.message || 'Erro ao carregar cursos');
        }

    } catch (error) {
        console.error('Erro ao carregar cursos:', error);
        tbody.innerHTML = `
            <tr>
                <td colspan="5">
                    <div class="empty-state">
                        <i class="fas fa-exclamation-triangle" style="color: var(--danger);"></i>
                        <h3>Erro ao carregar cursos</h3>
                        <p>${error.message}</p>
                        <button class="btn btn-primary" onclick="loadCursos()" style="margin-top: 15px;">
                            <i class="fas fa-sync-alt"></i> Tentar Novamente
                        </button>
                    </div>
                </td>
            </tr>
        `;
        showToast('Erro', 'Não foi possível carregar os cursos', 'error');
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
    document.getElementById('totalCursos').textContent = cursos.length;
    document.getElementById('cursosAtivos').textContent = cursos.filter(c => c.status === 'ativo').length;
    if (cursos.length > 0) {
        const lastCourse = cursos[cursos.length - 1];
        const lastDate = new Date(lastCourse.created_at);
        const today = new Date();
        const diffTime = Math.abs(today - lastDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        console.log(diffDays)
        console.log(diffDays)
        console.log("diff")
        if (diffDays === 0) {
            document.getElementById('ultimoCadastro').textContent = 'Hoje';
        } else if (diffDays === 1) {
            document.getElementById('ultimoCadastro').textContent = 'Ontem';
        } else {
            document.getElementById('ultimoCadastro').textContent = `${diffDays}d atrás`;
        }
    }
}

/**
 * Abrir modal para novo cadastro
 */

function openModal() {
    editingId = null;
    document.getElementById('modalTitle').textContent = 'Novo Curso';
    document.getElementById('courseForm').reset();
    document.getElementById('courseId').value = '';

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
 * Salvar curso (criar ou editar)
 */
async function saveCourse() {
    const nome = document.getElementById('courseName').value.trim();
    const observacao = document.getElementById('courseObservation').value.trim();

    if (!nome) {
        showToast('Erro', 'Por favor, preencha o nome do curso', 'error');
        return;
    }

    if (nome.length < 3) {
        showToast('Erro', 'O nome do curso deve ter no mínimo 3 caracteres', 'error');
        return;
    }

    const saveButton = event.target;
    saveButton.disabled = true;
    saveButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...';

    try {
        if (editingId) {
            const response = await apiPut('course/', {
                id: editingId,
                name: nome,
                observation: observacao || null
            });

            if (response.success) {
                showToast('Sucesso', response.message, 'success');
            }
        } else {
            const response = await apiPost('course/', {
                name: nome,
                observation: observacao || null
            });

            if (response.success) {
                showToast('Sucesso', response.message, 'success');
            }
        }

        closeModal();
        await loadCursos();

    } catch (error) {
        console.error('Erro ao salvar curso:', error);
        showToast('Erro', error.message, 'error');
    } finally {
        saveButton.disabled = false;
        saveButton.innerHTML = '<i class="fas fa-save"></i> Salvar Curso';
    }
}

/**
 * Editar curso existente
 */
async function editCourse(id) {
    try {
        const response = await apiGet(`course/${id}`);

        if (response.success) {
            const curso = response.course;

            editingId = id;
            document.getElementById('modalTitle').textContent = 'Editar Curso';
            document.getElementById('courseId').value = curso.id;
            document.getElementById('courseName').value = curso.name;
            document.getElementById('courseObservation').value = curso.observation || '';

            const overlay = document.getElementById('modalOverlay');
            overlay.classList.add('active');
            overlay.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    } catch (error) {
        console.error('Erro ao carregar curso:', error);
        showToast('Erro', 'Não foi possível carregar os dados do curso', 'error');
    }
}


/**
 * Deletar curso
 */
async function deleteCourse(id) {
    const curso = cursos.find(c => c.id === id);
    if (!curso) return;
    const courseStatus = curso.status.toLowerCase()=='ativo'

    if (!confirm(`Tem certeza que deseja ${courseStatus?'desativar':'ativar'} o curso "${curso.name}"?`)) {
        return;
    }

    try {
        const response = courseStatus? await apiDelete('course/', { id: id }):await apiPost('course/active', { id: id })
        if(response.success){
            showToast('Sucesso', response.message, 'success');
            await loadCursos();
        }

    } catch (error) {
        console.error(`Erro ao ${courseStatus?'desativar':'ativar'} curso:`, error);
        showToast('Erro', error.message, 'error');
    }
}

/**
 * Buscar cursos com filtros avançados
 */
async function searchCoursesAdvanced(filters = {}) {
    try {
        const response = await apiPost('course/search', filters);

        if (response.success) {
            cursos = response.courses;
        }
    } catch (error) {
        console.error('Erro na busca:', error);
        showToast('Erro', 'Erro ao buscar cursos', 'error');
    }
}



document.getElementById('searchInput').addEventListener('input', () => {
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(loadCursos, 500);
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


