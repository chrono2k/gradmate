<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="assets/libs/bootstrap/bootstrap-5.3.3-dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="assets/libs/fontawesome-free-6.5.1-web/css/all.css">
    <link rel="stylesheet" href="css/generic/generic.css?v=<?php echo date('YmdHis'); ?>">
    <link rel="stylesheet" href="assets/libs/jquery/VanillaToasts/vanillatoasts.css">
    <link rel="stylesheet" href="css/index.css?v=<?php echo date('YmdHis'); ?>">
    <title>GradMate</title>
</head>

<body>

<section class="min-vh-100 d-flex bg-primary align-items-center">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-12 col-md-8 col-lg-5 justify-content-center container_login">
                <div class="card bg-primary shadow-soft border-light p-4">
                    <div class="d-flex justify-content-between align-items-center mb-3">
<!--                        <img src="assets/img/icone%20tcc.png" class="icone_login" alt="Logo cps" style="width: 40px;">-->
                        <div class="flex-grow-1 text-center texto_login">
                            <h4 class="mb-0 texto_login_1">Grad</h4>
                            <h4 class="mb-0 texto_login_2">Mate</h4>
                        </div>
                    </div>
                    <div class="card-body div_login">
                        <form id="form_login" class="mt-4">
                            <div class="form-group">
                                <div class="input-group mb-4">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text"><span class="fas fa-envelope"></span></span>
                                    </div>
                                    <input class="form-control" id="username" name="username" placeholder="Login" type="text" aria-label="email adress" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="input-group mb-4">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text"><span class="fas fa-unlock-alt"></span></span>
                                    </div>
                                    <input class="form-control" id="password" name="password" placeholder="Senha" type="password" aria-label="Password" required>
                                </div>
                            </div>
                            <div class="d-flex d-sm-flex justify-content-end mb-4">
                                <div ><a href="#" class="small text-right">Esqueceu a senha?</a></div>
                            </div>
                            <button type="button" class="btn btn-block btn-primary" id="botao_login">Entrar</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <div class="logo-footer">
            <img src="assets/img/logo-2024.png" class="img-fluid imagem_login" alt="Logo cps">
        </div>
    </div>

</section>
</body>
<script src="assets/libs/Jquery/jquery-3.7.1.min.js"></script>
<script src="assets/libs/bootstrap/bootstrap-5.3.3-dist/js/bootstrap.bundle.js"></script>
<script src="assets/libs/jquery/VanillaToasts/vanillatoasts.js"></script>
<script src="constantes.js"></script>
<script src="assets/js/login.js?v=<?php echo date('YmdHis'); ?>"></script>
<script src="assets/js/generics/funcoes_auxiliares.js?v=<?php echo date('YmdHis'); ?>"></script>

</html>