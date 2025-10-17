document.addEventListener('userLoaded', (event) => {
    const user = event.detail;
    applySidebarPermissions(user);
});

function applySidebarPermissions(user) {
    if (!user || !user.authority) {
        return;
    }

    const authority = String(user.authority).toLowerCase();

    if (authority === 'student' || authority === 'aluno') {
        hideMenuItemsByText([
            'Alunos',
            'Professores', 
            'Cursos',
            'Arquivos',
            'Cadastrar Usuário'
        ]);
        hideEmptySections();
    }

    if (authority === 'teacher' || authority === 'professor') {
        hideMenuItemsByText([
            'Cadastrar Usuário',
            'Cursos',
            'Professores',
            'Alunos'
        ]);
        hideEmptySections();
    }
}

function hideMenuItemsByText(textArray) {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        const linkText = item.textContent.trim();
        
        if (textArray.some(text => linkText.includes(text))) {
            item.style.display = 'none';
        }
    });
}

function hideEmptySections() {
    const sections = document.querySelectorAll('.nav-section');
    
    sections.forEach(section => {
        const visibleItems = Array.from(section.querySelectorAll('.nav-item'))
            .filter(item => item.style.display !== 'none');
        
        if (visibleItems.length === 0) {
            section.style.display = 'none';
        }
    });
}
