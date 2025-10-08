<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GradMate</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="../../css/profess.css?v=<?php echo date('YmdHis'); ?>">
    <style>
    </style>
</head>
<?php
include("../generics/header.php");
include("../generics/sidebar.php");
?>

<body>

<div id="loading">
    <div class="spinner"></div>
    <p>Aguarde...</p>
</div>


<main class="main-content" id="mainContent">

    <div class="page-header">
        <h1>
            <i class="fa-graduation-cap"></i>
            Gerenciamento de Professores
        </h1>
    </div>

    <!-- Action Bar -->
    <div class="action-bar">
        <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" id="searchInput" placeholder="Buscar professores...">
        </div>
        <button class="btn btn-primary" onclick="openModal()">
            <i class="fas fa-plus"></i>
            Novo Professor
        </button>
    </div>

    <!-- Table -->
    <div class="table-container">
        <div class="table-header">
            <h2>
                <i class="fas fa-list"></i>
                Lista de Professores
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
                </tr>
                </thead>
                <tbody id="professoresTableBody">
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
                <button class="btn btn-secondary" onclick="closeModal()">
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
