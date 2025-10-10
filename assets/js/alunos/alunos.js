let alunos = [];
let editingId = null;
let currentPage = 1;
const itemsPerPage = 10;

document.addEventListener('DOMContentLoaded', () => {
    loadStudent();
});


function renderStudentsTable(filteredStudents) {
    const tbody = document.getElementById('studentsTableBody');
    tbody.innerHTML = '';

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = filteredStudents.slice(start, end);

    tbody.innerHTML = pageItems.map(aluno => `
        <tr>
            <td>
                <div class="student-name">
<!--                    <div class="student-icon">${aluno.image}</div>-->
                    ${aluno.name}
                </div>
            </td>
            <td>
                <div class="email" title="${aluno.user.username || ''}">
                    ${aluno.user.username}
                </div>
            </td>
            <td>
                <div class="registration" title="${aluno.registration || ''}">
                    ${aluno.registration}
                </div>
            </td>
            
            <td>
                <div class="observation" title="${aluno.observation || ''}">
                    ${aluno.observation || 'Sem observações'}
                </div>
            </td>
<!--            TODO fazer a busca de quantidade de projetos ativos-->
            <td>1</td>
            <td>
                <span class="badge ${aluno.user.status.toLowerCase() === 'ativo' ? 'badge-active' : 'badge-inactive'}">
                    <i class="fas fa-check-circle"></i> ${aluno.user.status.charAt(0).toUpperCase() + aluno.user.status.slice(1)}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-warning btn-icon" onclick="editStudent(${aluno.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-icon" onclick="deleteStudent(${aluno.id})" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function renderPagination(filteredStudent) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    const totalPages = Math.ceil(filteredStudent.length / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.className = i === currentPage ? 'active' : '';
        btn.onclick = () => {
            currentPage = i;
            renderStudentsTable(filteredStudent);
            renderPagination(filteredStudent);
        };
        pagination.appendChild(btn);
    }
}

/**
 * Carregar alunos do servidor
 */
async function loadStudent() {
    const tbody = document.getElementById('studentsTableBody');
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();

    tbody.innerHTML = `
        <tr>
            <td colspan="5" style="text-align: center; padding: 40px;">
                <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: var(--primary);"></i>
                <p style="margin-top: 10px; color: var(--text-gray);">Carregando alunos...</p>
            </td>
        </tr>
    `;

    try {
        const response = await apiGet('student');

        if (response.success) {
            alunos = response.students;
            let filteredStudents = alunos;
            if (searchTerm) {
                filteredStudents = alunos.filter(aluno =>
                    aluno.name.toLowerCase().includes(searchTerm) ||
                    (aluno.observation && aluno.observation.toLowerCase().includes(searchTerm))
                );
            }

            if (filteredStudents.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="5">
                            <div class="empty-state">
                                <i class="fas fa-inbox "></i>
                                <h3>Nenhum aluno encontrado</h3>
                                <p>${searchTerm ? 'Tente buscar por outro termo' : 'Comece cadastrando um novo aluno'}</p>
                            </div>
                        </td>
                    </tr>
                `;
                return;
            }
            renderStudentsTable(filteredStudents);
            renderPagination(filteredStudents);
            updateStats()
        } else {
            throw new Error(response.message || 'Erro ao carregar alunos');
        }

    } catch (error) {
        console.error('Erro ao carregar alunos:', error);
        tbody.innerHTML = `
            <tr>
                <td colspan="5">
                    <div class="empty-state">
                        <i class="fas fa-exclamation-triangle empty-icon" style="color: var(--danger);"></i>
                        <h3>Erro ao carregar alunos</h3>
                        <p>${error.message}</p>
                        <button class="btn btn-primary" onclick="loadStudent()" style="margin-top: 15px;">
                            <i class="fas fa-sync-alt"></i> Tentar Novamente
                        </button>
                    </div>
                </td>
            </tr>
        `;
        showToast('Erro', 'Não foi possível carregar os alunos', 'error');
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
function updateStats() { // TODO terminar aqui depois o card de busca
    console.log(alunos)
    document.getElementById('totalAlunos').textContent = alunos.length;
    document.getElementById('alunosFormados').textContent = alunos.filter(a => a.status === 'formado').length;
    document.getElementById('alunosComPendencia').textContent = alunos.filter(a => a.status === 'cursando').length;

}

/**
 * Abrir modal para novo cadastro
 */

function openModal() {
    editingId = null;
    document.getElementById('modalTitle').textContent = 'Novo Aluno';
    document.getElementById('studentForm').reset();
    document.getElementById('studentId').value = '';

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
 * Salvar aluno (criar ou editar)
 */
async function saveStudent() {
    const nome = document.getElementById('studentName').value.trim();
    const email = document.getElementById('studentEmail').value.trim();
    const registration = document.getElementById('studentRegistration').value.trim();
    const observacao = document.getElementById('studentObservation').value.trim();
    // todo adcionar img depois
    const image = "";
    if (!nome) {
        showToast('Erro', 'Por favor, preencha o nome do aluno', 'error');
        return;
    }

    if (nome.length < 3) {
        showToast('Erro', 'O nome do aluno deve ter no mínimo 3 caracteres', 'error');
        return;
    }

    if(!email){
        showToast('Erro', 'Por favor, preencha o email do aluno', 'error');
        return;

    }

    if (email.length < 3) {
        showToast('Erro', 'O email do aluno deve ter no mínimo 3 caracteres', 'error');
        return;
    }

    if(!registration){
        showToast('Erro', 'Por favor, preencha o RA do aluno', 'error');
        return;

    }

    if (registration.length < 3) {
        showToast('Erro', 'O RA do aluno deve ter no mínimo 3 caracteres', 'error');
        return;
    }

    const saveButton = event.target;
    saveButton.disabled = true;
    saveButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...';

    try {
        if (editingId) {
            const response = await apiPut('student', {
                id: editingId,
                name: nome,
                registration: registration,
                email: email,
                image: image,
                observation: observacao || null
            });

            if (response.success) {
                showToast('Sucesso', response.message, 'success');
            }
        } else {
            const response = await apiPost('student', {
                name: nome,
                email: email,
                registration: registration,
                image: image,
                observation: observacao || null
            });

            if (response.success) {
                showToast('Sucesso', response.message, 'success');
            }
        }

        closeModal();
        await loadStudent();

    } catch (error) {
        console.error('Erro ao salvar aluno:', error);
        showToast('Erro', error.message, 'error');
    } finally {
        saveButton.disabled = false;
        saveButton.innerHTML = '<i class="fas fa-save"></i> Salvar Aluno';
    }
}

/**
 * Editar aluno existente
 */
async function editStudent(id) {
    try {
        const response = await apiGet(`student/${id}`);

        if (response.success) {
            const aluno = response.student;
            console.log(aluno)
            editingId = id;
            document.getElementById('modalTitle').textContent = 'Editar Aluno';
            document.getElementById('studentId').value = aluno.id;
            document.getElementById('studentName').value = aluno.name;
            document.getElementById('studentRegistration').value = aluno.registration;
            document.getElementById('studentEmail').value = aluno.user.username;
            document.getElementById('studentObservation').value = aluno.observation || '';

            const overlay = document.getElementById('modalOverlay');
            overlay.classList.add('active');
            overlay.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    } catch (error) {
        console.error('Erro ao carregar aluno:', error);
        showToast('Erro', 'Não foi possível carregar os dados do aluno', 'error');
    }
}


/**
 * Deletar aluno
 */
async function deleteStudent(id) {
    const aluno = alunos.find(c => c.id === id);
    if (!aluno) return;
    const studentStatus = aluno.user.status.toLowerCase()=='ativo'

    if (!confirm(`Tem certeza que deseja ${studentStatus?'desativar':'ativar'} o aluno "${aluno.name}"?`)) {
        return;
    }

    try {
        const response = studentStatus? await apiDelete('student', { id: id }):await apiPost('student/active', { id: id })
        if(response.success){
            showToast('Sucesso', response.message, 'success');
            await loadStudent();
        }

    } catch (error) {
        console.error(`Erro ao ${studentStatus?'desativar':'ativar'} aluno:`, error);
        showToast('Erro', error.message, 'error');
    }
}

/**
 * Buscar alunos com filtros avançados
 */
async function searchStudentsAdvanced(filters = {}) {
    try {
        const response = await apiPost('student/search', filters);

        if (response.success) {
            alunos = response.students;
        }
    } catch (error) {
        console.error('Erro na busca:', error);
        showToast('Erro', 'Erro ao buscar alunos', 'error');
    }
}


document.getElementById('searchInput').addEventListener('input', () => {
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(loadStudent, 500);
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

document.getElementById('studentForm').addEventListener('submit', (e) => {
    e.preventDefault();
    saveStudent();
});


