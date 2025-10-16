<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GradMate</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <?php include_once(__DIR__ . '/../../config/config.php'); ?>
    <link rel="stylesheet" href="../../css/alunos/alunos.css<?php echo ver(); ?>">
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
            <i class="fa-solid fa-users"></i>
            Gerenciamento de Alunos
        </h1>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
        <div class="stat-card">
            <div class="stat-icon primary">
                <i class="fas fa-user"></i>
            </div>
            <div class="stat-info">
                <h3 id="totalAlunos">0</h3>
                <p>Total de Alunos</p>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon success">
                <i class="fas fa-check-circle"></i>
            </div>
            <div class="stat-info">
                <h3 id="alunosFormados">0</h3>
                <p>Alunos formados</p>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon warning">
                <i class="fas fa-clock"></i>
            </div>
            <div class="stat-info">
                <h3 id="alunosComPendencia">5</h3>
                <p>Alunos com pendencias</p>
            </div>
        </div>
    </div>

    <!-- Action Bar -->
    <div class="action-bar">
        <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" id="searchInput" placeholder="Buscar alunos...">
        </div>
        <button class="btn btn-primary" onclick="openModal()">
            <i class="fas fa-plus"></i>
            Novo Aluno
        </button>
    </div>

    <!-- Table -->
    <div class="table-container">
        <div class="table-header">
            <h2>
                <i class="fas fa-list"></i>
                Lista de Alunos
            </h2>
            <button class="btn btn-secondary btn-icon" onclick="loadStudent()" title="Atualizar">
                <i class="fas fa-sync-alt"></i>
            </button>
        </div>
        <div class="table-wrapper">
            <table id="studentsTable">
                <thead>
                <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>R.A.</th>
                    <th>Observação</th>
                    <th>Projetos ativos</th>
                    <th>Status</th>
                    <th>Ações</th>

                </tr>
                </thead>
                <tbody id="studentsTableBody">
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
                    <span id="modalTitle">Novo Aluno</span>
                </h3>
                <button class="modal-close" onclick="closeModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <form id="studentForm">
                    <input type="hidden" id="studentId">

                    <div class="form-group">
                        <label for="studentName">
                            <i class="fas fa-book"></i>
                            Nome do Aluno
                        </label>
                        <input
                                type="text"
                                id="studentName"
                                placeholder="Informe o nome do aluno a ser cadastrado"
                                required
                        >
                    </div>
                    <div class="form-group">
                        <label for="studentEmail">
                            <i class="fas fa-book"></i>
                            Email
                        </label>
                        <input
                                type="text"
                                id="studentEmail"
                                placeholder="Email que será utilizado para logar no sistema"
                                required
                        >
                    </div>
                    <div class="form-group">
                        <label for="studentRegistration">
                            <i class="fas fa-book"></i>
                            RA
                        </label>
                        <input
                                type="text"
                                id="studentRegistration"
                                placeholder="RA do aluno"
                                required
                        >
                    </div>

                    <div class="form-group">
                        <label for="studentObservation">
                            <i class="fas fa-comment-alt"></i>
                            Observação
                        </label>
                        <textarea
                                id="studentObservation"
                                placeholder="Adicione detalhes, informações importantes ou observações sobre o aluno..."
                        ></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-cancel" onclick="closeModal()">
                    <i class="fas fa-times"></i>
                    Cancelar
                </button>
                <button class="btn btn-success" onclick="saveStudent()">
                    <i class="fas fa-save"></i>
                    Salvar Aluno
                </button>
            </div>
        </div>
    </div>
</main>
</body>
</html>
<script src="../../assets/js/alunos/alunos.js<?php echo ver(); ?>"></script>
