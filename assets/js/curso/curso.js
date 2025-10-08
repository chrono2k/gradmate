let cursos = [
    {
        id: 1,
        nome: 'Análise e Desenvolvimento de Sistemas',
        observacao: 'Curso focado em desenvolvimento de software e análise de requisitos',
        dataCadastro: '2024-01-15',
        status: 'ativo'
    },
    {
        id: 2,
        nome: 'Gestão da Tecnologia da Informação',
        observacao: 'Formação de profissionais para gerenciar equipes e projetos de TI',
        dataCadastro: '2024-02-20',
        status: 'ativo'
    },
    {
        id: 3,
        nome: 'Redes de Computadores',
        observacao: 'Especialização em infraestrutura e segurança de redes',
        dataCadastro: '2024-03-10',
        status: 'ativo'
    }
];

let editingId = null;

// Carregar cursos na tabela
function loadCursos() {
    const tbody = document.getElementById('cursosTableBody');
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();

    let filteredCursos = cursos;
    if (searchTerm) {
        filteredCursos = cursos.filter(curso =>
            curso.nome.toLowerCase().includes(searchTerm) ||
            curso.observacao.toLowerCase().includes(searchTerm)
        );
    }

    if (filteredCursos.length === 0) {
        tbody.innerHTML = `
                    <tr>
                        <td colspan="5">
                            <div class="empty-state">
                                <i class="fas fa-inbox"></i>
                                <h3>Nenhum curso encontrado</h3>
                                <p>Comece cadastrando um novo curso</p>
                            </div>
                        </td>
                    </tr>
                `;
        return;
    }

    tbody.innerHTML = filteredCursos.map(curso => `
                <tr>
                    <td>
                        <div class="course-name">
                            <div class="course-icon">${curso.nome.substring(0, 2).toUpperCase()}</div>
                            ${curso.nome}
                        </div>
                    </td>
                    <td>
                        <div class="observation" title="${curso.observacao}">
                            ${curso.observacao || 'Sem observações'}
                        </div>
                    </td>
                    <td>${formatDate(curso.dataCadastro)}</td>
                    <td>
                        <span class="badge badge-active">
                            <i class="fas fa-check-circle"></i> Ativo
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

    updateStats();
}

// Formatar data
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

// Atualizar estatísticas
function updateStats() {
    document.getElementById('totalCursos').textContent = cursos.length;
    document.getElementById('cursosAtivos').textContent = cursos.filter(c => c.status === 'ativo').length;

    if (cursos.length > 0) {
        const lastCourse = cursos[cursos.length - 1];
        const lastDate = new Date(lastCourse.dataCadastro);
        const today = new Date();
        const diffTime = Math.abs(today - lastDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            document.getElementById('ultimoCadastro').textContent = 'Hoje';
        } else if (diffDays === 1) {
            document.getElementById('ultimoCadastro').textContent = 'Ontem';
        } else {
            document.getElementById('ultimoCadastro').textContent = `${diffDays}d atrás`;
        }
    }
}

// Abrir modal
function openModal() {
    console.log("Abrindo modal...");

    editingId = null;
    document.getElementById('modalTitle').textContent = 'Novo Curso';
    document.getElementById('courseForm').reset();
    document.getElementById('courseId').value = '';

    const overlay = document.getElementById('modalOverlay');
    overlay.classList.add('active');

    // Forçar display caso não esteja aparecendo
    overlay.style.display = 'flex';

    // Prevenir scroll do body
    document.body.style.overflow = 'hidden';

    console.log("Modal classes:", overlay.classList);
    console.log("Modal display:", getComputedStyle(overlay).display);
}

function closeModal() {
    const overlay = document.getElementById('modalOverlay');
    overlay.classList.remove('active');
    overlay.style.display = 'none';

    // Restaurar scroll
    document.body.style.overflow = 'auto';
}
// Salvar curso
function saveCourse() {
    const nome = document.getElementById('courseName').value.trim();
    const observacao = document.getElementById('courseObservation').value.trim();

    if (!nome) {
        showToast('Erro', 'Por favor, preencha o nome do curso', 'error');
        return;
    }

    if (editingId) {
        // Editar curso existente
        const index = cursos.findIndex(c => c.id === editingId);
        cursos[index] = {
            ...cursos[index],
            nome: nome,
            observacao: observacao
        };
        showToast('Sucesso', 'Curso atualizado com sucesso!', 'success');
    } else {
        // Criar novo curso
        const newCourse = {
            id: cursos.length > 0 ? Math.max(...cursos.map(c => c.id)) + 1 : 1,
            nome: nome,
            observacao: observacao,
            dataCadastro: new Date().toISOString().split('T')[0],
            status: 'ativo'
        };
        cursos.push(newCourse);
        showToast('Sucesso', 'Curso cadastrado com sucesso!', 'success');
    }

    closeModal();
    loadCursos();
}

// Editar curso
function editCourse(id) {
    const curso = cursos.find(c => c.id === id);
    if (!curso) return;

    editingId = id;
    document.getElementById('modalTitle').textContent = 'Editar Curso';
    document.getElementById('courseId').value = curso.id;
    document.getElementById('courseName').value = curso.nome;
    document.getElementById('courseObservation').value = curso.observacao;
    document.getElementById('modalOverlay').classList.add('active');
}

// Deletar curso
function deleteCourse(id) {
    const curso = cursos.find(c => c.id === id);
    if (!curso) return;

    if (confirm(`Tem certeza que deseja excluir o curso "${curso.nome}"?\n\nEsta ação não pode ser desfeita.`)) {
        cursos = cursos.filter(c => c.id !== id);
        showToast('Sucesso', 'Curso excluído com sucesso!', 'success');
        loadCursos();
    }
}

// Mostrar notificação toast
function showToast(title, message, type = 'success') {
    VanillaToasts.create({
        positionClass: 'topRight',
        title: title,
        text: message,
        type: type,
        icon: '../../assets/img/icone-tcc.png',
        timeout: 5000,
        callback: function () { "" }
    });
}

// Busca em tempo real
document.getElementById('searchInput').addEventListener('input', loadCursos);

// Fechar modal ao clicar fora
document.getElementById('modalOverlay').addEventListener('click', (e) => {
    if (e.target.id === 'modalOverlay') {
        closeModal();
    }
});

// Fechar modal com ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Salvar com Enter no formulário
document.getElementById('courseForm').addEventListener('submit', (e) => {
    e.preventDefault();
    saveCourse();
});

// Carregar cursos ao iniciar
loadCursos();
