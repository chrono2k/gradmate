<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GradMate</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="../../css/dashboard/dashboard.css?v=<?php echo date('YmdHis'); ?>">
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
    <!-- Stats Grid -->
    <div class="stats-grid">
        <div class="stat-card">
            <div class="stat-icon primary">
                <i class="fa-solid fa-list-check"></i>
            </div>
            <div class="stat-info">
                <h3>2</h3>
                <p>Projetos cadastrados</p>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon success">
                <i class="fa-solid fa-check"></i>
            </div>
            <div class="stat-info">
                <h3>34</h3>
                <p>Projetos concluidos</p>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon warning">
                <i class="fa-solid fa-hourglass-half"></i>
            </div>
            <div class="stat-info">
                <h3>343</h3>
                <p>Projetos em andamento</p>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon danger">
                <i class="fa-solid fa-exclamation"></i>
            </div>
            <div class="stat-info">
                <h3>5</h3>
                <p>Projetos em atraso</p>
            </div>
        </div>
    </div>

    <div class="content-card">
        <h2>coisas</h2>
        <p>coisas.</p>
    </div>

<!--    <div class="content-card">-->
<!--        <h2>Estatísticas em Tempo Real</h2>-->
<!--        <p>Monitore todos os seus dispositivos e sensores em tempo real. Os cards acima mostram as métricas principais do sistema, atualizadas automaticamente.</p>-->
<!--    </div>-->
</main>
</body>
</html>
<script src="../../assets/js/dashboard/dashboard.js?v=<?php echo date('YmdHis'); ?>"></script>
