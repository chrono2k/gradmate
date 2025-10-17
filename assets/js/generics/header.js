// Variável global para armazenar dados do usuário
let currentUser = null;

document.addEventListener('DOMContentLoaded', async () => {
    if (!getAuthToken()) {
        console.warn('Token de autenticação não encontrado!');
        showToast('Aviso', 'Você precisa fazer login para acessar o sistema', 'warning');
        window.location.href = '/gradmate/index.php';
        return;
    }

    await loadUserInfo();
    initializeUserDropdown();
    initializeChangePasswordModal();
});

async function loadUserInfo() {
    try {
        const response = await apiGet('auth/user');
        
        if (response.success && response.user) {
            currentUser = response.user;
            updateUserMenu(currentUser);
            // Dispara evento customizado para outros scripts usarem
            document.dispatchEvent(new CustomEvent('userLoaded', { detail: currentUser }));
        }
    } catch (error) {
        console.error('Erro ao carregar informações do usuário:', error);
    }
}

function updateUserMenu(user) {
    const userAvatar = document.querySelector('.user-avatar');
    const userName = document.querySelector('.user-name');
    const userRole = document.querySelector('.user-role');

    if (!userAvatar || !userName || !userRole) {
        console.warn('Elementos do menu de usuário não encontrados');
        return;
    }

    // Atualiza o nome (usa name do endpoint)
    if (user.name) {
        userName.textContent = user.name;
    }

    // Atualiza o papel/cargo
    if (user.authority) {
        const roleMap = {
            // Portuguese / existing forms
            'admin': 'Administrador',
            'professor': 'Professor',
            'aluno': 'Aluno',
            'ROLE_ADMIN': 'Administrador',
            'ROLE_PROFESSOR': 'Professor',
            'ROLE_ALUNO': 'Aluno',
            // English forms returned by some backends
            'student': 'Aluno',
            'teacher': 'Professor',
            'administrator': 'Administrador'
        };
        // Normalize to lowercase key lookup first, then fallback to raw
        const normalized = String(user.authority).toLowerCase();
        userRole.textContent = roleMap[normalized] || roleMap[user.authority] || user.authority;
    }

    // Atualiza o avatar
    if (user.profilePictureUrl) {
        // Se tem foto, substitui o div por uma imagem
        const img = document.createElement('img');
        img.src = user.profilePictureUrl;
        img.alt = user.name || 'Usuário';
        img.className = 'user-avatar-img';
        userAvatar.replaceWith(img);
        img.classList.add('user-avatar');
    } else if (user.name) {
        // Se não tem foto, usa as iniciais do name
        const initials = user.name
            .split(' ')
            .filter(n => n.length > 0)
            .map(n => n[0].toUpperCase())
            .slice(0, 2)
            .join('');
        userAvatar.textContent = initials || user.name.substring(0, 2).toUpperCase();
    }
}

// Dropdown do menu de usuário
function initializeUserDropdown() {
    const userMenuToggle = document.getElementById('userMenuToggle');
    const userDropdown = document.getElementById('userDropdown');

    if (!userMenuToggle || !userDropdown) return;

    userMenuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle('show');
    });

    // Fecha ao clicar fora
    document.addEventListener('click', (e) => {
        if (!userMenuToggle.contains(e.target) && !userDropdown.contains(e.target)) {
            userDropdown.classList.remove('show');
        }
    });
}

// Modal de alteração de senha
function initializeChangePasswordModal() {
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    const changePasswordModal = document.getElementById('changePasswordModal');
    const closePasswordModal = document.getElementById('closePasswordModal');
    const cancelPasswordChange = document.getElementById('cancelPasswordChange');
    const changePasswordForm = document.getElementById('changePasswordForm');
    const userDropdown = document.getElementById('userDropdown');

    if (!changePasswordBtn || !changePasswordModal) return;

    // Abre o modal
    changePasswordBtn.addEventListener('click', (e) => {
        e.preventDefault();
        changePasswordModal.classList.add('show');
        userDropdown.classList.remove('show');
    });

    // Fecha o modal
    const closeModal = () => {
        changePasswordModal.classList.remove('show');
        changePasswordForm.reset();
    };

    closePasswordModal.addEventListener('click', closeModal);
    cancelPasswordChange.addEventListener('click', closeModal);

    // Fecha ao clicar no overlay
    changePasswordModal.addEventListener('click', (e) => {
        if (e.target === changePasswordModal) {
            closeModal();
        }
    });

    // Submit do formulário
    changePasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleChangePassword();
    });
}

async function handleChangePassword() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validações
    if (!currentPassword || !newPassword || !confirmPassword) {
        showToast('Erro', 'Todos os campos são obrigatórios', 'error');
        return;
    }

    if (newPassword.length < 6) {
        showToast('Erro', 'A nova senha deve ter pelo menos 6 caracteres', 'error');
        return;
    }

    if (newPassword !== confirmPassword) {
        showToast('Erro', 'As senhas não coincidem', 'error');
        return;
    }

    if (currentPassword === newPassword) {
        showToast('Erro', 'A nova senha deve ser diferente da atual', 'error');
        return;
    }

    try {
        // Endpoint: POST /auth/user/password com { currentPassword, newPassword }
        const response = await apiPost('auth/user/password', {
            currentPassword: currentPassword,
            newPassword: newPassword
        });

        if (response.success) {
            showToast('Sucesso', 'Senha alterada com sucesso!', 'success');
            document.getElementById('changePasswordModal').classList.remove('show');
            document.getElementById('changePasswordForm').reset();
        } else {
            showToast('Erro', response.message || 'Erro ao alterar senha', 'error');
        }
    } catch (error) {
        console.error('Erro ao alterar senha:', error);
        showToast('Erro', 'Erro ao alterar senha. Verifique sua senha atual.', 'error');
    }
}
