<link rel="stylesheet" href="../../css/generic/generic.css?v=<?php echo date('YmdHis'); ?>">
<link rel="stylesheet" href="../../css/generic/sidebar.css?v=<?php echo date('YmdHis'); ?>">

<aside class="sidebar" id="sidebar">
    <div class="sidebar-logo">
        <img src="../../assets/img/icone-tcc.png" alt="Logo">
        <div class="sidebar-logo-text">
            <div class="flex-grow-1 text-center texto_login">
                <h2 class="mb-0 texto_login_1">Grad</h2>
                <h2 class="mb-0 texto_login_2">Mate</h2>
            </div>
            <span>Controle de tcc </span>
        </div>
    </div>

    <nav class="sidebar-nav">
        <div class="nav-section">
            <div class="nav-section-title">Gerenciamento</div>
            <ul class="nav-list">
                <li class="nav-item">
                    <a href="../dashboard/dashboard.php" class="nav-link">
                        <i class="fas fa-home"></i>
                        <span>Home</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="../projeto/projetos.php" class="nav-link">
                        <i class="fa-solid fa-list-check"></i>
                        <span>Projetos</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="../alunos/alunos.php" class="nav-link">
                        <i class="fa-solid fa-users"></i>
                        <span>Alunos</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="../professores/professores.php" class="nav-link">
                        <i class="fa-solid fa-graduation-cap"></i>
                        <span>Professores</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="../cursos/cursos.php" class="nav-link">
                        <i class="fa-solid fa-book-open"></i>
                        <span>Cursos</span>
                    </a>
                </li>
            </ul>
        </div>

        <div class="nav-section">
            <div class="nav-section-title">Relatórios</div>
            <ul class="nav-list">
                <li class="nav-item">
                    <a href="#" class="nav-link">
                        <i class="fa-solid fa-file"></i>
                        <span>Arquivos</span>
                    </a>
                </li>
            </ul>
        </div>
        <div class="nav-section">
            <div class="nav-section-title">Configuração</div>
            <ul class="nav-list">
                <li class="nav-item">
                    <a href="#" class="nav-link">
                        <i class="fa-solid fa-key"></i>
                        <span>Alterar senha</span>
                    </a>
                </li>
            </ul>
        </div>

        <div class="nav-section">
            <div class="nav-section-title">Administração</div>
            <ul class="nav-list">
                <li class="nav-item">
                    <a href="../administrativo/cadastro_usuario.php" class="nav-link">
                        <i class="fas fa-user-plus"></i>
                        <span>Cadastrar Usuário</span>
                    </a>
                </li>
            </ul>
        </div>

        <a href="../../index.php" class="nav-link">
            <i class="fa-solid fa-arrow-right-from-bracket"></i>
            <span>Sair</span>
        </a>

    </nav>
</aside>
