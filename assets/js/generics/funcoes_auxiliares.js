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
        'Authorization': `${token}`
    };
}

/**
 * Headers sem content-type para multipart/form-data
 */
function getAuthHeadersOnly() {
    const token = getAuthToken();
    return {
        'Authorization': `${token}`
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
 * Upload multipart (FormData)
 */
async function apiUpload(endpoint, formData) {
    try {
        const response = await fetch(`${link_api_grad_mate}${endpoint}`, {
            method: 'POST',
            headers: getAuthHeadersOnly(),
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Erro no upload:', error);
        throw error;
    }
}

/**
 * Download autenticado
 */
async function apiDownload(endpoint) {
    try {
        const response = await fetch(`${link_api_grad_mate}${endpoint}`, {
            method: 'GET',
            headers: getAuthHeadersOnly()
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob();
        const disposition = response.headers.get('Content-Disposition') || response.headers.get('content-disposition') || '';
        let filename = null;

        // Tenta RFC 5987 (filename*=)
        const fnStarMatch = disposition.match(/filename\*=(?:UTF-8''|)([^;\s]+)/i);
        if (fnStarMatch && fnStarMatch[1]) {
            try { filename = decodeURIComponent(fnStarMatch[1].replace(/^"|"$/g, '')); } catch { filename = fnStarMatch[1]; }
        }

        // Tenta filename="..." padrão
        if (!filename) {
            const fnMatch = disposition.match(/filename="?([^";]+)"?/i);
            if (fnMatch && fnMatch[1]) {
                filename = fnMatch[1];
            }
        }

        // Fallback: tenta pegar da URL de resposta
        if (!filename) {
            try {
                const urlObj = new URL(response.url);
                const qpName = urlObj.searchParams.get('filename');
                if (qpName) {
                    filename = decodeURIComponent(qpName);
                } else {
                    let last = urlObj.pathname.split('/').filter(Boolean).pop();
                    if (last) {
                        try { last = decodeURIComponent(last); } catch {}
                        // Evita usar nomes genéricos como 'download'
                        if (last && last.toLowerCase() !== 'download' && !/^\d+$/.test(last)) {
                            filename = last;
                        }
                    }
                }
            } catch {}
        }

        // Fallback final: derive do endpoint
        if (!filename) {
            let tail = (endpoint || '').split('/').filter(Boolean).pop() || '';
            if (tail && tail.toLowerCase() !== 'download' && !/^\d+$/.test(tail)) {
                filename = tail;
            }
        }

        if (!filename || filename === 'undefined' || filename === 'null') {
            filename = 'arquivo';
        }

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Erro no download:', error);
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
 * Fazer requisição PATCH
 */
async function apiPatch(endpoint, data) {
    try {
        const response = await fetch(`${link_api_grad_mate}${endpoint}`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Erro na requisição PATCH:', error);
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
