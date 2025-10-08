function login(e) {

    credenciais = {}
    $(".vanillatoasts-toast").remove()
    let dados_login = $("#form_login").serializeArray()
    console.log(dados_login)
    if (valida_form(dados_login)) {
        dados_login.map(function (x) { credenciais[x.name] = x.value; })
        const agora = new Date();
        const epochUTC = agora.getTime();
        credenciais['epoch'] = Math.floor(epochUTC / 1000);
        console.log(dados_login);
        $.ajax({
            method: "POST",
            processData: true,
            contentType: "application/json",
            data: JSON.stringify(credenciais),
            url: link_api_grad_mate + "auth/login/",
            success: function (resposta) {
                let token = resposta.token
                console.log("pegado token")
                console.log(token)
                localStorage.setItem("token", token);
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
    // window.location.href = url_base + "views/dashboard/dashboard.php"

}
$("input").keyup(function (event) {
    if (event.keyCode === 13) {
        $('#botao_login').click();
    }
});

$('#botao_login').on("click", login)