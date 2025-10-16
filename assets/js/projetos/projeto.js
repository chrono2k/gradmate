let PROJECT_ID = 0;

let projectData = null;
let allTeachers = [];
let allStudents = [];
let allCourses = [];
let selectedTeachers = [];
let selectedStudents = [];
let selectedGuests = [];
let editingReportId = null;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    PROJECT_ID = new URLSearchParams(window.location.search).get('id_projeto')
    loadProjectData();
    loadTeachers();
    loadStudents();
    loadCourses();
    loadProjectFiles();
    // Fecha avançados por padrão
    const adv = document.getElementById('reportAdvanced');
    if (adv) adv.classList.remove('open');
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

    // Mostrar botão de gerar PDF se status for Defesa ou Concluído
    const btnPDF = document.getElementById('btnGeneratePDF');
    if (btnPDF && (projectData.status === 'Defesa' || projectData.status === 'Concluído')) {
        btnPDF.style.display = 'inline-flex';
    } else if (btnPDF) {
        btnPDF.style.display = 'none';
    }

    // Render course
    if (projectData.course) {
        renderCourse(projectData.course);
    }

    // Render teachers
    renderTeachersList(projectData.teachers || []);

    // Render students
    renderStudentsList(projectData.students || []);

    // Render guests
    renderGuestsList(projectData.guests || []);

    // Render reports
    renderReports(projectData.reports || []);
}

// ========================= Arquivos do Projeto =========================
async function loadProjectFiles() {
    const list = document.getElementById('projectFilesList');
    if (!list) return;
    if (!PROJECT_ID) {
        list.innerHTML = '<div class="empty-state"><i class="fas fa-info-circle"></i><p>Abra um projeto válido para ver arquivos</p></div>';
        return;
    }
    list.innerHTML = `
        <div class="loading">
            <p>Carregando arquivos...</p>
        </div>
    `;

    try {
        const resp = await apiGet(`project/${PROJECT_ID}/files`);
        const files = resp.files || resp || [];
        if (!files.length) {
            list.innerHTML = '<div class="empty-state"><i class="fas fa-folder-open"></i><p>Nenhum arquivo enviado</p></div>';
            return;
        }

        list.innerHTML = files.map(f => {
            const fname = f.original_name || f.filename || f.name || f.file_name || 'Arquivo';
            const fsize = Number(f.size || f.file_size || 0);
            const fdate = f.created_at || f.uploaded_at || f.createdAt || f.updated_at || null;
            return `
            <div class="member-item" style="align-items:center;">
                <div class="member-avatar" style="width:40px; height:40px;">
                    <i class="fas fa-file" style="font-size:16px;"></i>
                </div>
                <div class="member-info" style="flex:1;">
                    <div class="member-name" title="${fname}">${fname}</div>
                    <div class="member-detail">${formatBytes(fsize)} • ${formatDateTime(fdate)}</div>
                </div>
                <div style="display:flex; gap:8px;">
                    <button class="btn btn-secondary btn-icon" title="Download" onclick="downloadProjectFile(${f.id})">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="btn btn-danger btn-icon" title="Excluir" onclick="deleteProjectFile(${f.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>`;
        }).join('');
    } catch (e) {
        // Tratar como vazio quando API ainda não tem endpoint/retorna 404
        console.warn('Arquivos do projeto não disponíveis ou ainda não enviados. Exibindo estado vazio.', e?.message || e);
        list.innerHTML = '<div class="empty-state"><i class="fas fa-folder-open"></i><p>Nenhum arquivo enviado</p></div>';
    }
}

async function uploadProjectFiles() {
    const input = document.getElementById('projectFilesInput');
    if (!input || !input.files || !input.files.length) {
        return showToast('Selecione um ou mais arquivos para enviar', 'error');
    }

    const formData = new FormData();
    for (const file of input.files) {
        if (!validateFile(file)) {
            return; // Mensagem já exibida
        }
        formData.append('files[]', file);
    }

    try {
        const resp = await apiUpload(`project/${PROJECT_ID}/files`, formData);
        if (resp.success) {
            showToast('Arquivos enviados com sucesso!', 'success');
            input.value = '';
            await loadProjectFiles();
        } else {
            throw new Error(resp.message || 'Falha no upload');
        }
    } catch (e) {
        console.error('Upload falhou', e);
        showToast(e.message || 'Erro ao enviar arquivos', 'error');
    }
}

async function downloadProjectFile(fileId) {
    try {
        await apiDownload(`project/${PROJECT_ID}/files/${fileId}/download`);
    } catch (e) {
        console.error('Erro no download', e);
        showToast('Não foi possível baixar o arquivo', 'error');
    }
}

async function deleteProjectFile(fileId) {
    if (!confirm('Tem certeza que deseja excluir este arquivo?')) return;
    try {
        const resp = await apiDelete(`project/${PROJECT_ID}/files/${fileId}`, {});
        if (resp.success) {
            showToast('Arquivo excluído', 'success');
            await loadProjectFiles();
        } else {
            throw new Error(resp.message || 'Erro ao excluir arquivo');
        }
    } catch (e) {
        console.error('Erro ao excluir', e);
        showToast('Não foi possível excluir o arquivo', 'error');
    }
}

function validateFile(file) {
    const allowed = ['pdf','doc','docx','xls','xlsx','ppt','pptx','txt','png','jpg','jpeg'];
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (!allowed.includes(ext)) {
        showToast(`Formato não permitido: ${ext}`, 'error');
        return false;
    }
    if (file.size > maxSize) {
        showToast(`Arquivo muito grande: ${file.name}`, 'error');
        return false;
    }
    return true;
}

function formatBytes(bytes) {
    if (!bytes) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

function formatDateTime(dt) {
    if (!dt) return '';
    try { return new Date(dt).toLocaleString('pt-BR'); } catch { return dt; }
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

// Renderizar lista de convidados/banca
function renderGuestsList(guests) {
    const container = document.getElementById('guestsList');

    if (!guests || guests.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-user-slash"></i><p>Nenhum convidado adicionado</p></div>';
        return;
    }

    container.innerHTML = guests.map(guest => `
                <div class="member-item">
                    <div class="member-avatar">
                        ${guest.image ? `<img src="${guest.image}" alt="${guest.name}">` : guest.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div class="member-info">
                        <div class="member-name">${guest.name}</div>
                        ${guest.observation ? `<div class="member-detail">${guest.observation}</div>` : '<div class="member-detail">Membro da banca</div>'}
                    </div>
                    <button class="btn btn-danger btn-icon" onclick="removeGuest(${guest.id})" title="Remover">
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

    container.innerHTML = reports.map(report => {
        const when = new Date(report.created_at || Date.now()).toLocaleString('pt-BR');
        const teacherName = report.teacher ? report.teacher.name : 'Sistema';
        return `
        <div class="report-message ${report.status}">
            <div class="report-header">
                <div class="report-author">
                    <i class="fas fa-user-circle"></i>
                    ${teacherName}
                </div>
                <div class="report-date">${when}</div>
            </div>
            <div class="report-content">
                <div class="report-field">
                    <i class="fas fa-align-left"></i>
                    <div><span class="report-label">Descrição:</span> ${report.description || ''}</div>
                </div>
                ${report.pendency ? `<div class="report-field"><i class=\"fas fa-list-check\"></i><div><span class=\"report-label\">Pendências:</span> ${report.pendency}</div></div>` : ''}
                ${report.next_steps ? `<div class=\"report-field\"><i class=\"fas fa-forward\"></i><div><span class=\"report-label\">Próximos Passos:</span> ${report.next_steps}</div></div>` : ''}
                ${report.local ? `<div class=\"report-field\"><i class=\"fas fa-location-dot\"></i><div><span class=\"report-label\">Local:</span> ${report.local}</div></div>` : ''}
                ${report.feedback ? `<div class=\"report-field\"><i class=\"fas fa-comment-dots\"></i><div><span class=\"report-label\">Feedback:</span> ${report.feedback}</div></div>` : ''}
            </div>
            <div class="report-footer">
                <span class="report-tag ${report.status}">${report.status.toUpperCase()}</span>
                <div class="report-actions">
                    <button class="btn btn-warning btn-icon" title="Editar" onclick="editReport(${report.id})"><i class="fas fa-edit"></i></button>
                </div>
            </div>
        </div>`;
    }).join('');

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

    renderTeacherSelectList(availableTeachers);
    const input = document.getElementById('teacherSearchInput');
    if (input) input.value = '';
    input?.focus();
    openModal('modalAddTeacher');
}

function renderTeacherSelectList(teachers) {
    const container = document.getElementById('teachersSelectList');
    if (!teachers || teachers.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-info-circle"></i><p>Nenhum professor disponível</p></div>';
        return;
    }
    container.innerHTML = teachers.map(teacher => `
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
        </div>`).join('');
}

function filterTeacherList() {
    const q = (document.getElementById('teacherSearchInput')?.value || '').toLowerCase();
    const currentTeacherIds = (projectData?.teachers || []).map(t => t.id);
    const base = allTeachers.filter(t => !currentTeacherIds.includes(t.id));
    const filtered = q ? base.filter(t =>
        (t.name || '').toLowerCase().includes(q) ||
        (t.observation || '').toLowerCase().includes(q)
    ) : base;
    renderTeacherSelectList(filtered);
}

// Abrir modal de adicionar aluno
function openAddStudentModal() {
    selectedStudents = [];
    const currentStudentIds = (projectData?.students || []).map(s => s.id);
    const availableStudents = allStudents.filter(s => !currentStudentIds.includes(s.id));

    renderStudentSelectList(availableStudents);
    const input = document.getElementById('studentSearchInput');
    if (input) input.value = '';
    input?.focus();
    openModal('modalAddStudent');
}

function renderStudentSelectList(students) {
    const container = document.getElementById('studentsSelectList');
    if (!students || students.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-info-circle"></i><p>Nenhum aluno disponível</p></div>';
        return;
    }
    container.innerHTML = students.map(student => `
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
        </div>`).join('');
}

function filterStudentList() {
    const q = (document.getElementById('studentSearchInput')?.value || '').toLowerCase();
    const currentStudentIds = (projectData?.students || []).map(s => s.id);
    const base = allStudents.filter(s => !currentStudentIds.includes(s.id));
    const filtered = q ? base.filter(s =>
        (s.name || '').toLowerCase().includes(q) ||
        (s.registration || '').toLowerCase().includes(q)
    ) : base;
    renderStudentSelectList(filtered);
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

// ========================= CONVIDADOS/BANCA =========================

// Abrir modal de adicionar convidado
function openAddGuestModal() {
    selectedGuests = [];
    const currentTeacherIds = (projectData?.teachers || []).map(t => t.id);
    const currentGuestIds = (projectData?.guests || []).map(g => g.id);
    const excludedIds = [...currentTeacherIds, ...currentGuestIds];
    const availableGuests = allTeachers.filter(t => !excludedIds.includes(t.id));

    renderGuestSelectList(availableGuests);
    const input = document.getElementById('guestSearchInput');
    if (input) input.value = '';
    input?.focus();
    openModal('modalAddGuest');
}

function renderGuestSelectList(guests) {
    const container = document.getElementById('guestsSelectList');
    if (!guests || guests.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-info-circle"></i><p>Nenhum professor disponível</p></div>';
        return;
    }
    container.innerHTML = guests.map(guest => `
        <div class="select-item" onclick="toggleGuestSelection(${guest.id})">
            <div style="display: flex; align-items: center; gap: 12px;">
                <div class="member-avatar" style="width: 40px; height: 40px; font-size: 0.9rem;">
                    ${guest.image ? `<img src="${guest.image}" alt="${guest.name}">` : guest.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                    <div style="color: var(--text-light); font-weight: 600;">${guest.name}</div>
                    ${guest.observation ? `<div style="color: var(--text-gray); font-size: 0.85rem;">${guest.observation}</div>` : ''}
                </div>
            </div>
        </div>`).join('');
}

function filterGuestList() {
    const q = (document.getElementById('guestSearchInput')?.value || '').toLowerCase();
    const currentTeacherIds = (projectData?.teachers || []).map(t => t.id);
    const currentGuestIds = (projectData?.guests || []).map(g => g.id);
    const excludedIds = [...currentTeacherIds, ...currentGuestIds];
    const base = allTeachers.filter(t => !excludedIds.includes(t.id));
    const filtered = q ? base.filter(t =>
        (t.name || '').toLowerCase().includes(q) ||
        (t.observation || '').toLowerCase().includes(q)
    ) : base;
    renderGuestSelectList(filtered);
}

// Toggle seleção de convidado
function toggleGuestSelection(id) {
    const index = selectedGuests.indexOf(id);
    const element = event.currentTarget;

    if (index > -1) {
        selectedGuests.splice(index, 1);
        element.classList.remove('selected');
    } else {
        selectedGuests.push(id);
        element.classList.add('selected');
    }
}

// Confirmar adição de convidados
async function confirmAddGuests() {
    if (selectedGuests.length === 0) {
        alert('Selecione pelo menos um convidado');
        return;
    }

    try {
        const response = await apiPut(`project/${PROJECT_ID}/guests`, JSON.stringify({ guest_ids: selectedGuests }));
        if (response.success) {
            closeModal('modalAddGuest');
            await loadProjectData();
            showToast('Convidados adicionados com sucesso!', 'success');
        } else {
            throw new Error('Erro ao adicionar convidados');
        }
    } catch (error) {
        console.error(error);
        alert('Erro ao adicionar convidados');
    }
}

// Remover convidado
async function removeGuest(guestId) {
    if (!confirm('Tem certeza que deseja remover este convidado?')) return;

    try {
        const response = await apiDelete(`project/${PROJECT_ID}/guests/${guestId}`, {});

        if (response.success) {
            await loadProjectData();
            showToast('Convidado removido com sucesso!', 'success');
        } else {
            throw new Error('Erro ao remover convidado');
        }
    } catch (error) {
        console.error(error);
        alert('Erro ao remover convidado');
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
    const description = (document.getElementById('newReportInput')?.value || '').trim();
    const pendency = (document.getElementById('newReportPendency')?.value || '').trim();
    const next_steps = (document.getElementById('newReportNextSteps')?.value || '').trim();
    const local = (document.getElementById('newReportLocal')?.value || '').trim();
    const feedback = (document.getElementById('newReportFeedback')?.value || '').trim();
    const status = (document.getElementById('newReportStatus')?.value || 'pendente');

    if (!description || description.length < 3) {
        showToast('Erro', 'A descrição deve ter no mínimo 3 caracteres', 'error');
        return;
    }

    try {
        const payload = {
            description,
            pendency: pendency || undefined,
            next_steps: next_steps || undefined,
            local: local || undefined,
            feedback: feedback || undefined,
            status: status || 'pendente'
        };

        const response = await apiPost(`project/${PROJECT_ID}/reports`, JSON.stringify(payload));

        if (response.success) {
            const ids = ['newReportInput','newReportPendency','newReportNextSteps','newReportLocal','newReportFeedback'];
            ids.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
            const st = document.getElementById('newReportStatus'); if (st) st.value = 'pendente';
            await loadProjectData();
            showToast('Sucesso', 'Relatório adicionado com sucesso!', 'success');
        } else {
            throw new Error('Erro ao adicionar relatório');
        }
    } catch (error) {
        console.error(error);
        showToast('Erro', error.message || 'Erro ao adicionar relatório', 'error');
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
function showToast(arg1, arg2, arg3) {
    // Suporta showToast(message, type) e showToast(title, message, type)
    let message, type;
    if (typeof arg3 !== 'undefined') {
        message = arg2;
        type = arg3 || 'success';
    } else {
        message = arg1;
        type = arg2 || 'success';
    }
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

// Toggle campos avançados do relatório
function toggleReportAdvanced() {
    const wrapper = document.getElementById('reportAdvanced');
    if (!wrapper) return;
    wrapper.classList.toggle('open');
}

// Abrir modal de novo relatório
function openNewReportModal() {
    const ids = ['newReportInput','newReportPendency','newReportNextSteps','newReportLocal','newReportFeedback'];
    ids.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    const st = document.getElementById('newReportStatus'); if (st) st.value = 'pendente';
    openModal('modalNewReport');
}

// ========================= Geração de PDF - Ata de Defesa =========================
function generateDefensePDF() {
    if (!projectData) {
        showToast('Erro ao gerar PDF: dados do projeto não carregados', 'error');
        return;
    }

    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

    let yPos = 25;
        const pageWidth = doc.internal.pageSize.width;
        const margin = 20;
        const maxWidth = pageWidth - (2 * margin);
        const lineHeight = 6;

        // ============ CONSTANTES DO MODELO ============
        const instituicao = 'FACULDADE DE TECNOLOGIA DE GARÇA “DEPUTADO JULIO JULINHO MARCONDES DE MOURA”';
        const curso = 'CURSO DE TECNOLOGIA EM ANÁLISE E DESENVOLVIMENTO DE SISTEMAS';
        const cidadeUf = 'Garça/SP';

        const alunoNome = (projectData.students && projectData.students[0]?.name) ? projectData.students[0].name : '__________________';
        const tituloTrabalho = projectData.name || '__________________';

        // Data e hora no formato "Aos DD dias do mês de MÊS de YYYY, às HH:MMh"
        const now = new Date();
        const meses = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
        const dd = String(now.getDate()).padStart(2, '0');
        const mmNome = meses[now.getMonth()];
        const yyyy = now.getFullYear();
        const hh = String(now.getHours()).padStart(2, '0');
        const min = String(now.getMinutes()).padStart(2, '0');
        const dataHoraExtenso = `Aos ${dd} dias do mês de ${mmNome} de ${yyyy}, às ${hh}:${min}h`;

    // ============ CABEÇALHO/TÍTULO ============
    // "ATA Nº" na primeira linha (canto esquerdo), e depois duas quebras de linha
    const ataNumero = (window.__defenseAtaNumber || '').trim();
    if (ataNumero) {
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.text(`ATA Nº ${ataNumero}`, margin, margin);
        yPos = margin + (lineHeight * 2); // duas quebras de linha
    } else {
        yPos = margin; // começa o título principal no topo, se não tiver número
    }

    // Título principal centralizado
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    const tituloLinha = `ATA DE DEFESA DO PROJETO DE GRADUAÇÃO DO ${curso} DA ${instituicao}, APRESENTADO PELO ALUNO ${alunoNome}.`;
        const tituloLinhas = doc.splitTextToSize(tituloLinha, maxWidth);
        doc.text(tituloLinhas, pageWidth / 2, yPos, { align: 'center' });
        yPos += (tituloLinhas.length * lineHeight) + 8;

        doc.setFont(undefined, 'normal');
        doc.setFontSize(11);

        // ============ CORPO FIXO (conforme padrão) ============
        const localCompleto = (window.__defenseLocation && window.__defenseLocation.trim())
            ? window.__defenseLocation.trim()
            : 'Sala Maker da Faculdade de Tecnologia de Garça “Deputado Júlio Julinho Marcondes de Moura”';
    const resultadoEscolhido = window.__defenseResult === 'reprovado' ? 'REPROVADO' : (window.__defenseResult === 'aprovado' ? 'APROVADO' : '__________________');
    const paragrafo1 = `${dataHoraExtenso}, em sessão pública, realizou-se na ${localCompleto}, a defesa do Projeto de Graduação “${tituloTrabalho.toUpperCase()}”, de autoria do aluno ${alunoNome}. A Banca Examinadora iniciou suas atividades submetendo o aluno à forma regimental de defesa do Projeto de Graduação. Terminado o exame, a Banca procedeu ao julgamento e declarou o aluno ${resultadoEscolhido === '__________________' ? '__________________' : resultadoEscolhido}.`;
        const linhas1 = doc.splitTextToSize(paragrafo1, maxWidth);
        doc.text(linhas1, margin, yPos);
        yPos += (linhas1.length * lineHeight) + 8;

    const paragrafo2 = `Desta forma, considera-se ${resultadoEscolhido === '__________________' ? '__________________' : resultadoEscolhido.toLowerCase()} o referido Projeto de Graduação. Encerradas as atividades, foi lavrada a presente ata, que após lida, ficará arquivada no prontuário do discente.`;
        const linhas2 = doc.splitTextToSize(paragrafo2, maxWidth);
        doc.text(linhas2, margin, yPos);
        yPos += (linhas2.length * lineHeight) + 12;

        // ============ ASSINATURAS ============
        if (yPos > 220) {
            doc.addPage();
            yPos = 25;
        }

        // Orientadores (assinatura)
        if (projectData.teachers && projectData.teachers.length > 0) {
            projectData.teachers.forEach((teacher) => {
                if (yPos > 250) { doc.addPage(); yPos = 25; }
                doc.line(margin, yPos, pageWidth - margin, yPos);
                yPos += 5;
                doc.setFontSize(10);
                doc.text(teacher.name, pageWidth / 2, yPos, { align: 'center' });
                yPos += 4;
                doc.setFontSize(9);
                doc.text('Orientador', pageWidth / 2, yPos, { align: 'center' });
                yPos += 12;
                doc.setFontSize(11);
            });
        }

        // Convidados/Membros da Banca (assinatura)
        if (projectData.guests && projectData.guests.length > 0) {
            projectData.guests.forEach((guest) => {
                if (yPos > 250) { doc.addPage(); yPos = 25; }
                doc.line(margin, yPos, pageWidth - margin, yPos);
                yPos += 5;
                doc.setFontSize(10);
                doc.text(guest.name, pageWidth / 2, yPos, { align: 'center' });
                yPos += 4;
                doc.setFontSize(9);
                doc.text('Membro da Banca', pageWidth / 2, yPos, { align: 'center' });
                yPos += 12;
                doc.setFontSize(11);
            });
        }

        // ============ RODAPÉ (Local/Data + paginação) ============
        const totalPages = doc.internal.getNumberOfPages();
        const dataRodape = `${cidadeUf}, ${dd} de ${mmNome} de ${yyyy}`;
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.text(dataRodape, pageWidth / 2, doc.internal.pageSize.height - 15, { align: 'center' });
            doc.text(`Página ${i} de ${totalPages}`, pageWidth / 2, doc.internal.pageSize.height - 10, { align: 'center' });
        }

        // ============ UPLOAD + DOWNLOAD ============
        const safeStudent = alunoNome.replace(/[^a-z0-9]/gi, '_');
        const fileName = `ATA_DEFESA_${safeStudent}_${Date.now()}.pdf`;

        // Upload para backend como arquivo do projeto
        const pdfBlob = doc.output('blob');
        const pdfFile = new File([pdfBlob], fileName, { type: 'application/pdf' });
        const formData = new FormData();
        formData.append('files[]', pdfFile);

        apiUpload(`project/${PROJECT_ID}/files`, formData)
            .then(async (resp) => {
                if (resp?.success) {
                    // Tentar extrair o id do arquivo recém-enviado em vários formatos comuns
                    let fileId = null;

                    // Diretos
                    if (!fileId && typeof resp.file_id === 'number') fileId = resp.file_id;
                    if (!fileId && typeof resp.id === 'number') fileId = resp.id;

                    // Objeto único
                    if (!fileId && resp.file) {
                        const f = resp.file;
                        fileId = f.id || f.file_id || null;
                    }

                    // Arrays possíveis (inclui 'saved' do upload)
                    const candidatesArrays = [resp.saved, resp.files, resp.uploaded, resp.items, resp.data?.files, resp.data?.items].filter(a => Array.isArray(a));
                    for (const arr of candidatesArrays) {
                        if (fileId) break;
                        // Se for array de números (ids)
                        if (arr.length && typeof arr[0] === 'number') {
                            fileId = arr[arr.length - 1];
                            break;
                        }
                        // Se for array de objetos
                        const exact = arr.find(o => (o?.name === fileName) || (o?.original_name === fileName));
                        const contains = exact || arr.find(o => (o?.name || o?.original_name || '').includes(fileName));
                        const obj = contains || arr[arr.length - 1];
                        if (obj) fileId = obj.id || obj.file_id || null;
                    }

                    // Se não veio, tentar recarregar os arquivos e encontrar pelo nome
                    if (!fileId) {
                        try {
                            const listResp = await apiGet(`project/${PROJECT_ID}/files`);
                            const listArrays = [listResp.files, listResp.items, listResp.data?.files, listResp.data?.items].filter(a => Array.isArray(a));
                            for (const arr of listArrays) {
                                const exact = arr.find(f => (f?.name === fileName) || (f?.original_name === fileName));
                                const contains = exact || arr.find(f => (f?.name || f?.original_name || '').includes(fileName));
                                if (contains) { fileId = contains.id || contains.file_id; break; }
                            }
                        } catch (e) {
                            console.warn('Não foi possível listar arquivos para achar file_id da ata', e?.message || e);
                        }
                    }

                    // Criar registro de ata se tivermos um fileId e endpoint existir
                    if (fileId) {
                        try {
                            const payloadAta = {
                                file_id: fileId,
                                student_name: alunoNome,
                                title: tituloTrabalho,
                                result: (window.__defenseResult === 'reprovado' ? 'reprovado' : 'aprovado'),
                                location: localCompleto,
                                started_at: `${yyyy}-${String(now.getMonth()+1).padStart(2,'0')}-${dd}T${hh}:${min}:00-03:00`
                            };
                            await apiPost(`project/${PROJECT_ID}/atas`, payloadAta);
                        } catch (e) {
                            console.warn('Registro de ata não criado (endpoint indisponível?)', e?.message || e);
                        }
                    } else {
                        console.warn('file_id da ata não encontrado após upload');
                    }

                    showToast('Ata gerada e salva no projeto', 'success');
                    if (typeof loadProjectFiles === 'function') {
                        loadProjectFiles().catch(() => {});
                    }
                } else {
                    showToast('Ata gerada, mas falhou ao salvar no projeto', 'error');
                }
            })
            .catch(() => {
                showToast('Ata gerada, mas falhou ao salvar no projeto', 'error');
            })
            .finally(() => {
                // Download local para o usuário
                doc.save(fileName);
            });

    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        showToast('Erro ao gerar PDF: ' + error.message, 'error');
    }
}

// ========= Modal Resultado =========
function openResultModal() {
    const el = document.getElementById('modalResult');
    if (!el) return generateDefensePDF();
    el.classList.add('active');
    // Preencher local padrão se vazio
    const loc = document.getElementById('defenseLocation');
    if (loc && !loc.value) {
        loc.value = 'Sala Maker da Faculdade de Tecnologia de Garça “Deputado Júlio Julinho Marcondes de Moura”';
    }
    // Preencher ATA Nº automaticamente com próximo id
    prefillAtaNumber();
}

function closeResultModal() {
    const el = document.getElementById('modalResult');
    if (el) el.classList.remove('active');
}

function confirmGenerateWithResult() {
    const select = document.getElementById('defenseResult');
    const value = (select && select.value) || 'aprovado';
    window.__defenseResult = value; // 'aprovado' | 'reprovado'
    const ataInput = document.getElementById('defenseAtaNumber');
    window.__defenseAtaNumber = ataInput ? ataInput.value : '';
    const locInput = document.getElementById('defenseLocation');
    window.__defenseLocation = locInput ? locInput.value : '';
    closeResultModal();
    generateDefensePDF();
}

async function prefillAtaNumber() {
    const input = document.getElementById('defenseAtaNumber');
    if (!input) return;
    // Não sobrescreve se o usuário já digitou algo
    if ((input.value || '').trim()) return;

    try {
        const resp = await apiGet(`project/${PROJECT_ID}/atas`);
        const items = (resp && (resp.items || resp.atas || resp.data?.items)) || [];
        let maxId = 0;
        for (const it of items) {
            if (it && typeof it.id === 'number' && it.id > maxId) maxId = it.id;
        }
        const next = maxId + 1 || 1;
        input.value = String(next);
    } catch (e) {
        // Se não houver endpoint ainda, deixa em branco
        console.warn('Não foi possível obter próximo número de ATA', e?.message || e);
    }
}
