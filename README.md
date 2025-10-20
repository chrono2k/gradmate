# GradMate

Painel administrativo para organizar TCC: projetos, alunos, professores e cursos, tudo em um só lugar. O foco é ser simples de rodar localmente e direto de usar.

## O que tem aqui

- Backend em PHP (views em `views/`), sem framework pesado.
- Frontend com CSS e JS separados por área (`css/` e `assets/js/`).
- Componentes genéricos reutilizáveis em `views/generics/` (header e sidebar).

## Como rodar localmente (com XAMPP)

1) Copie a pasta `gradmate` para o `htdocs` do XAMPP (ex.: `C:\xampp\htdocs\gradmate`).
2) Inicie Apache e MySQL no painel do XAMPP.
3) Crie o banco e importe o esquema (se aplicável).
4) Abra no navegador: `http://localhost/gradmate/`.

Observação: as views usam caminhos relativos (ex.: `../../assets/...`). Se mudar a estrutura, ajuste a base/paths no `config/config.php`.

## Requisitos

- PHP 7.4+ (8.x funciona também)
- MySQL/MariaDB
- XAMPP (ou stack equivalente)

## Estrutura rápida

- `index.php` — entrada da aplicação.
- `views/` — páginas por módulo (projeto, alunos, etc.) e parciais em `generics/`.
- `assets/js/` — scripts por módulo (ex.: `projetos.js`, `alunos.js`).
- `css/` — estilos por módulo (ex.: `projetos.css`, `alunos.css`).
- `config/` — config de ambiente e helpers (ex.: `config.php`, `ver()`).

## Dicas de desenvolvimento

- Em dev, se quiser ver mudanças de CSS/JS sem cache, deixe `ver()` com timestamp. Em produção, trave com uma versão fixa (ex.: `1.0.0`).
- Para debugar PHP, habilite `display_errors` e `error_reporting(E_ALL)`. Formatação: PHP CS Fixer ajuda.

## Documentação

Para detalhes de arquitetura e fluxos, veja `docs/DOCUMENTATION.md`.