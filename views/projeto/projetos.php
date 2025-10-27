<!DOCTYPE html>
<html lang="pt-BR">
<?php include_once(__DIR__ . '/../../config/config.php'); ?>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GradMate</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/plugins/monthSelect/style.css">
    <link rel="stylesheet" href="../../css/projetos/projetos.css<?php echo ver(); ?>">
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
        <div class="stat-card clickable" onclick="filterByStatus('Pré-projeto')" data-status="Pré-projeto">
            <div class="stat-icon pre-project-icon">
                <i class="fas fa-seedling"></i>
            </div>
            <div class="stat-info">
                <h3 id="countPreProjeto">0</h3>
                <p>Pré-projeto</p>
            </div>
        </div>
        <div class="stat-card clickable" onclick="filterByStatus('Qualificação')" data-status="Qualificação">
            <div class="stat-icon qualification-project-icon">
                <i class="fas fa-clipboard-check"></i>
            </div>
            <div class="stat-info">
                <h3 id="countQualificacao">0</h3>
                <p>Qualificação</p>
            </div>
        </div>
        <div class="stat-card clickable" onclick="filterByStatus('Defesa')" data-status="Defesa">
            <div class="stat-icon defense-project-icon">
                <i class="fas fa-shield-alt"></i>
            </div>
            <div class="stat-info">
                <h3 id="countDefesa">0</h3>
                <p>Defesa</p>
            </div>
        </div>
        <div class="stat-card clickable" onclick="filterByStatus('Concluído')" data-status="Concluído">
            <div class="stat-icon finished-project-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <div class="stat-info">
                <h3 id="countConcluido">0</h3>
                <p>Concluído</p>
            </div>
        </div>
        <div class="stat-card clickable" onclick="filterByStatus('Trancado')" data-status="Trancado">
            <div class="stat-icon lock-project-icon">
                <i class="fas fa-lock"></i>
            </div>
            <div class="stat-info">
                <h3 id="countTrancado">0</h3>
                <p>Trancado</p>
            </div>
        </div>
    </div>

    <div class="action-bar">
        <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" id="searchInput" placeholder="Buscar Projetos...">
        </div>
        <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
            <div style="display: flex; gap: 8px; align-items: center;">
                <i class="fas fa-calendar-alt" style="color: #475569;"></i>
                <input type="text" id="startDate" title="Data inicial" onchange="applyDateFilter()" style="padding: 8px 12px; border-radius: 8px; border: 2px solid #cbd5e1; background: #ffffff; color: #1e293b; cursor: pointer; font-weight: 500; font-size: 0.9rem; width: 150px;">
                <span style="color: #475569; font-weight: 500;">até</span>
                <input type="text" id="endDate" title="Data final" onchange="applyDateFilter()" style="padding: 8px 12px; border-radius: 8px; border: 2px solid #cbd5e1; background: #ffffff; color: #1e293b; cursor: pointer; font-weight: 500; font-size: 0.9rem; width: 150px;">
            </div>
            <button class="btn btn-secondary" onclick="toggleAdvancedFilters()">
                <i class="fas fa-filter"></i>
                Filtros
            </button>
            <button class="btn btn-primary" onclick="openModal()">
                <i class="fas fa-plus"></i>
                Novo Projeto
            </button>
        </div>
        <div id="advancedFilters" style="display:none; margin-top:8px; padding:10px; border:1px solid #e2e8f0; border-radius:10px; background:#ffffff;">
            <div style="display:flex; gap:12px; flex-wrap:wrap; align-items:center;">
                <div class="search-box" style="min-width:220px;">
                    <i class="fas fa-user-tie"></i>
                    <input type="text" id="filterTeacher" placeholder="Filtrar por orientador">
                </div>
                <div class="search-box" style="min-width:220px;">
                    <i class="fas fa-user-graduate"></i>
                    <input type="text" id="filterStudent" placeholder="Filtrar por aluno">
                </div>
                <div style="display:flex; gap:8px; align-items:center;">
                    <i class="fas fa-building" style="color:#475569;"></i>
                    <select id="filterCourse" style="padding: 8px 12px; border-radius: 8px; border: 2px solid #cbd5e1; background: #ffffff; color: #1e293b; cursor: pointer; font-weight: 500; font-size: 0.9rem; min-width:220px;">
                        <option value="">Todos os cursos</option>
                    </select>
                </div>
                <button class="btn btn-secondary" onclick="clearAdvancedFilters()"><i class="fas fa-eraser"></i> Limpar</button>
            </div>
        </div>
    </div>

    <!-- Table -->
    <div class="table-container">
        <div class="table-header">
            <h2>
                <i class="fas fa-list"></i>
                Lista de Projetos
            </h2>
            <div style="display:flex; gap:8px; align-items:center;">
<!--                <button class="btn btn-secondary btn-icon" onclick="openZipMonthModal()" title="Baixar relatórios">-->
<!--                    <i class="fas fa-download"></i>-->
<!--                </button>-->
                <button class="btn btn-secondary btn-icon" onclick="loadProjetos()" title="Atualizar">
                    <i class="fas fa-sync-alt"></i>
                </button>
            </div>
        </div>
        <div class="table-wrapper">
            <table id="projectTable">
                <thead>
                <tr>
                    <th>Nome</th>
                    <th>Cursos</th>
                    <th>Observação</th>
                    <th>Editar</th>
                </tr>
                </thead>
                <tbody id="projectTableBody">
                </tbody>
            </table>
            <div class="pagination" id="pagination"></div>

        </div>
    </div>
    </div>

    <div class="modal-overlay" id="modalOverlay">
        <div class="modal">
            <div class="modal-header">
                <h3>
                    <i class="fas fa-graduation-cap"></i>
                    <span id="modalTitle">Novo Projeto</span>
                </h3>
                <button class="modal-close" onclick="closeModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <form id="courseForm">
                    <input type="hidden" id="projectId">

                    <div class="form-group">
                        <label for="projectName">
                            <i class="fas fa-book"></i>
                            Nome do projeto
                        </label>
                        <input
                                type="text"
                                id="projectName"
                                placeholder="Ex: Sistema de Gestão Acadêmica Integrado"
                                required
                        >
                    </div>

                    <div class="form-group">
                        <label for="projectCourse">
                            <i class="fas fa-graduation-cap"></i>
                            Curso
                        </label>
                        <select id="projectCourse" required>
                            <option value="">Carregando cursos...</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="courseObservation">
                            <i class="fas fa-comment-alt"></i>
                            Observação
                        </label>
                        <textarea
                                id="courseObservation"
                                placeholder="Adicione detalhes, informações importantes ou observações sobre o projeto..."
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
                    Salvar Projeto
                </button>
            </div>
        </div>
    </div>
</main>


</body>
</html>

<script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
<script src="https://cdn.jsdelivr.net/npm/flatpickr/dist/l10n/pt.js"></script>
<script src="https://cdn.jsdelivr.net/npm/flatpickr/dist/plugins/monthSelect/index.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
<script src="../../assets/js/projetos/projetos.js<?php echo ver(); ?>"></script>
