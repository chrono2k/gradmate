<!DOCTYPE html>
<html lang="pt-BR">
<?php include_once(__DIR__ . '/../../config/config.php'); ?>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GradMate</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="../../css/alunos/alunos.css<?php echo ver(); ?>">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
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

    <div class="action-bar">
        <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" id="searchInput" placeholder="Buscar alunos...">
        </div>
        <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
            <div style="display: flex; gap: 8px; align-items: center;">
                <i class="fas fa-calendar-alt" style="color: #475569;"></i>
                <input type="text" id="startDate" title="Data inicial (últimos 4 anos)" onchange="applyDateFilter()" style="padding: 8px 12px; border-radius: 8px; border: 2px solid #cbd5e1; background: #ffffff; color: #1e293b; cursor: pointer; font-weight: 500; font-size: 0.9rem; width: 150px;">
                <span style="color: #475569; font-weight: 500;">até</span>
                <input type="text" id="endDate" title="Data final" onchange="applyDateFilter()" style="padding: 8px 12px; border-radius: 8px; border: 2px solid #cbd5e1; background: #ffffff; color: #1e293b; cursor: pointer; font-weight: 500; font-size: 0.9rem; width: 150px;">
            </div>
            <button class="btn btn-primary" onclick="openModal()">
                <i class="fas fa-plus"></i>
                Novo Aluno
            </button>
        </div>
    </div>

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
                </tbody>
            </table>
            <div class="pagination" id="pagination"></div>

        </div>
    </div>
    </div>

    <div class="modal-overlay" id="modalConfirm">
        <div class="modal">
            <div class="modal-header">
                <h3 id="confirmTitle">Confirmar Ação</h3>
                <button class="modal-close" onclick="closeConfirmModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <p id="confirmMessage">Deseja realmente continuar?</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-cancel" onclick="closeConfirmModal()">Cancelar</button>
                <button class="btn btn-primary" id="confirmActionBtn" onclick="executeConfirmAction()">
                    <i class="fas fa-check"></i> Confirmar
                </button>
            </div>
        </div>
    </div>

    <div class="modal-overlay" id="modalPasswordDisplay">
        <div class="modal">
            <div class="modal-header">
                <h3><i class="fas fa-key"></i> Senha Gerada</h3>
                <button class="modal-close" onclick="closePasswordModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="alert" style="background:#fff7ed;border:1px solid #fed7aa;padding:12px;border-radius:8px;color:#9a3412;margin-bottom:12px;">
                    <i class="fas fa-exclamation-triangle"></i>
                    <strong> Atenção:</strong> Anote esta senha, ela não será exibida novamente.
                </div>
                <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px;">
                    <div style="color:#FFFFFF;font-weight:600;">Usuário:</div>
                    <code id="displayUsername" style="font-weight:700;color:#0f172a;background:#f1f5f9;padding:2px 6px;border-radius:6px;">-</code>
                </div>
                <div style="display:flex;gap:8px;align-items:center;">
                    <div style="color:#FFFFFF;font-weight:600;">Senha Temporária:</div>
                    <code id="displayPassword" style="font-weight:800;color:#0f172a;font-size:1.2rem;background:#eef2ff;padding:2px 6px;border-radius:6px;">-</code>
                </div>
                <button class="btn btn-secondary" onclick="copyPasswordToClipboard()" style="margin-top:12px;">
                    <i class="fas fa-copy"></i> Copiar Senha
                </button>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" onclick="closePasswordModal()">
                    <i class="fas fa-check"></i> Entendi
                </button>
            </div>
        </div>
    </div>

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
                        <label for="studentPhone">
                            <i class="fas fa-phone"></i>
                            Telefone (celular)
                        </label>
                        <input
                                type="text"
                                id="studentPhone"
                                placeholder="Telefone do aluno (opcional)"
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
<script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
<script src="https://cdn.jsdelivr.net/npm/flatpickr/dist/l10n/pt.js"></script>
<script src="../../assets/js/alunos/alunos.js<?php echo ver(); ?>"></script>
