<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GradMate</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="../../css/projetos/projeto.css?v=<?php echo date('YmdHis'); ?>">
    <link rel="stylesheet" href="../../css/generic/header.css?v=<?php echo date('YmdHis'); ?>">
    <link rel="stylesheet" href="../../css/generic/generic.css?v=<?php echo date('YmdHis'); ?>">
    <!-- jsPDF para geração de PDFs -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <style>
    </style>
</head>
<?php
include("../generics/header.php");
include("../generics/sidebar.php");
?>

<body>

<main class="main-content" id="mainContent">
    <div class="container">
        <!-- Page Header -->
        <div class="page-header">
            <div class="header-content">
                <div class="header-info">
                    <h1 id="projectName">Carregando...</h1>
<!--                    <p id="projectDescription">Descrição do projeto</p>-->
                </div>
                <div style="display: flex; gap: 12px; align-items: center;">
                    <select id="projectStatus" class="status-badge" onchange="updateProjectStatus()">
                        <option value="Pré-projeto">Pré-projeto</option>
                        <option value="Qualificação">Qualificação</option>
                        <option value="Defesa">Defesa</option>
                        <option value="Concluído">Concluído</option>
                        <option value="Trancado">Trancado</option>
                    </select>
                    <button id="btnGeneratePDF" class="btn btn-success" onclick="openResultModal()" style="display:none;">
                        <i class="fas fa-file-pdf"></i>
                        Gerar Ata de Defesa
                    </button>
                </div>
            </div>
        </div>

        <!-- Main Grid -->
        <div class="grid-layout">
            <!-- Left Column -->
            <div style="display: flex; flex-direction: column; gap: 24px;">
                <!-- Project Info -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-info-circle"></i>
                            Informações do Projeto
                        </h3>
                        <button class="btn btn-primary btn-icon" onclick="saveProjectInfo()" title="Salvar">
                            <i class="fas fa-save"></i>
                        </button>
                    </div>

                    <div class="info-field">
                        <label>Nome do Projeto</label>
                        <input type="text" id="editProjectName" placeholder="Nome do projeto...">
                    </div>

                    <div class="info-field">
                        <label>Descrição</label>
                        <textarea id="editProjectDescription" placeholder="Descrição detalhada do projeto..."></textarea>
                    </div>

                    <div class="info-field">
                        <label>Observações</label>
                        <textarea id="editProjectObservation" placeholder="Observações gerais..."></textarea>
                    </div>

                    <div class="info-field">
                        <label>Curso</label>
                        <select id="editProjectCourse">
                            <option value="">Carregando cursos...</option>
                        </select>
                    </div>
                </div>

                <!-- Reports / Chat -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-comments"></i>
                            Relatórios e Acompanhamento
                        </h3>
                        <button class="btn btn-primary" onclick="openNewReportModal()" title="Gerar Relatório">
                            <i class="fas fa-plus" style="margin-right:8px;"></i>
                            Gerar Relatório
                        </button>
                    </div>

                    <div class="chat-container">
                        <div class="chat-messages" id="chatMessages">
                            <div class="loading">
                                <div class="spinner"></div>
                                <p>Carregando relatórios...</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Project Files -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-paperclip"></i>
                            Arquivos do Projeto
                        </h3>
                    </div>

                    <div class="info-field">
                        <label>Enviar arquivos</label>
                        <div style="display:flex; gap:12px; align-items:center; flex-wrap: wrap;">
                            <input type="file" id="projectFilesInput" multiple>
                            <button class="btn btn-primary" onclick="uploadProjectFiles()">
                                <i class="fas fa-cloud-upload-alt"></i>
                                Upload
                            </button>
                            <button class="btn btn-secondary" onclick="loadProjectFiles()" title="Atualizar lista">
                                <i class="fas fa-sync-alt"></i>
                                Atualizar
                            </button>
                        </div>
                        <small style="color: var(--text-gray); display:block; margin-top:6px;">Formatos permitidos: pdf, doc, docx, xls, xlsx, ppt, pptx, txt, png, jpg, jpeg • Máx.: 10MB por arquivo.</small>
                    </div>

                    <div class="members-list" id="projectFilesList">
                        <div class="loading">
                            <p>Carregando arquivos...</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Column -->
            <div style="display: flex; flex-direction: column; gap: 24px;">
                <!-- Teachers -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-chalkboard-teacher"></i>
                            Orientadores
                        </h3>
                        <button class="btn btn-success btn-icon" onclick="openAddTeacherModal()" title="Adicionar">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>

                    <div class="members-list" id="teachersList">
                        <div class="loading">
                            <p>Carregando...</p>
                        </div>
                    </div>
                </div>

                <!-- Students -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-user-graduate"></i>
                            Alunos
                        </h3>
                        <button class="btn btn-success btn-icon" onclick="openAddStudentModal()" title="Adicionar">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>

                    <div class="members-list" id="studentsList">
                        <div class="loading">
                            <p>Carregando...</p>
                        </div>
                    </div>
                </div>

                <!-- Guests (Convidados/Banca) -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-user-tie"></i>
                            Convidados / Banca
                        </h3>
                        <button class="btn btn-success btn-icon" onclick="openAddGuestModal()" title="Adicionar">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>

                    <div class="members-list" id="guestsList">
                        <div class="loading">
                            <p>Carregando...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Resultado da Defesa -->
        <div class="modal-overlay" id="modalResult">
            <div class="modal">
                <div class="modal-header">
                    <h3 class="modal-title">
                        <i class="fas fa-gavel"></i>
                        Resultado da Defesa
                    </h3>
                    <button class="modal-close" onclick="closeResultModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <!-- Campo ATA Nº oculto para o usuário, mantido para preenchimento automático -->
                    <div class="info-field" style="display: none;">
                        <label for="defenseAtaNumber">
                            <i class="fas fa-hashtag"></i>
                            ATA Nº
                        </label>
                        <input type="text" id="defenseAtaNumber" placeholder="Ex.: 012/2025" autocomplete="off" />
                    </div>

                    <div class="info-field">
                        <label for="defenseResult">
                            <i class="fas fa-check-double"></i>
                            Resultado
                        </label>
                        <select id="defenseResult">
                            <option value="aprovado">Aprovado</option>
                            <option value="reprovado">Reprovado</option>
                        </select>
                    </div>

                    <div class="info-field">
                        <label for="defenseLocation">
                            <i class="fas fa-location-dot"></i>
                            Local da Defesa
                        </label>
                        <input type="text" id="defenseLocation" placeholder="Informe o local" autocomplete="off" />
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="closeResultModal()">Cancelar</button>
                    <button class="btn btn-success" onclick="confirmGenerateWithResult()">
                        <i class="fas fa-file-pdf"></i>
                        Gerar Ata
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Add Teacher -->
    <div class="modal-overlay" id="modalAddTeacher">
        <div class="modal">
            <div class="modal-header">
                <h3 class="modal-title">Adicionar Orientador</h3>
                <button class="modal-close" onclick="closeModal('modalAddTeacher')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="info-field" style="margin-bottom:12px;">
                    <label>Buscar orientadores</label>
                    <input type="text" id="teacherSearchInput" placeholder="Digite para buscar..." oninput="filterTeacherList()">
                </div>
                <div class="select-list" id="teachersSelectList"></div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeModal('modalAddTeacher')">Cancelar</button>
                <button class="btn btn-success" onclick="confirmAddTeachers()">Adicionar Selecionados</button>
            </div>
        </div>
    </div>

    <!-- Modal Add Student -->
    <div class="modal-overlay" id="modalAddStudent">
        <div class="modal">
            <div class="modal-header">
                <h3 class="modal-title" id="modalTitleAluno">Adicionar Aluno</h3>
                <button class="modal-close" onclick="closeModal('modalAddStudent')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="info-field" style="margin-bottom:12px;">
                    <label>Buscar alunos</label>
                    <input type="text" id="studentSearchInput" placeholder="Digite para buscar..." oninput="filterStudentList()">
                </div>
                <div class="select-list" id="studentsSelectList"></div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeModal('modalAddStudent')">Cancelar</button>
                <button class="btn btn-success" onclick="confirmAddStudents()">Adicionar Selecionados</button>
            </div>
        </div>
    </div>

    <!-- Modal Edit Report -->
    <div class="modal-overlay" id="modalEditReport">
        <div class="modal">
            <div class="modal-header">
                <h3 class="modal-title">Editar Relatório</h3>
                <button class="modal-close" onclick="closeModal('modalEditReport')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="edit-report-grid">
                    <div class="info-field" style="margin-bottom:12px; grid-column: 1 / -1;">
                        <label>Descrição</label>
                        <textarea id="editReportDescription" style="min-height:60px;"></textarea>
                    </div>
                    <div class="info-field" style="margin-bottom:12px;">
                        <label>Local</label>
                        <input type="text" id="editReportLocal">
                    </div>
                    <div class="info-field" style="margin-bottom:12px;">
                        <label>Status</label>
                        <select id="editReportStatus">
                            <option value="pendente">Pendente</option>
                            <option value="concluido">Concluído</option>
                        </select>
                    </div>
                    <div class="info-field" style="margin-bottom:12px; grid-column: 1 / -1;">
                        <label>Pendências</label>
                        <textarea id="editReportPendency" style="min-height:50px;"></textarea>
                    </div>
                    <div class="info-field" style="margin-bottom:12px; grid-column: 1 / -1;">
                        <label>Próximos Passos</label>
                        <textarea id="editReportNextSteps" style="min-height:50px;"></textarea>
                    </div>
                    <div class="info-field" style="margin-bottom:12px; grid-column: 1 / -1;">
                        <label>Feedback</label>
                        <textarea id="editReportFeedback" style="min-height:50px;"></textarea>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-danger" onclick="deleteReport()">Excluir</button>
                <button class="btn btn-secondary" onclick="closeModal('modalEditReport')">Cancelar</button>
                <button class="btn btn-success" onclick="saveReport()">Salvar</button>
            </div>
        </div>
    </div>

    <!-- Modal New Report -->
    <div class="modal-overlay" id="modalNewReport">
        <div class="modal">
            <div class="modal-header">
                <h3 class="modal-title">Gerar Relatório</h3>
                <button class="modal-close" onclick="closeModal('modalNewReport')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="report-advanced-grid">
                    <div class="info-field" style="margin-bottom:12px; grid-column: 1 / -1;">
                        <label>Descrição (obrigatório)</label>
                        <input type="text" id="newReportInput" placeholder="Resumo do encontro ou andamento..." onkeypress="handleReportKeyPress(event)">
                    </div>
                    <div class="info-field" style="margin-bottom:12px;">
                        <label>Status</label>
                        <select id="newReportStatus">
                            <option value="pendente">Pendente</option>
                            <option value="concluido">Concluído</option>
                        </select>
                    </div>
                    <div class="info-field" style="margin-bottom:12px;">
                        <label>Local</label>
                        <input type="text" id="newReportLocal" placeholder="Ex.: Sala 12, Google Meet... (opcional)">
                    </div>
                    <div class="info-field" style="margin-bottom:12px; grid-column: 1 / -1;">
                        <label>Pendências</label>
                        <input type="text" id="newReportPendency" placeholder="O que ficou pendente? (opcional)">
                    </div>
                    <div class="info-field" style="margin-bottom:12px; grid-column: 1 / -1;">
                        <label>Próximos passos</label>
                        <input type="text" id="newReportNextSteps" placeholder="Defina ações para a próxima etapa (opcional)">
                    </div>
                    <div class="info-field" style="margin-bottom:12px; grid-column: 1 / -1;">
                        <label>Feedback</label>
                        <input type="text" id="newReportFeedback" placeholder="Comentários gerais (opcional)">
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeModal('modalNewReport')">Cancelar</button>
                <button class="btn btn-success" onclick="addNewReport()">
                    <i class="fas fa-check"></i>
                    Salvar Relatório
                </button>
            </div>
        </div>
    </div>

    <!-- Modal Add Guest (Convidado) -->
    <div class="modal-overlay" id="modalAddGuest">
        <div class="modal">
            <div class="modal-header">
                <h3 class="modal-title">Adicionar Convidado / Membro da Banca</h3>
                <button class="modal-close" onclick="closeModal('modalAddGuest')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="info-field" style="margin-bottom:12px;">
                    <label>Buscar professores</label>
                    <input type="text" id="guestSearchInput" placeholder="Digite para buscar..." oninput="filterGuestList()">
                </div>
                <div class="select-list" id="guestsSelectList"></div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeModal('modalAddGuest')">Cancelar</button>
                <button class="btn btn-success" onclick="confirmAddGuests()">Adicionar Selecionados</button>
            </div>
        </div>
    </div>

</main>
</body>
</html>
<script src="../../assets/js/projetos/projeto.js?v=<?php echo date('YmdHis'); ?>"></script>
