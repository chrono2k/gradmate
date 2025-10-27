<!DOCTYPE html>
<html lang="pt-BR">
<?php include_once(__DIR__ . '/../../config/config.php'); ?>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Administradores - GradMate</title>

    <link rel="stylesheet" href="../../assets/libs/fontawesome-free-6.5.1-web/css/all.min.css">
    <link rel="stylesheet" href="../../css/generic/generic.css?v=<?php echo ver(); ?>">
    <link rel="stylesheet" href="../../css/generic/header.css?v=<?php echo ver(); ?>">
    <link rel="stylesheet" href="../../css/generic/sidebar.css?v=<?php echo ver(); ?>">
    <link rel="stylesheet" href="../../css/administrativo/cadastro_usuario.css?v=<?php echo ver(); ?>">
    <link rel="stylesheet" href="../../css/administrativo/admins.css?v=<?php echo ver(); ?>">
</head>
<?php
include("../generics/header.php");
include("../generics/sidebar.php");
?>

<body>
<main class="main-content" id="mainContent">
    <div class="page-container">
        <div class="page-header">
            <div class="page-title">
                <i class="fas fa-user-shield"></i>
                <h1>Administradores</h1>
            </div>
            <button class="btn-add" onclick="openCreateAdminModal()">
                <i class="fas fa-plus"></i>
                Novo Administrador
            </button>
        </div>

        <div class="admins-table-wrapper">
            <table class="admins-table" id="adminsTable">
                <thead>
                    <tr>
                        <th style="width: 60px;">ID</th>
                        <th>Usuário</th>
                        <th>Email</th>
                        <th style="width: 140px;">Autoridade</th>
                        <th style="width: 120px;">Status</th>
                        <th style="width: 260px;">Ações</th>
                    </tr>
                </thead>
                <tbody id="adminsTbody">
                </tbody>
            </table>
        </div>
    </div>

    <div class="modal-overlay" id="modalCreateAdmin">
        <div class="modal-container">
            <div class="modal-header">
                <h2>
                    <i class="fas fa-user-plus"></i>
                    Criar Novo Administrador
                </h2>
                <button class="btn-close" onclick="closeCreateAdminModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="info-field">
                    <label for="createUsername">
                        <i class="fas fa-user"></i>
                        Nome de Usuário
                    </label>
                    <input 
                        type="text" 
                        id="createUsername" 
                        placeholder="Digite o nome de usuário"
                        autocomplete="off"
                    />
                </div>

                <div class="info-field">
                    <label for="createEmail">
                        <i class="fas fa-envelope"></i>
                        Email
                    </label>
                    <input 
                        type="email" 
                        id="createEmail" 
                        placeholder="Digite o email (opcional)"
                        autocomplete="off"
                    />
                </div>

                <div class="alert-info">
                    <i class="fas fa-info-circle"></i>
                    Uma senha temporária será gerada automaticamente e exibida após a criação.
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="closeCreateAdminModal()">
                    Cancelar
                </button>
                <button class="btn-primary" onclick="confirmCreateAdmin()">
                    <i class="fas fa-check"></i>
                    Criar Administrador
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

    <div class="modal-overlay" id="modalConfirm">
        <div class="modal-container modal-confirm">
            <div class="modal-header">
                <h2 id="confirmTitle">Confirmar Ação</h2>
            </div>
            <div class="modal-body">
                <p id="confirmMessage">Deseja realmente continuar?</p>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="closeConfirmModal()">
                    Cancelar
                </button>
                <button class="btn-danger" id="confirmActionBtn" onclick="executeConfirmAction()">
                    Confirmar
                </button>
            </div>
        </div>
    </div>
</main>

</body>
</html>

<script src="../../assets/js/generics/funcoes_auxiliares.js?v=<?php echo ver(); ?>"></script>
<script src="../../assets/js/administrativo/admins.js?v=<?php echo ver(); ?>"></script>
