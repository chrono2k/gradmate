# GradMate

Projeto de controle de TCC — interface administrativa para gerenciar projetos, alunos, professores e cursos.

## Visão geral

- Linguagem: PHP
- Frontend: CSS e JS organizados em `css/` e `assets/js/`.
- Views estão em `views/` com subpastas por área (projeto, alunos, professores, etc.).

## Estrutura de pastas

- `views/` — arquivos .php que representam telas e templates parciais (`generics/header.php`, `generics/sidebar.php`).
- `assets/` — imagens, libs e scripts JS.
- `css/` — estilos por área.
- `index.php` — ponto de entrada público.

## Requisitos

- PHP (recomendado 7.4+)
- MySQL (ou MariaDB)
- XAMPP (opcional) para desenvolvimento local

## Como rodar localmente (XAMPP)

1. Coloque a pasta `gradmate` dentro do diretório `htdocs` do XAMPP (ex.: `C:\xampp\htdocs\gradmate`).
2. Inicie o Apache e MySQL via painel do XAMPP.
3. Crie o banco de dados e importe o dump/estrutura se existir (não incluído neste repositório).
4. Abra no navegador: `http://localhost/gradmate/` ou `http://localhost/gradmate/index.php`.

> Observação: paths nas views usam caminhos relativos (ex.: `../../assets/...`). Se mover o projeto para outro path, ajuste `BASE_URL`/paths conforme necessário.

## Configurações recomendadas

- Adicionar arquivo de configuração (ex.: `config.php`) para armazenar credenciais de banco, `BASE_URL` e settings de ambiente.
- Verificar que sessões e controle de acesso estejam configurados (não presente nas views fornecidas).

## Boas práticas e próximas melhorias

- Evitar usar cache-busting com `date('YmdHis')` em produção — isso força recarregamento a cada request. Use versões estáticas ou hashes no build.
- Remover duplicação de includes (alguns CSS/JS são incluídos múltiplas vezes entre `header.php` e views).
- Usar `htmlspecialchars()` quando imprimir dados do banco nas views para evitar XSS.
- Gerenciar dependências via Composer (PHP) e npm (JS) em vez de copiar libs manualmente.
- Considerar migração para um micro-framework (Slim/Lumen) ou usar templates (Twig) para separar lógica e view.
- Adicionar `.gitignore` para evitar commitar libs grandes e arquivos sensíveis.

## Desenvolvimento e troubleshooting

- Linter/formatadores sugeridos: PHP CS Fixer, ESLint.
- Para depurar erros PHP, ative `display_errors` em ambiente de desenvolvimento e configure `error_reporting(E_ALL)`.

## Contato

Se quiser, eu posso:
- Criar `.gitignore` e um `README` mais detalhado com exemplos de DB/seed.
- Centralizar includes e remover duplicações.
- Adicionar verificações de segurança básicas nas views.


---
Gerado automaticamente — posso adaptar o README com informações do banco de dados, rotas e setup de ambiente se você me passar os detalhes.