// ========================================
// Admins Management - GradMate
// ========================================

// Global state
let adminsData = [];
let currentConfirmAction = null;
let currentPasswordData = null;

// ========================================
// Initialization
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    loadAdmins();
});

// ========================================
// Load Admins
// ========================================

async function loadAdmins() {
    try {
        // Backend actual endpoint: GET /auth/users (returns all users)
        const response = await apiGet('auth/users');

        if (response.success) {
            const allUsers = response.users || [];
            adminsData = allUsers.filter(u => (u.authority || '').toLowerCase() === 'admin');
            renderAdminsTable();
        } else {
            showToast('Erro ao carregar administradores', 'error');
            renderEmptyState();
        }
    } catch (error) {
        console.error('Error loading admins:', error);
        showToast('Erro ao carregar administradores', 'error');
        renderEmptyState();
    }
}

// ========================================
// Render Admins List
// ========================================

function renderAdminsTable() {
    const tbody = document.getElementById('adminsTbody');
    if (!adminsData || adminsData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6">
                    <div class="empty-state">
                        <i class="fas fa-users-slash"></i>
                        <p>Nenhum administrador cadastrado</p>
                    </div>
                </td>
            </tr>`;
        return;
    }

    tbody.innerHTML = adminsData.map(admin => {
        const status = (admin.status || '').toLowerCase();
        return `
            <tr>
                <td>${admin.id}</td>
                <td>${escapeHtml(admin.username || '')}</td>
                <td>${escapeHtml(admin.email || '')}</td>
                <td><span class="admin-badge"><i class="fas fa-shield-alt"></i> Admin</span></td>
                <td>${status === 'ativo' ? 'Ativo' : 'Inativo'}</td>
                <td>
                    <div class="admin-actions">
                        <button class="btn-action btn-reset" onclick="openResetPasswordModal(${admin.id}, '${escapeAttr(admin.username || '')}')">
                            <i class="fas fa-key"></i>
                            Resetar Senha
                        </button>
                        <button class="btn-action btn-deactivate" onclick="openDeactivateModal(${admin.id}, '${escapeAttr(admin.username || '')}')">
                            <i class="fas fa-user-slash"></i>
                            Desativar
                        </button>
                    </div>
                </td>
            </tr>`;
    }).join('');
}

// ========================================
// Empty State
// ========================================

function renderEmptyState() {
    const tbody = document.getElementById('adminsTbody');
    tbody.innerHTML = `
        <tr>
            <td colspan="6">
                <div class="empty-state">
                    <i class="fas fa-users-slash"></i>
                    <p>Nenhum administrador cadastrado</p>
                </div>
            </td>
        </tr>
    `;
}

// ========================================
// Helper Functions
// ========================================

function getInitials(name) {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

// ========================================
// Modal: Create Admin
// ========================================

window.openCreateAdminModal = function() {
    const modal = document.getElementById('modalCreateAdmin');
    document.getElementById('createUsername').value = '';
    document.getElementById('createEmail').value = '';
    modal.classList.add('active');
};

window.closeCreateAdminModal = function() {
    const modal = document.getElementById('modalCreateAdmin');
    modal.classList.remove('active');
};

window.confirmCreateAdmin = async function() {
    const username = document.getElementById('createUsername').value.trim();
    const email = document.getElementById('createEmail').value.trim();

    if (!username) {
        showToast('Nome de usuário é obrigatório', 'error');
        return;
    }

    try {
        // Backend expects POST /auth/users with username, password, authority
        const tempPassword = generateTempPassword();
        const response = await apiPost('auth/users', {
            username: username,
            password: tempPassword,
            authority: 'admin',
            email: email || undefined
        });

        if (response.success) {
            showToast('Administrador criado com sucesso!', 'success');
            closeCreateAdminModal();

            currentPasswordData = {
                username: username,
                password: tempPassword
            };
            openPasswordModal();

            await loadAdmins();
        } else {
            showToast(response.message || 'Erro ao criar administrador', 'error');
        }
    } catch (error) {
        console.error('Error creating admin:', error);
        showToast('Erro ao criar administrador', 'error');
    }
};

// ========================================
// Modal: Password Display
// ========================================

function openPasswordModal() {
    const modal = document.getElementById('modalPasswordDisplay');
    document.getElementById('displayUsername').textContent = currentPasswordData.username;
    document.getElementById('displayPassword').textContent = currentPasswordData.password;
    modal.classList.add('active');
}

window.closePasswordModal = function() {
    const modal = document.getElementById('modalPasswordDisplay');
    modal.classList.remove('active');
    currentPasswordData = null;
};

window.copyPasswordToClipboard = function() {
    const password = document.getElementById('displayPassword').textContent;
    navigator.clipboard.writeText(password).then(() => {
        showToast('Senha copiada para a área de transferência', 'success');
    }).catch(err => {
        console.error('Failed to copy password:', err);
        showToast('Erro ao copiar senha', 'error');
    });
};

// ========================================
// Modal: Reset Password
// ========================================

window.openResetPasswordModal = function(adminId, username) {
    currentConfirmAction = {
        type: 'reset',
        id: adminId,
        username: username
    };

    document.getElementById('confirmTitle').textContent = 'Resetar Senha';
    document.getElementById('confirmMessage').textContent = 
        `Deseja resetar a senha do usuário "${username}"? Uma nova senha temporária será gerada.`;
    
    const confirmBtn = document.getElementById('confirmActionBtn');
    confirmBtn.className = 'btn-primary';
    confirmBtn.innerHTML = '<i class="fas fa-check"></i> Confirmar';

    document.getElementById('modalConfirm').classList.add('active');
};

// ========================================
// Modal: Deactivate Admin
// ========================================

window.openDeactivateModal = function(adminId, username) {
    currentConfirmAction = {
        type: 'deactivate',
        id: adminId,
        username: username
    };

    document.getElementById('confirmTitle').textContent = 'Desativar Administrador';
    document.getElementById('confirmMessage').textContent = 
        `Deseja realmente desativar o administrador "${username}"? Esta ação pode ser revertida posteriormente.`;
    
    const confirmBtn = document.getElementById('confirmActionBtn');
    confirmBtn.className = 'btn-danger';
    confirmBtn.innerHTML = '<i class="fas fa-check"></i> Desativar';

    document.getElementById('modalConfirm').classList.add('active');
};

// ========================================
// Modal: Confirm
// ========================================

window.closeConfirmModal = function() {
    const modal = document.getElementById('modalConfirm');
    modal.classList.remove('active');
    currentConfirmAction = null;
};

window.executeConfirmAction = async function() {
    if (!currentConfirmAction) return;

    const { type, id, username } = currentConfirmAction;

    if (type === 'reset') {
        await resetAdminPassword(id, username);
    } else if (type === 'deactivate') {
        await deactivateAdmin(id, username);
    }

    closeConfirmModal();
};

// ========================================
// Reset Admin Password
// ========================================

async function resetAdminPassword(adminId, username) {
    try {
        // Backend expects POST /auth/users/<id>/password with { password }
        const newPassword = generateTempPassword();
        const response = await apiPost(`auth/users/${adminId}/password`, { password: newPassword });

        if (response.success) {
            showToast('Senha resetada com sucesso!', 'success');

            currentPasswordData = {
                username: username,
                password: newPassword
            };
            openPasswordModal();
        } else {
            showToast(response.message || 'Erro ao resetar senha', 'error');
        }
    } catch (error) {
        console.error('Error resetting password:', error);
        showToast('Erro ao resetar senha', 'error');
    }
}

// ========================================
// Deactivate Admin
// ========================================

async function deactivateAdmin(adminId, username) {
    try {
        // Backend supports PATCH /auth/users/<id> with { status: 'inativo' }
        const response = await apiPatch(`auth/users/${adminId}`, { status: 'inativo' });

        if (response.success) {
            showToast(`Administrador "${username}" desativado com sucesso`, 'success');
            await loadAdmins();
        } else {
            showToast(response.message || 'Erro ao desativar administrador', 'error');
        }
    } catch (error) {
        console.error('Error deactivating admin:', error);
        showToast('Erro ao desativar administrador', 'error');
    }
}

// ========================================
// Toast Notifications
// ========================================

function showToast(message, type = 'info') {
    // Prefer global VanillaToasts if available
    if (typeof VanillaToasts !== 'undefined') {
        VanillaToasts.create({
            positionClass: 'topRight',
            title: type === 'error' ? 'Erro' : type === 'success' ? 'Sucesso' : 'Info',
            text: message,
            type: type,
            timeout: 4000
        });
        return;
    }
    alert(message);
}

// Utilities
function generateTempPassword() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789@$!%*?&';
    let pass = '';
    for (let i = 0; i < 10; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length));
    return pass;
}

function escapeHtml(str) {
    return String(str).replace(/[&<>"]/g, function(s) {
        return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s]);
    });
}

function escapeAttr(str) {
    return String(str).replace(/["']/g, '');
}
