<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GradMate</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="../../css/dashboard/dashboard.css?v=<?php echo date('YmdHis'); ?>">
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
        <div class="stat-card">
            <div class="stat-icon primary">
                <i class="fas fa-user"></i>
            </div>
            <div class="stat-info">
                <h3 id="totalAlunos">0</h3>
                <p>Total de Projetos</p>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon success">
                <i class="fas fa-check-circle"></i>
            </div>
            <div class="stat-info">
                <h3 id="alunosFormados">0</h3>
                <p>Projetos sem pendencia</p>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon danger">
                <i class="fa-solid fa-exclamation"></i>
            </div>
            <div class="stat-info">
                <h3 id="alunosComPendencia">5</h3>
                <p>Projetos com pendencias</p>
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
            <button class="btn btn-secondary btn-icon" onclick="loadProfessor()" title="Atualizar">
                <i class="fas fa-sync-alt"></i>
            </button>
        </div>
        <div class="table-wrapper">
            <table id="professoresTable">
                <thead>
                <tr>
                    <th>Nome</th>
                    <th>Cursos</th>
                    <th>Observação</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody id="projectTableBody">
                <!-- Dados serão inseridos aqui -->
                </tbody>
            </table>
        </div>
    </div>
    </div>

    <!-- Modal de Cadastro/Edição -->
    <div class="modal-overlay" id="modalOverlay">
        <div class="modal">
            <div class="modal-header">
                <h3>
                    <i class="fas fa-graduation-cap"></i>
                    <span id="modalTitle">Novo Curso</span>
                </h3>
                <button class="modal-close" onclick="closeModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <form id="courseForm">
                    <input type="hidden" id="courseId">

                    <div class="form-group">
                        <label for="courseName">
                            <i class="fas fa-book"></i>
                            Nome do Curso
                        </label>
                        <input
                                type="text"
                                id="courseName"
                                placeholder="Ex: Análise e Desenvolvimento de Sistemas"
                                required
                        >
                    </div>

                    <div class="form-group">
                        <label for="courseObservation">
                            <i class="fas fa-comment-alt"></i>
                            Observação
                        </label>
                        <textarea
                                id="courseObservation"
                                placeholder="Adicione detalhes, informações importantes ou observações sobre o curso..."
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
                    Salvar Curso
                </button>
            </div>
        </div>
    </div>
</main>
</body>
</html>
<script src="../../assets/js/dashboard/dashboard.js?v=<?php echo date('YmdHis'); ?>"></script>
