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

## Boas práticas e melhorias aplicadas

- Versão de assets centralizada: criado `config/config.php` com `ASSET_VERSION` e helper `ver()`. Em produção, use versão estática (ex.: `1.0.0`) em vez de `date('YmdHis')`.
	- Exemplo: `<link rel="stylesheet" href="/css/app.css<?php echo ver(); ?>">`
- Includes centralizados: views passam a incluir `config/config.php` e usar o helper de versão; removida duplicação entre `header.php` e `sidebar.php`.
- Escape de saída: helper `e()` criado (atalho para `htmlspecialchars`) e aplicado onde há valores dinâmicos exibidos.
- Dependências: recomenda-se gerenciar via Composer/npm (ainda não migrado; `.gitignore` já cobre `vendor/` e `node_modules/`).
- Roadmap: avaliar micro-framework (Slim/Lumen) ou template engine (Twig) para melhor separação de responsabilidades.

## Desenvolvimento e troubleshooting

- Linter/formatadores sugeridos: PHP CS Fixer, ESLint.
- Para depurar erros PHP, ative `display_errors` em ambiente de desenvolvimento e configure `error_reporting(E_ALL)`.

### Variáveis de ambiente
- `APP_ENV=production|development` (opcional; padrão: development)
- `APP_VERSION=1.0.0` (opcional; controla o sufixo de versão dos assets)


## Documentação detalhada

Consulte a documentação completa em `docs/DOCUMENTATION.md` para arquitetura, fluxos, endpoints esperados, padrões e roadmap.