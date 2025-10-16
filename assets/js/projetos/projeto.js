let PROJECT_ID = 0;

let projectData = null;
let allTeachers = [];
let allStudents = [];
let allCourses = [];
let selectedTeachers = [];
let selectedStudents = [];
let editingReportId = null;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    PROJECT_ID = new URLSearchParams(window.location.search).get('id_projeto')
    loadProjectData();
    loadTeachers();
    loadStudents();
    loadCourses();
});

// Carregar dados do projeto
async function loadProjectData() {
    try {
        const response = await apiGet(`project/${PROJECT_ID}`);

        if (response.success || response) {
            projectData = response.project || response;
            renderProjectData();
        }
    } catch (error) {
        console.error('Erro ao carregar projeto:', error);
        alert('Erro ao carregar dados do projeto');
    }
}

// Renderizar dados do projeto
function renderProjectData() {
    if (!projectData) return;

    document.getElementById('projectName').textContent = projectData.name;
    // document.getElementById('projectDescription').textContent = projectData.description;
    document.getElementById('editProjectName').value = projectData.name;
    document.getElementById('editProjectDescription').value = projectData.description || '';
    document.getElementById('editProjectObservation').value = projectData.observation || '';
    document.getElementById('projectStatus').value = projectData.status;

    // Update status badge class
    const statusBadge = document.getElementById('projectStatus');
    statusBadge.className = 'status-badge ' + projectData.status.toLowerCase().replace(' ', '-');

    // Render course
    if (projectData.course) {
        renderCourse(projectData.course);
    }

    // Render teachers
    renderTeachersList(projectData.teachers || []);

    // Render students
    renderStudentsList(projectData.students || []);

    // Render reports
    renderReports(projectData.reports || []);
}

// Renderizar curso
function renderCourse(course) {
    const select = document.getElementById('editProjectCourse');
    if (course) {
        const option = new Option(course.name, course.id, true, true);
        select.add(option);
    }
}

// Renderizar lista de professores
function renderTeachersList(teachers) {
    const container = document.getElementById('teachersList');
    // document.getElementById('teachersCount').textContent = teachers.length;

    if (teachers.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-user-slash"></i><p>Nenhum orientador adicionado</p></div>';
        return;
    }

    container.innerHTML = teachers.map(teacher => `
                <div class="member-item">
                    <div class="member-avatar">
                        ${teacher.image ? `<img src="${teacher.image}" alt="${teacher.name}">` : teacher.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div class="member-info">
                        <div class="member-name">${teacher.name}</div>
                        ${teacher.observation ? `<div class="member-detail">${teacher.observation}</div>` : ''}
                    </div>
                    <button class="btn btn-danger btn-icon" onclick="removeTeacher(${teacher.id})" title="Remover">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `).join('');
}

// Renderizar lista de alunos
function renderStudentsList(students) {
    const container = document.getElementById('studentsList');
    // document.getElementById('studentsCount').textContent = students.length;

    if (students.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-user-slash"></i><p>Nenhum aluno adicionado</p></div>';
        return;
    }

    container.innerHTML = students.map(student => `
                <div class="member-item">
                    <div class="member-avatar">
                        ${student.image ? `<img src="${student.image}" alt="${student.name}">` : student.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div class="member-info">
                        <div class="member-name">${student.name}</div>
                        <div class="member-detail">Matrícula: ${student.registration || 'N/A'}</div>
                    </div>
                    <button class="btn btn-danger btn-icon" onclick="removeStudent(${student.id})" title="Remover">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `).join('');
}

// Renderizar relatórios
function renderReports(reports) {
    const container = document.getElementById('chatMessages');

    if (reports.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-comments-slash"></i><p>Nenhum relatório ainda</p></div>';
        return;
    }

    container.innerHTML = reports.map(report => `
                <div class="report-message ${report.status}" onclick="editReport(${report.id})">
                    <div class="report-header">
                        <div class="report-author">
                            <i class="fas fa-user-circle"></i>
                            ${report.teacher ? report.teacher.name : 'Sistema'}
                        </div>
                        <div class="report-date">
                            ${new Date(report.created_at || Date.now()).toLocaleString('pt-BR')}
                        </div>
                    </div>
                    <div class="report-content">
                        <strong>Descrição:</strong> ${report.description}<br>
                        ${report.pendency ? `<strong>Pendências:</strong> ${report.pendency}<br>` : ''}
                        ${report.next_steps ? `<strong>Próximos Passos:</strong> ${report.next_steps}<br>` : ''}
                        ${report.local ? `<strong>Local:</strong> ${report.local}<br>` : ''}
                        ${report.feedback ? `<strong>Feedback:</strong> ${report.feedback}` : ''}
                    </div>
                    <div class="report-footer">
                        <span class="report-tag ${report.status}">${report.status.toUpperCase()}</span>
                    </div>
                </div>
            `).join('');

    // Scroll to bottom
    container.scrollTop = container.scrollHeight;
}

// Carregar lista de professores
async function loadTeachers() {
    try {
        const response = await apiGet(`teacher`);
        allTeachers = response.teachers || response;
    } catch (error) {
        console.error('Erro ao carregar professores:', error);
    }
}

// Carregar lista de alunos
async function loadStudents() {
    try {
        const response = await apiGet(`student`);
        allStudents = response.students || response;
    } catch (error) {
        console.error('Erro ao carregar alunos:', error);
    }
}

// Carregar lista de cursos
async function loadCourses() {
    try {
        const response = await apiGet(`/course`);
        allCourses = response.courses || response;

        const select = document.getElementById('editProjectCourse');
        select.innerHTML = '<option value="">Selecione um curso...</option>' +
            allCourses.map(course =>
                `<option value="${course.id}" ${projectData?.course?.id === course.id ? 'selected' : ''}>${course.name}</option>`
            ).join('');
    } catch (error) {
        console.error('Erro ao carregar cursos:', error);
    }
}

// Abrir modal de adicionar professor
function openAddTeacherModal() {
    selectedTeachers = [];
    const currentTeacherIds = (projectData?.teachers || []).map(t => t.id);
    const availableTeachers = allTeachers.filter(t => !currentTeacherIds.includes(t.id));

    const container = document.getElementById('teachersSelectList');

    if (availableTeachers.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-info-circle"></i><p>Todos os professores já foram adicionados</p></div>';
    } else {
        container.innerHTML = availableTeachers.map(teacher => `
                    <div class="select-item" onclick="toggleTeacherSelection(${teacher.id})">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div class="member-avatar" style="width: 40px; height: 40px; font-size: 0.9rem;">
                                ${teacher.image ? `<img src="${teacher.image}" alt="${teacher.name}">` : teacher.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <div style="color: var(--text-light); font-weight: 600;">${teacher.name}</div>
                                ${teacher.observation ? `<div style="color: var(--text-gray); font-size: 0.85rem;">${teacher.observation}</div>` : ''}
                            </div>
                        </div>
                    </div>
                `).join('');
    }

    openModal('modalAddTeacher');
}

// Abrir modal de adicionar aluno
function openAddStudentModal() {
    selectedStudents = [];
    const currentStudentIds = (projectData?.students || []).map(s => s.id);
    const availableStudents = allStudents.filter(s => !currentStudentIds.includes(s.id));

    const container = document.getElementById('studentsSelectList');

    if (availableStudents.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-info-circle"></i><p>Todos os alunos já foram adicionados</p></div>';
    } else {
        container.innerHTML = availableStudents.map(student => `
                    <div class="select-item" onclick="toggleStudentSelection(${student.id})">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div class="member-avatar" style="width: 40px; height: 40px; font-size: 0.9rem;">
                                ${student.image ? `<img src="${student.image}" alt="${student.name}">` : student.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <div style="color: var(--text-light); font-weight: 600;">${student.name}</div>
                                <div style="color: var(--text-gray); font-size: 0.85rem;">Matrícula: ${student.registration || 'N/A'}</div>
                            </div>
                        </div>
                    </div>
                `).join('');
    }

    openModal('modalAddStudent');
}

// Toggle seleção de professor
function toggleTeacherSelection(id) {
    const index = selectedTeachers.indexOf(id);
    const element = event.currentTarget;

    if (index > -1) {
        selectedTeachers.splice(index, 1);
        element.classList.remove('selected');
    } else {
        selectedTeachers.push(id);
        element.classList.add('selected');
    }
}

// Toggle seleção de aluno
function toggleStudentSelection(id) {
    const index = selectedStudents.indexOf(id);
    const element = event.currentTarget;

    if (index > -1) {
        selectedStudents.splice(index, 1);
        element.classList.remove('selected');
    } else {
        selectedStudents.push(id);
        element.classList.add('selected');
    }
}

// Confirmar adição de professores
async function confirmAddTeachers() {
    if (selectedTeachers.length === 0) {
        alert('Selecione pelo menos um professor');
        return;
    }

    try {
        const response = await apiPost(`project/${PROJECT_ID}/teachers`, JSON.stringify({ teacher_ids: selectedTeachers }));
        if (response.success) {
            closeModal('modalAddTeacher');
            await loadProjectData();
            showToast('Professores adicionados com sucesso!', 'success');
        } else {
            throw new Error('Erro ao adicionar professores');
        }
    } catch (error) {
        console.error(error);
        alert('Erro ao adicionar professores');
    }
}

// Confirmar adição de alunos
async function confirmAddStudents() {
    if (selectedStudents.length === 0) {
        alert('Selecione pelo menos um aluno');
        return;
    }

    try {
        const response = await apiPost(`project/${PROJECT_ID}/students`, JSON.stringify({ student_ids: selectedStudents }));

        if (response.success) {
            closeModal('modalAddStudent');
            await loadProjectData();
            showToast('Alunos adicionados com sucesso!', 'success');
        } else {
            throw new Error('Erro ao adicionar alunos');
        }
    } catch (error) {
        console.error(error);
        alert('Erro ao adicionar alunos');
    }
}

// Remover professor
async function removeTeacher(teacherId) {
    if (!confirm('Tem certeza que deseja remover este orientador?')) return;

    try {
        const response = await apiDelete(`project/${PROJECT_ID}/teachers/${teacherId}`, {});

        if (response.success) {
            await loadProjectData();
            showToast('Orientador removido com sucesso!', 'success');
        } else {
            throw new Error('Erro ao remover orientador');
        }
    } catch (error) {
        console.error(error);
        alert('Erro ao remover orientador');
    }
}

// Remover aluno
async function removeStudent(studentId) {
    if (!confirm('Tem certeza que deseja remover este aluno?')) return;

    try {
        const response = await apiDelete(`project/${PROJECT_ID}/students/${studentId}`, {  });

        if (response.success) {
            await loadProjectData();
            showToast('Aluno removido com sucesso!', 'success');
        } else {
            throw new Error('Erro ao remover aluno');
        }
    } catch (error) {
        console.error(error);
        alert('Erro ao remover aluno');
    }
}

// Adicionar novo relatório
async function addNewReport() {
    const description = document.getElementById('newReportInput').value.trim();

    if (!description) {
        alert('Digite uma descrição para o relatório');
        return;
    }

    try {
        const response = await apiPost(`project/${PROJECT_ID}/reports`,JSON.stringify({
            description: description,
            status: 'pendente'
        }));

        if (response.success) {
            document.getElementById('newReportInput').value = '';
            await loadProjectData();
            showToast('Relatório adicionado com sucesso!', 'success');
        } else {
            throw new Error('Erro ao adicionar relatório');
        }
    } catch (error) {
        console.error(error);
        alert('Erro ao adicionar relatório');
    }
}

// Handle Enter key on report input
function handleReportKeyPress(event) {
    if (event.key === 'Enter') {
        addNewReport();
    }
}

// Editar relatório
function editReport(reportId) {
    const report = projectData.reports.find(r => r.id === reportId);
    if (!report) return;

    editingReportId = reportId;

    document.getElementById('editReportDescription').value = report.description || '';
    document.getElementById('editReportPendency').value = report.pendency || '';
    document.getElementById('editReportNextSteps').value = report.next_steps || '';
    document.getElementById('editReportLocal').value = report.local || '';
    document.getElementById('editReportFeedback').value = report.feedback || '';
    document.getElementById('editReportStatus').value = report.status || 'pendente';

    openModal('modalEditReport');
}

// Salvar relatório editado
async function saveReport() {
    if (!editingReportId) return;

    const data = {
        description: document.getElementById('editReportDescription').value,
        pendency: document.getElementById('editReportPendency').value,
        next_steps: document.getElementById('editReportNextSteps').value,
        local: document.getElementById('editReportLocal').value,
        feedback: document.getElementById('editReportFeedback').value,
        status: document.getElementById('editReportStatus').value
    };

    try {
        const response = await apiDelete(`project/${PROJECT_ID}/reports/${editingReportId}`, JSON.stringify(data));

        if (response.success) {
            closeModal('modalEditReport');
            await loadProjectData();
            showToast('Relatório atualizado com sucesso!', 'success');
        } else {
            throw new Error('Erro ao atualizar relatório');
        }
    } catch (error) {
        console.error(error);
        alert('Erro ao atualizar relatório');
    }
}

// Deletar relatório
async function deleteReport() {
    if (!editingReportId) return;
    if (!confirm('Tem certeza que deseja excluir este relatório?')) return;

    try {
        const response = await apiDelete(`project/${PROJECT_ID}`, {});
        if (response.success) {
            closeModal('modalEditReport');
            await loadProjectData();
            showToast('Relatório excluído com sucesso!', 'success');
        } else {
            throw new Error('Erro ao excluir relatório');
        }
    } catch (error) {
        console.error(error);
        alert('Erro ao excluir relatório');
    }
}

// Salvar informações do projeto
async function saveProjectInfo() {
    const data = {
        name: document.getElementById('editProjectName').value,
        description: document.getElementById('editProjectDescription').value,
        observation: document.getElementById('editProjectObservation').value,
        course_id: document.getElementById('editProjectCourse').value
    };

    try {
        const response = await apiPut(`project/${PROJECT_ID}`, JSON.stringify(data));
        if (response.success) {
            await loadProjectData();
            showToast('Projeto atualizado com sucesso!', 'success');
        } else {
            throw new Error('Erro ao atualizar projeto');
        }
    } catch (error) {
        console.error(error);
        alert('Erro ao atualizar projeto');
    }
}

// Atualizar status do projeto
async function updateProjectStatus() {
    const status = document.getElementById('projectStatus').value;

    try {
        const response = await apiPut(`project/${PROJECT_ID}`, JSON.stringify({ status: status }));

        if (response.success) {
            await loadProjectData();
            showToast('Status atualizado com sucesso!', 'success');
        } else {
            throw new Error('Erro ao atualizar status');
        }
    } catch (error) {
        console.error(error);
        alert('Erro ao atualizar status');
    }
}

// Abrir modal
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Fechar modal
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 16px 24px;
                background: ${type === 'success' ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)'};
                color: white;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
                z-index: 10000;
                animation: slideInRight 0.3s ease;
                font-weight: 600;
            `;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Fechar modais com ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = 'auto';
    }
});
