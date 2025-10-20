<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GradMate</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <?php include_once(__DIR__ . '/../../config/config.php'); ?>
    <link rel="stylesheet" href="../../css/projetos/projetos.css<?php echo ver(); ?>">
    <style>
    </style>
</head>
<?php
include("../generics/header.php");
include("../generics/sidebar.php");
?>

<body>

<main class="main-content" id="mainContent">
    <div class="page-header">
        <h1>
            <i class="fa-solid fa-list-check"></i>
            Gerenciamento de Projetos
        </h1>
    </div>
    <div class="stats-grid">
        <div class="stat-card clickable" onclick="filterByStatus('Pré-projeto')" data-status="Pré-projeto">
            <div class="stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                <i class="fas fa-seedling"></i>
            </div>
            <div class="stat-info">
                <h3 id="countPreProjeto">0</h3>
                <p>Pré-projeto</p>
            </div>
        </div>
        <div class="stat-card clickable" onclick="filterByStatus('Qualificação')" data-status="Qualificação">
            <div class="stat-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                <i class="fas fa-clipboard-check"></i>
            </div>
            <div class="stat-info">
                <h3 id="countQualificacao">0</h3>
                <p>Qualificação</p>
            </div>
        </div>
        <div class="stat-card clickable" onclick="filterByStatus('Defesa')" data-status="Defesa">
            <div class="stat-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
                <i class="fas fa-shield-alt"></i>
            </div>
            <div class="stat-info">
                <h3 id="countDefesa">0</h3>
                <p>Defesa</p>
            </div>
        </div>
        <div class="stat-card clickable" onclick="filterByStatus('Concluído')" data-status="Concluído">
            <div class="stat-icon" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">
                <i class="fas fa-check-circle"></i>
            </div>
            <div class="stat-info">
                <h3 id="countConcluido">0</h3>
                <p>Concluído</p>
            </div>
        </div>
        <div class="stat-card clickable" onclick="filterByStatus('Trancado')" data-status="Trancado">
            <div class="stat-icon" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);">
                <i class="fas fa-lock"></i>
            </div>
            <div class="stat-info">
                <h3 id="countTrancado">0</h3>
                <p>Trancado</p>
            </div>
        </div>
    </div>

    <!-- Action Bar -->
    <div class="action-bar">
        <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" id="searchInput" placeholder="Buscar Projetos...">
        </div>
        <button class="btn btn-primary" onclick="openModal()">
            <i class="fas fa-plus"></i>
            Novo Projeto
        </button>
    </div>

    <!-- Table -->
    <div class="table-container">
        <div class="table-header">
            <h2>
                <i class="fas fa-list"></i>
                Lista de Projetos
            </h2>
            <button class="btn btn-secondary btn-icon" onclick="loadProject()" title="Atualizar">
                <i class="fas fa-sync-alt"></i>
            </button>
        </div>
        <div class="table-wrapper">
            <table id="projectTable">
                <thead>
                <tr>
                    <th>Nome</th>
                    <th>Cursos</th>
<!--                    <th>Descrição</th>-->
                    <th>Observação</th>
                    <th>Editar</th>
                </tr>
                </thead>
                <tbody id="projectTableBody">
                <!-- Dados serão inseridos aqui -->
                </tbody>
            </table>
            <div class="pagination" id="pagination"></div>

        </div>
    </div>
    </div>

    <!-- Modal de Cadastro/Edição -->
    <div class="modal-overlay" id="modalOverlay">
        <div class="modal">
            <div class="modal-header">
                <h3>
                    <i class="fas fa-graduation-cap"></i>
                    <span id="modalTitle">Novo Projeto</span>
                </h3>
                <button class="modal-close" onclick="closeModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <form id="courseForm">
                    <input type="hidden" id="projectId">

                    <div class="form-group">
                        <label for="projectName">
                            <i class="fas fa-book"></i>
                            Nome do projeto
                        </label>
                        <input
                                type="text"
                                id="projectName"
                                placeholder="Ex: Sistema de Gestão Acadêmica Integrado"
                                required
                        >
                    </div>

                    <div class="form-group">
                        <label for="projectCourse">
                            <i class="fas fa-graduation-cap"></i>
                            Curso
                        </label>
                        <select id="projectCourse" required>
                            <option value="">Carregando cursos...</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="courseObservation">
                            <i class="fas fa-comment-alt"></i>
                            Observação
                        </label>
                        <textarea
                                id="courseObservation"
                                placeholder="Adicione detalhes, informações importantes ou observações sobre o projeto..."
                        ></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-cancel" onclick="closeModal()">
                    <i class="fas fa-times"></i>
                    Cancelar
                </button>
                <button class="btn btn-success" onclick="saveCourse()">
                    <i class="fas fa-save"></i>
                    Salvar Projeto
                </button>
            </div>
        </div>
    </div>
</main>
</body>
</html>
<script src="../../assets/js/projetos/projetos.js<?php echo ver(); ?>"></script>
