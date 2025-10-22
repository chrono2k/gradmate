<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GradMate</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <?php include_once(__DIR__ . '/../../config/config.php'); ?>
    <link rel="stylesheet" href="../../css/profess.css<?php echo ver(); ?>">
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
            <i class="fa-solid fa-graduation-cap"></i>
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
            <button class="btn btn-secondary btn-icon" onclick="loadTeacher()" title="Atualizar">
                <i class="fas fa-sync-alt"></i>
            </button>
        </div>
        <div class="table-wrapper">
            <table id="professoresTable">
                <thead>
                <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Observação</th>
                    <th>Projetos ativos</th>
                    <th>Status</th>
                    <th>Ações</th>
                </tr>
                </thead>
                <tbody id="teachersTableBody">
                <!-- Dados serão inseridos aqui -->
                </tbody>
            </table>
            <div class="pagination" id="pagination"></div>
        </div>
    </div>
    </div>

    <!-- Modais de confirmação e exibição de senha -->
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
                    <div style="color:#475569;font-weight:600;">Usuário:</div>
                    <code id="displayUsername" style="font-weight:700;color:#0f172a;background:#f1f5f9;padding:2px 6px;border-radius:6px;">-</code>
                </div>
                <div style="display:flex;gap:8px;align-items:center;">
                    <div style="color:#475569;font-weight:600;">Senha Temporária:</div>
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

    <!-- Modal de Cadastro/Edição -->
    <div class="modal-overlay" id="modalOverlay">
        <div class="modal">
            <div class="modal-header">
                <h3>
                    <i class="fas fa-graduation-cap"></i>
                    <span id="modalTitle">Novo Professor</span>
                </h3>
                <button class="modal-close" onclick="closeModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <form id="teacherForm">
                    <input type="hidden" id="teacherId">

                    <div class="form-group">
                        <label for="teacherName">
                            <i class="fas fa-book"></i>
                            Nome
                        </label>
                        <input
                                type="text"
                                id="teacherName"
                                placeholder="Informe o nome do professor a ser cadastrado"
                                required
                        >
                    </div>
                    <div class="form-group">
                        <label for="teacherEmail">
                            <i class="fas fa-book"></i>
                            Email
                        </label>
                        <input
                                type="text"
                                id="teacherEmail"
                                placeholder="Email que será utilizado para logar no sistema"
                                required
                        >
                    </div>

                    <div class="form-group">
                        <label for="teacherObservation">
                            <i class="fas fa-comment-alt"></i>
                            Observação
                        </label>
                        <textarea
                                id="teacherObservation"
                                placeholder="Adicione detalhes, informações importantes ou observações sobre o professor..."
                        ></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-cancel" onclick="closeModal()">
                    <i class="fas fa-times"></i>
                    Cancelar
                </button>
                <button class="btn btn-success" onclick="saveTeacher()">
                    <i class="fas fa-save"></i>
                    Salvar Professor
                </button>
            </div>
        </div>
    </div>
</main>
</body>
</html>
<script src="../../assets/js/professores/professores.js<?php echo ver(); ?>"></script>
