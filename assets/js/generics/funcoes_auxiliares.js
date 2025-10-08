function valida_form(dados) {
    for (var i = 0; i < dados.length; i++) {
        if (dados[i].value == "") {
            var auxiliar = $('#' + dados[i].name);
            auxiliar.focus();
            auxiliar.css({
                "border": " 1px solid rgb(255 0 0)",
                'border-color': 'red',
                'box-shadow': ' rgb(255 0 0 / 56%) 0.1em 0.1em 0.3em'
            });
            console.log(auxiliar)
            aux = auxiliar.attr("placeholder")
            VanillaToasts.create({
                positionClass: 'topRight',
                title: 'Preenchimento incorreto',
                text: 'Preencha o campo ' + aux + " corretamente!",
                type: 'error',
                icon: 'assets/img/icone-tcc.png',
                timeout: 9000,
                callback: function () { "" }
            });
            return false;
        }
    }
    return true;
}

function valida_form_bootstrap_aux(dados_form, seletor_form) {
    for (var i = 0; i < dados_form.length; i++) {
        if ($("[name='" + dados_form[i].name + "'").prop("required")) {
            if (dados_form[i].value == "") {
                seletor_form.addClass("was-validated")
                return false;
            }
        }
    }
    seletor_form.removeClass("was-validated")
    return true;
}

function capitalizar_primeira_letra(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
function print_status_requisicao(mensagem = "", tipo = "sucesso", recarregar = false, timeout = [false, 0]) {
    let intervalo = timeout[0]
    let tempo_intervalo = timeout[1]
    if (tipo == "sucesso") {
        iziToast.success({
            timeout: 10000,
            close: false,
            overlay: true,
            zindex: 999999999,
            displayMode: 'once',
            position: "center",
            message: mensagem,
            layout: 3,
            buttons: [['<button><b>OK</b></button>', function (instance, toast) {
                instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                if (recarregar) {
                    location.reload();
                }
            }, true],
            ],
        });

    }
    if (tipo == "error") {
        iziToast.error({
            timeout: 10000,
            close: false,
            overlay: true,
            displayMode: 1,
            theme: 'light',
            color: 'red',
            id: "erro",
            zindex: 999999999,
            message: mensagem,
            position: 'center',
            buttons: [['<button><b>OK</b></button>', function (instance, toast) {
                instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                if (recarregar) {
                    location.reload();
                }
            }, true],
            ],
        });
    }
    if (tipo == "aviso") {
        iziToast.warning({
            timeout: 10000,
            close: false,
            overlay: true,
            displayMode: 'once',
            position: "center",
            message: mensagem,
            theme: 'light',
            color: 'yellow',
            zindex: 999999999,
            layout: 3,
            buttons: [['<button><b>OK</b></button>', function (instance, toast) {
                instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                if (recarregar) {
                    location.reload();
                }
            }, true],
            ],
        });
    }
    if (recarregar) {
        if (intervalo) {
            setTimeout(function () {
                location.reload();
            }, tempo_intervalo)
        }
    }
}