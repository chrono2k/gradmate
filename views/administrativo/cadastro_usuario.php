<link rel="stylesheet" href="../../assets/libs/bootstrap/icons-main/font/bootstrap-icons.css">
<link rel="stylesheet" href="../../assets/libs/fontawesome-free-6.5.1-web/css/all.min.css">
<link rel="stylesheet" href="../../assets/libs/bootstrap/bootstrap-5.3.3-dist/css/bootstrap.min.css">
<link rel="stylesheet" href="../../assets/libs/bootstrap/bootstrap-table-master/dist/bootstrap-table.min.css">
<link rel="stylesheet" href="../../assets/libs/bootstrap/bootstrap-table-master/dist/extensions/filter-control/bootstrap-table-filter-control.min.css">
<link rel="stylesheet" href="../../assets/libs/Jquery/select2-4.1.0-rc.0/dist/css/select2.min.css">
<link rel="stylesheet" href="../../assets/libs/Izitoast/iziToast-master/dist/css/iziToast.min.css">
<link rel="stylesheet" href="../../css/generic/header.css?v=<?php echo date('YmdHis'); ?>">
<link rel="stylesheet" href="../../css/administrativo/cadastro_usuario.css?v=<?php echo date('YmdHis'); ?>">

<?php
include("../generics/header.php");
include("../generics/sidebar.php");
?>


<body>

<main class="main-content" id="mainContent">
    <div id="conteudo_pagina">
        <div class="row justify-content-center">
            <div class=" col-xxl-10 col-xl-10 col-lg-11 col-md-12 col-sm-12">
                <div class="container">
                    <div class="card">
                        <div class="card-header bg-transparent" id="">
                            <h2 class="text-center">Usuários do sistema</h2>
                            <div class="card-header bg-transparent" id="">
                                <div class="align-self-end d-flex gap-3 justify-content-end" id="botoes">
                                    <button id="novo_usuario" class="btn btn-c btn-outline-primary mb-3 animate-right-3" type="button" data-bs-toggle="modal"
                                            data-bs-target="#adicionar_usuario"><i class="fas fa-user-plus"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="card shadow-inset bg-primary border-light p-4 rounded"
                             style="background: radial-gradient(circle, rgb(255 255 255 / 41%) 20%, rgb(0 35 103 / 8%) 54%, rgb(153 18 18 / 7%) 100%);">
                            <div class="container position-relative">
                                <table id="tabela_usuarios"
                                       data-buttons-class="secondary"
                                       data-show-fullscreen="true"
                                       data-pagination="true"
                                       data-sortable="true"
                                       class="table-responsive table-striped tabela_usuarios"
                                       data-show-columns="true">
                                    <thead>
                                    <tr class="">
                                        <th data-sortable="true" data-field="id" class="col-1 text-center"
                                            data-filter-control="input"> ID
                                        </th>
                                        <th data-sortable="true" data-field="username" class="col-3"
                                            data-filter-control="input"> Usuário
                                        </th>
                                        <th data-sortable="true" data-field="authority" data-formatter="autoridade_format"
                                            class="col-3 text-center" data-filter-control="input"> Autoridade
                                        </th>
                                        <th data-sortable="true" data-field="deletear" data-formatter="usuario_delete"
                                            class="col-1 text-center" data-filter-control="input"> Desativar
                                        </th>
                                        <th data-sortable="true" data-field="resetar" data-formatter="reseta_senha"
                                            class="col-1 text-center" data-filter-control="input"> Resetar senha
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal fade" id="adicionar_usuario" tabindex="-1" aria-labelledby="edit-modal-label"
                     aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">Criar novo usuário</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <form class=" g-3 needs-validation" novalidate id="form_novo_usuario">
                                    <fieldset>
                                        <div class="form-floating mb-3">
                                            <input type="text" class="form-control" placeholder="name"  name="user" id="recipient-name">
                                            <label for="recipient-name" class="labels_form"> <i class="far fa-envelope"></i> Login</label>
                                        </div>
                                        <div class="form-floating mb-3">
                                            <select class="form-select" id="select_autoridade" name="authority"
                                                    aria-label="selecao de autoridade">
                                                <option value="USER" selected>Usuário</option>
                                                <option value="ADMIN">Administrador</option>
                                            </select>
                                            <label for="select_autoridade">Autoridade do usuário</label>
                                        </div>
                                    </fieldset>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-c btn-outline-primary mb-1 botao_interacao animate-right-3"
                                        style="float:left; margin-bottom: 100px" id="botao_criar_usuario">Criar o usuário
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal fade" id="escolher_autoridade" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">Alterar nivel de autoridade</h5>
                                <h5 id="id_order_modal_autoridade" style="display: none;"></h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <form id="formulario_autoridade" class="needs-validation" novalidate>
                                    <div class="form-floating mb-3">
                                        <select class="form-select" id="select_autoridade" name="authority"
                                                aria-label="selecao de autoridade">
                                            <option value="USER" selected>Usuário</option>
                                            <option value="ADMIN">Administrador</option>
                                        </select>
                                        <label for="select_autoridade">Autoridade do usuário</label>

                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button class="btn btn-c btn-outline-primary mb-1 botao_interacao animate-right-3" type="button" id="alterar_autoridade">
                                    Escolher
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal fade" id="mostra_senha_nova" data-bs-backdrop="static" data-bs-keyboard="false"
                     tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div class="modal-dialog  modal-dialog-centered">
                        <div class="modal-content modal-senha">
                            <div class="modal-header">
                                <h5 class="modal-title modal-title-senha" id="exampleModalLabel">Anote a senha gerada:</h5>
                                <h5 id="id_order_modal_autoridade" style="display: none;"></h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <h5 class="white mb-4" id="mostra_senha_gerada" >-</h5>
                            </div>
                            <div class="modal-footer">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</main>
</body>
</html>



<script src="../../assets/libs/Jquery/jquery-3.7.1.min.js"></script>
<script src="../../assets/libs/bootstrap/bootstrap-5.3.3-dist/js/bootstrap.bundle.js"></script>
<script src="../../assets/libs/Jquery/select2-4.1.0-rc.0/dist/js/select2.min.js"></script>
<script src="../../assets/libs/bootstrap/tableExport.jquery.plugin-master/tableExport.min.js"></script>
<script src="../../assets/libs/bootstrap/bootstrap-table-master/dist/bootstrap-table.min.js"></script>
<script src="../../assets/libs/bootstrap/bootstrap-table-master/dist/extensions/export/bootstrap-table-export.min.js"></script>
<script src="../../assets/libs/bootstrap/bootstrap-table-master/dist/locale/bootstrap-table-pt-BR.min.js"></script>
<script src="../../assets/libs/bootstrap/bootstrap-table-master/dist/extensions/filter-control/bootstrap-table-filter-control.min.js"></script>
<script src="../../assets/libs/Izitoast/iziToast-master/dist/js/iziToast.min.js"></script>
<script src="../../assets/js/generics/menu.js?v=<?php echo date('YmdHis'); ?>"></script>
<script src="../../assets/js/generics/requisicoes.js?v=<?php echo date('YmdHis'); ?>"></script>
<script src="../../assets/js/usuarios/requisita_usuarios.js?v=<?php echo date('YmdHis'); ?>"></script>
<script src="../../assets/js/usuarios/criar_usuario.js?v=<?php echo date('YmdHis'); ?>"></script>
<script src="../../assets/js/usuarios/edita_usuario.js?v=<?php echo date('YmdHis'); ?>"></script>
<script src="../../assets/js/usuarios/desativa_usuario.js?v=<?php echo date('YmdHis'); ?>"></script>