document.addEventListener('DOMContentLoaded', () => {
    if (!getAuthToken()) {
        console.warn('Token de autenticação não encontrado!');
        showToast('Aviso', 'Você precisa fazer login para acessar o sistema', 'warning');
        window.location.href = '/gradmate/index.php';
    }
});
