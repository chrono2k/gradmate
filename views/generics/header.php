<?php include_once(__DIR__ . '/../../config/config.php'); ?>
<link rel="stylesheet" href="../../assets/libs/Izitoast/iziToast-master/dist/css/iziToast.min.css">
<link rel="stylesheet" href="../../css/generic/generic.css<?php echo ver(); ?>">
<link rel="stylesheet" href="../../css/generic/header.css<?php echo ver(); ?>">
<link rel="stylesheet" href="../../assets/libs/jquery/VanillaToasts/vanillatoasts.css">


<header class="topbar" id="topbar">
    <div class="topbar-left">
        <button class="menu-toggle" id="menuToggle">
            <i class="fas fa-bars"></i>
        </button>
        <div class="topbar-search">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="Buscar...">
        </div>
    </div>
    <div class="topbar-right">
        <button class="topbar-icon">
            <i class="fas fa-bell"></i>
            <span class="badge">3</span>
        </button>
        <button class="topbar-icon">
            <i class="fas fa-envelope"></i>
            <span class="badge">5</span>
        </button>
        <div class="user-menu" id="userMenuToggle">
            <div class="user-avatar">...</div>
            <div class="user-info">
                <div class="user-name">Carregando...</div>
                <div class="user-role">...</div>
            </div>
            <i class="fas fa-chevron-down" style="color: var(--text-gray); font-size: 0.8rem;"></i>
        </div>
        <div class="user-dropdown" id="userDropdown">
            <a href="#" class="user-dropdown-item" id="changePasswordBtn">
                <i class="fas fa-key"></i>
                <span>Alterar Senha</span>
            </a>
            <a href="../../index.php" class="user-dropdown-item">
                <i class="fas fa-sign-out-alt"></i>
                <span>Sair</span>
            </a>
        </div>
    </div>
</header>

<!-- Modal de Alterar Senha -->
<div class="modal-overlay" id="changePasswordModal">
    <div class="modal-container">
        <div class="modal-header">
            <h3>Alterar Senha</h3>
            <button class="modal-close" id="closePasswordModal">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="modal-body">
            <form id="changePasswordForm">
                <div class="form-group">
                    <label for="currentPassword">Senha Atual</label>
                    <input type="password" id="currentPassword" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="newPassword">Nova Senha</label>
                    <input type="password" id="newPassword" class="form-control" required minlength="6">
                </div>
                <div class="form-group">
                    <label for="confirmPassword">Confirmar Nova Senha</label>
                    <input type="password" id="confirmPassword" class="form-control" required minlength="6">
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn btn-secondary" id="cancelPasswordChange">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Alterar Senha</button>
                </div>
            </form>
        </div>
    </div>
</div>


<script src="../../constantes.js<?php echo ver(); ?>"></script>
<script src="../../assets/js/generics/header.js<?php echo ver(); ?>"></script>
<script src="../../assets/libs/Izitoast/iziToast-master/dist/js/iziToast.min.js"></script>
<script src="../../assets/js/generics/funcoes_auxiliares.js<?php echo ver(); ?>"></script>
<script src="../../assets/libs/jquery/VanillaToasts/vanillatoasts.js"></script>
