<!DOCTYPE html>
<html lang="pt-BR">
<?php include_once(__DIR__ . '/../../config/config.php'); ?>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GradMate</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="../../css/dashboard/dashboard.css<?php echo ver(); ?>">
</head>
<?php
include("../generics/header.php");
include("../generics/sidebar.php");
?>

<body>

<main class="main-content" id="mainContent">
    <div class="stats-grid">
        <div class="stat-card">
            <div class="stat-icon primary">
                <i class="fa-solid fa-list-check"></i>
            </div>
            <div class="stat-info">
                <h3 id="totalProjects">-</h3>
                <p>Projetos cadastrados</p>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon success">
                <i class="fa-solid fa-check"></i>
            </div>
            <div class="stat-info">
                <h3 id="completedProjects">-</h3>
                <p>Projetos concluídos</p>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon warning">
                <i class="fa-solid fa-hourglass-half"></i>
            </div>
            <div class="stat-info">
                <h3 id="ongoingProjects">-</h3>
                <p>Projetos em andamento</p>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon danger">
                <i class="fa-solid fa-lock"></i>
            </div>
            <div class="stat-info">
                <h3 id="lockedProjects">-</h3>
                <p>Projetos trancados</p>
            </div>
        </div>
    </div>

    <div class="container">
        <div class="legend">
            <div class="legend-item">
                <div class="legend-dot status-1"></div>
                <span>4º. termo - upload do projeto</span>
            </div>
            <div class="legend-item">
                <div class="legend-dot status-2"></div>
                <span>5º. termo - qualificação e apresentação dos pitch</span>
            </div>
            <div class="legend-item">
                <div class="legend-dot status-3"></div>
                <span>6º. termo - entrega dos dados do projeto de graduação</span>
            </div>
            <div class="legend-item">
                <div class="legend-dot status-4"></div>
                <span>6º. termo - Entrega da versão final pelo teams</span>
            </div>
            <div class="legend-item">
                <div class="legend-dot status-5"></div>
                <span>6º. termo - defesa do projeto de graduação</span>
            </div>
            <div class="legend-item">
                <div class="legend-dot status-6"></div>
                <span>6º. termo - entrega da versão corrigida do TCC</span>
            </div>
        </div>

        <div class="calendar-wrapper">
            <div class="calendar-header">
                <h2 class="calendar-title" id="monthYear"></h2>
                <div class="nav-buttons">
                    <button class="nav-btn" onclick="previousYear()">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="nav-btn" onclick="currentYear()">
                        <i class="fas fa-calendar-check"></i>
                    </button>
                    <button class="nav-btn" onclick="nextYear()">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                    <select id="semesterSelect" class="nav-btn" style="width:auto;padding:0 10px;cursor:pointer;background: #ffffff;color:#1e293b;border: 2px solid #e2e8f0;">
                        <option value="1">1º semestre</option>
                        <option value="2" selected>2º semestre</option>
                    </select>
                    <button class="nav-btn" title="Baixar calendário do semestre" onclick="downloadSemester()">
                        <i class="fa-solid fa-download"></i>
                    </button>
                </div>
            </div>

            <div class="year-calendar" id="yearCalendar"></div>


        </div>
    </div>

</main>
</body>
</html>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="../../assets/js/dashboard/dashboard.js<?php echo ver(); ?>"></script>
