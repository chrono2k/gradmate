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
                <div>
                    <select id="projectStatus" class="status-badge" onchange="updateProjectStatus()">
                        <option value="Pré-projeto">Pré-projeto</option>
                        <option value="Qualificação">Qualificação</option>
                        <option value="Defesa">Defesa</option>
                        <option value="Concluído">Concluído</option>
                        <option value="Trancado">Trancado</option>

                    </select>
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
                    </div>

                    <div class="chat-container">
                        <div class="chat-messages" id="chatMessages">
                            <div class="loading">
                                <div class="spinner"></div>
                                <p>Carregando relatórios...</p>
                            </div>
                        </div>

                        <div class="chat-input-container">
                            <input type="text" class="chat-input" id="newReportInput" placeholder="Digite um novo relatório..." onkeypress="handleReportKeyPress(event)">
                            <button class="btn btn-primary" onclick="addNewReport()">
                                <i class="fas fa-paper-plane"></i>
                                Enviar
                            </button>
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
                <div class="info-field">
                    <label>Descrição</label>
                    <textarea id="editReportDescription"></textarea>
                </div>
                <div class="info-field">
                    <label>Pendências</label>
                    <textarea id="editReportPendency"></textarea>
                </div>
                <div class="info-field">
                    <label>Próximos Passos</label>
                    <textarea id="editReportNextSteps"></textarea>
                </div>
                <div class="info-field">
                    <label>Local</label>
                    <input type="text" id="editReportLocal">
                </div>
                <div class="info-field">
                    <label>Feedback</label>
                    <textarea id="editReportFeedback"></textarea>
                </div>
                <div class="info-field">
                    <label>Status</label>
                    <select id="editReportStatus">
                        <option value="pendente">Pendente</option>
                        <option value="concluido">Concluído</option>
                        <option value="cancelado">Cancelado</option>
                    </select>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-danger" onclick="deleteReport()">Excluir</button>
                <button class="btn btn-secondary" onclick="closeModal('modalEditReport')">Cancelar</button>
                <button class="btn btn-success" onclick="saveReport()">Salvar</button>
            </div>
        </div>
    </div>

</main>
</body>
</html>
<script src="../../assets/js/projetos/projeto.js?v=<?php echo date('YmdHis'); ?>"></script>
