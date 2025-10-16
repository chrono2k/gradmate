# Especificação Backend - Atas de Defesa

## 🎯 Objetivo
Registrar e consultar as "Atas de Defesa" geradas para cada projeto. Toda vez que o frontend gerar a ata (PDF), além de fazer upload para os arquivos do projeto, deverá registrar um item de "ata gerada" com metadados e vínculo ao arquivo salvo.

---

## 🗄️ Banco de Dados

### Tabela: `defense_minutes`

Registra cada ata gerada e vinculada a um projeto.

```sql
CREATE TABLE defense_minutes (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL,
  file_id INTEGER NOT NULL,
  student_name VARCHAR(255) NOT NULL,
  title TEXT NOT NULL,
  result VARCHAR(20) CHECK (result IN ('aprovado', 'reprovado', 'pendente')) NOT NULL,
  location VARCHAR(255) NULL,
  started_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_by INTEGER NULL,
  CONSTRAINT fk_defense_minutes_project FOREIGN KEY (project_id) REFERENCES project(id) ON DELETE CASCADE
);

CREATE INDEX idx_defense_minutes_project ON defense_minutes(project_id);
```

Observações:
- `file_id`: referência ao arquivo salvo na tabela de arquivos (mesma usada no upload em `project/:id/files`).
- `result`: valor normalizado em minúsculas.
- `location` e `started_at` opcionais para futura auditoria.

---

## 🔌 Endpoints

Base sugerida: `/project/:projectId/atas`

### 1) POST `/project/:projectId/atas`
Cria um registro de ata gerada.

Request:
```json
{
  "file_id": 123,
  "student_name": "Maximiano da Costa Silva",
  "title": "PROPOSTA DE UMA PLATAFORMA SASS COM WEBSITE COM MVC...",
  "result": "aprovado",
  "location": "Sala Maker da FATEC Garça",
  "started_at": "2025-07-04T21:15:00-03:00"
}
```

Response (201):
```json
{
  "success": true,
  "ata": {
    "id": 45,
    "project_id": 999,
    "file_id": 123,
    "student_name": "Maximiano da Costa Silva",
    "title": "PROPOSTA DE UMA PLATAFORMA SASS COM WEBSITE COM MVC...",
    "result": "aprovado",
    "location": "Sala Maker da FATEC Garça",
    "started_at": "2025-07-04T21:15:00-03:00",
    "created_at": "2025-07-04T21:20:10-03:00"
  }
}
```

Validações:
- `file_id` obrigatório e deve existir na tabela de arquivos do projeto
- `result` ∈ {"aprovado","reprovado","pendente"}
- `title` e `student_name` obrigatórios

Códigos de erro:
- 400: payload inválido
- 404: projeto não encontrado / arquivo não pertence ao projeto

---

### 2) GET `/project/:projectId/atas`
Lista as atas do projeto (mais recentes primeiro).

Response:
```json
{
  "success": true,
  "items": [
    {
      "id": 45,
      "file_id": 123,
      "student_name": "Maximiano da Costa Silva",
      "title": "PROPOSTA DE UMA PLATAFORMA SASS...",
      "result": "aprovado",
      "created_at": "2025-07-04T21:20:10-03:00"
    }
  ],
  "total": 1
}
```

---

### 3) GET `/project/:projectId/atas/:ataId`
Detalhes de uma ata específica.

Response:
```json
{
  "success": true,
  "ata": {
    "id": 45,
    "project_id": 999,
    "file_id": 123,
    "student_name": "Maximiano da Costa Silva",
    "title": "PROPOSTA DE UMA PLATAFORMA SASS...",
    "result": "aprovado",
    "location": "Sala Maker da FATEC Garça",
    "started_at": "2025-07-04T21:15:00-03:00",
    "created_at": "2025-07-04T21:20:10-03:00"
  }
}
```

---

### 4) DELETE `/project/:projectId/atas/:ataId`
Remove o registro de ata (não remove o arquivo automaticamente; decidir regra de negócio).

Response:
```json
{ "success": true }
```

---

## 🔒 Autorização
- Exigir token válido.
- Apenas usuários com permissão no projeto (admin/orientador) podem criar/listar/remover.

---

## 🔁 Fluxo no Frontend (já adaptado)
1. Gera PDF da Ata via jsPDF.
2. Faz upload para `POST project/:id/files` (como já implementado).
3. Backend retorna lista atualizada de arquivos com `id` do arquivo.
4. Frontend chama `POST /project/:id/atas` com `file_id` + metadados (aluno, título, resultado etc.).

Payload gerado pelo front (exemplo real):
```json
{
  "file_id": 321,
  "student_name": "Maximiano da Costa Silva",
  "title": "PROPOSTA DE UMA PLATAFORMA SASS COM WEBSITE COM MVC PARA AUXILIAR O USUARIO A ENCONTRAR A MELHOR OFERTA PARA SEU FRETE",
  "result": "aprovado",
  "location": "Sala Maker da FATEC Garça",
  "started_at": "2025-07-04T21:15:00-03:00"
}
```

---

## 🧪 Testes Sugeridos
- Criar ata com `file_id` válido → 201 + registro persistido
- Criar ata com `file_id` que não pertence ao projeto → 404
- Listar atas de projeto sem atas → lista vazia
- Buscar ata inexistente → 404
- Excluir ata → 200 e sumir da lista

---

## 📝 Checklist de Implementação
- [ ] Criar tabela `defense_minutes`
- [ ] Implementar endpoints GET/POST/GET by id/DELETE
- [ ] Validar ownership do arquivo pelo projeto
- [ ] Restringir acesso por role (admin/orientador)
- [ ] Adicionar índice por `project_id`
- [ ] Cobertura de testes

---

## 📎 Observações
- Se quiserem, dá para guardar também os nomes dos membros da banca no registro da ata (campo JSON: `board_members`).
- `started_at` pode ser gravado como UTC no backend; o front está mandando com offset.
- `result` deve ser sempre minúsculo (front já manda minúsculo).
