let professores = [];
let editingId = null;
let currentPage = 1;
const itemsPerPage = 10;

document.addEventListener('DOMContentLoaded', () => {
    loadTeacher();
});


function renderTeachersTable(filteredTeachers) {
    const tbody = document.getElementById('teachersTableBody');
    tbody.innerHTML = '';

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = filteredTeachers.slice(start, end);

    tbody.innerHTML = pageItems.map(professor => `
        <tr>
            <td>
                <div class="teacher-name">
<!--                    <div class="teacher-icon">${professor.image}</div>-->
                    ${professor.name}
                </div>
            </td>
            <td>
                <div class="email" title="${professor.user.username || ''}">
                    ${professor.user.username}
                </div>
            </td>
            <td>
                <div class="observation" title="${professor.observation || ''}">
                    ${professor.observation || 'Sem observações'}
                </div>
            </td>
<!--            TODO fazer a busca de quantidade de projetos ativos-->
            <td>1</td>
            <td>
                <span class="badge ${professor.user.status.toLowerCase() === 'ativo' ? 'badge-active' : 'badge-inactive'}">
                    <i class="fas fa-check-circle"></i> ${professor.user.status.charAt(0).toUpperCase() + professor.user.status.slice(1)}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-warning btn-icon" onclick="editTeacher(${professor.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-icon" onclick="deleteTeacher(${professor.id})" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function renderPagination(filteredTeacher) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    const totalPages = Math.ceil(filteredTeacher.length / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.className = i === currentPage ? 'active' : '';
        btn.onclick = () => {
            currentPage = i;
            renderTeachersTable(filteredTeacher);
            renderPagination(filteredTeacher);
        };
        pagination.appendChild(btn);
    }
}

/**
 * Carregar professores do servidor
 */
async function loadTeacher() {
    const tbody = document.getElementById('teachersTableBody');
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();

    tbody.innerHTML = `
        <tr>
            <td colspan="5" style="text-align: center; padding: 40px;">
                <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: var(--primary);"></i>
                <p style="margin-top: 10px; color: var(--text-gray);">Carregando professores...</p>
            </td>
        </tr>
    `;

    try {
        const response = await apiGet('teacher');

        if (response.success) {
            professores = response.teachers;
            let filteredTeachers = professores;
            if (searchTerm) {
                filteredTeachers = professores.filter(professor =>
                    professor.name.toLowerCase().includes(searchTerm) ||
                    (professor.observation && professor.observation.toLowerCase().includes(searchTerm))
                );
            }

            if (filteredTeachers.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="5">
                            <div class="empty-state">
                                <i class="fas fa-inbox "></i>
                                <h3>Nenhum professor encontrado</h3>
                                <p>${searchTerm ? 'Tente buscar por outro termo' : 'Comece cadastrando um novo professor'}</p>
                            </div>
                        </td>
                    </tr>
                `;
                return;
            }
            renderTeachersTable(filteredTeachers);
            renderPagination(filteredTeachers);
        } else {
            throw new Error(response.message || 'Erro ao carregar professores');
        }

    } catch (error) {
        console.error('Erro ao carregar professores:', error);
        tbody.innerHTML = `
            <tr>
                <td colspan="5">
                    <div class="empty-state">
                        <i class="fas fa-exclamation-triangle empty-icon" style="color: var(--danger);"></i>
                        <h3>Erro ao carregar professores</h3>
                        <p>${error.message}</p>
                        <button class="btn btn-primary" onclick="loadTeacher()" style="margin-top: 15px;">
                            <i class="fas fa-sync-alt"></i> Tentar Novamente
                        </button>
                    </div>
                </td>
            </tr>
        `;
        showToast('Erro', 'Não foi possível carregar os professores', 'error');
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
 * Abrir modal para novo cadastro
 */

function openModal() {
    editingId = null;
    document.getElementById('modalTitle').textContent = 'Novo Professor';
    document.getElementById('teacherForm').reset();
    document.getElementById('teacherId').value = '';

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
 * Salvar professor (criar ou editar)
 */
async function saveTeacher() {
    const nome = document.getElementById('teacherName').value.trim();
    const email = document.getElementById('teacherEmail').value.trim();
    const observacao = document.getElementById('teacherObservation').value.trim();
    // todo adcionar img depois
    const image = "";
    if (!nome) {
        showToast('Erro', 'Por favor, preencha o nome do professor', 'error');
        return;
    }

    if (nome.length < 3) {
        showToast('Erro', 'O nome do professor deve ter no mínimo 3 caracteres', 'error');
        return;
    }

    if(!email){
        showToast('Erro', 'Por favor, preencha o email do professor', 'error');
        return;

    }

    if (email.length < 3) {
        showToast('Erro', 'O email do professor deve ter no mínimo 3 caracteres', 'error');
        return;
    }

    const saveButton = event.target;
    saveButton.disabled = true;
    saveButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...';

    try {
        if (editingId) {
            const response = await apiPut('teacher', {
                id: editingId,
                name: nome,
                email: email,
                image: image,
                observation: observacao || null
            });

            if (response.success) {
                showToast('Sucesso', response.message, 'success');
            }
        } else {
            const response = await apiPost('teacher', {
                name: nome,
                email: email,
                image: image,
                observation: observacao || null
            });

            if (response.success) {
                showToast('Sucesso', response.message, 'success');
            }
        }

        closeModal();
        await loadTeacher();

    } catch (error) {
        console.error('Erro ao salvar professor:', error);
        showToast('Erro', error.message, 'error');
    } finally {
        saveButton.disabled = false;
        saveButton.innerHTML = '<i class="fas fa-save"></i> Salvar Professor';
    }
}

/**
 * Editar professor existente
 */
async function editTeacher(id) {
    try {
        const response = await apiGet(`teacher/${id}`);

        if (response.success) {
            const professor = response.teacher;

            editingId = id;
            document.getElementById('modalTitle').textContent = 'Editar Professor';
            document.getElementById('teacherId').value = professor.id;
            document.getElementById('teacherName').value = professor.name;
            document.getElementById('teacherEmail').value = professor.user.username;
            document.getElementById('teacherObservation').value = professor.observation || '';

            const overlay = document.getElementById('modalOverlay');
            overlay.classList.add('active');
            overlay.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    } catch (error) {
        console.error('Erro ao carregar professor:', error);
        showToast('Erro', 'Não foi possível carregar os dados do professor', 'error');
    }
}


/**
 * Deletar professor
 */
async function deleteTeacher(id) {
    const professor = professores.find(c => c.id === id);
    if (!professor) return;
    const teacherStatus = professor.user.status.toLowerCase()=='ativo'

    if (!confirm(`Tem certeza que deseja ${teacherStatus?'desativar':'ativar'} o professor "${professor.name}"?`)) {
        return;
    }

    try {
        const response = teacherStatus? await apiDelete('teacher', { id: id }):await apiPost('teacher/active', { id: id })
        if(response.success){
            showToast('Sucesso', response.message, 'success');
            await loadTeacher();
        }

    } catch (error) {
        console.error(`Erro ao ${teacherStatus?'desativar':'ativar'} professor:`, error);
        showToast('Erro', error.message, 'error');
    }
}

/**
 * Buscar professores com filtros avançados
 */
async function searchTeachersAdvanced(filters = {}) {
    try {
        const response = await apiPost('teacher/search', filters);

        if (response.success) {
            professores = response.teachers;
        }
    } catch (error) {
        console.error('Erro na busca:', error);
        showToast('Erro', 'Erro ao buscar professores', 'error');
    }
}



document.getElementById('searchInput').addEventListener('input', () => {
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(loadTeacher, 500);
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

document.getElementById('teacherForm').addEventListener('submit', (e) => {
    e.preventDefault();
    saveTeacher();
});


