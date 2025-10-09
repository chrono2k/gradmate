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

/**
 * Obter token de autenticação
 */
function getAuthToken() {
    return localStorage.getItem('token');
}

/**
 * Configurar headers padrão para requisições
 */
function getHeaders() {
    const token = getAuthToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

/**
 * Fazer requisição GET
 */
async function apiGet(endpoint) {
    try {
        const response = await fetch(`${link_api_grad_mate}${endpoint}`, {
            method: 'GET',
            headers: getHeaders()
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Erro na requisição GET:', error);
        throw error;
    }
}

/**
 * Fazer requisição POST
 */
async function apiPost(endpoint, data) {
    try {
        const response = await fetch(`${link_api_grad_mate}${endpoint}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Erro na requisição POST:', error);
        throw error;
    }
}

/**
 * Fazer requisição PUT
 */
async function apiPut(endpoint, data) {
    try {
        const response = await fetch(`${link_api_grad_mate}${endpoint}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Erro na requisição PUT:', error);
        throw error;
    }
}

/**
 * Fazer requisição DELETE
 */
async function apiDelete(endpoint, data) {
    try {
        const response = await fetch(`${link_api_grad_mate}${endpoint}`, {
            method: 'DELETE',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Erro na requisição DELETE:', error);
        throw error;
    }
}

/**
 * Exibir Toast
 */

function showToast(title, message, type = 'success') {
    VanillaToasts.create({
        positionClass: 'topRight',
        title: title,
        text: message,
        type: type,
        icon: '../../assets/img/icone-tcc.png',
        timeout: 9000,
        callback: function () { "" }
    });
}
