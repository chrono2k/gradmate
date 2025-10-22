function login(e) {
    let credenciais = {}
    $(".vanillatoasts-toast").remove()
    let dados_login = $("#form_login").serializeArray()
    
    if (valida_form(dados_login)) {
        dados_login.map(function (x) { credenciais[x.name] = x.value; })
        $.ajax({
            method: "POST",
            processData: true,
            contentType: "application/json",
            data: JSON.stringify(credenciais),
            url: link_api_grad_mate + "auth/login/",
            success: function (response) {
                localStorage.setItem("token", response.token);
                window.location.href = url_base + "views/dashboard/dashboard.php"
            }
        }).fail(function () {
            VanillaToasts.create({
                positionClass: 'topRight',
                title: 'Preenchimento incorreto',
                text: 'E-mail ou senha, inválidos',
                type: 'error',
                icon: 'assets/img/icone-tcc.png',
                timeout: 9000,
                callback: function () { "" }
            });
        });
    }
}
$("input").keyup(function (event) {
    if (event.keyCode === 13) {
        $('#botao_login').click();
    }
});

$('#botao_login').on("click", login)