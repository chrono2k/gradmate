# Especificação Backend - Convidados/Banca

## 📋 Resumo
Adicionar funcionalidade de convidados/membros da banca aos projetos, permitindo que professores sejam adicionados com uma role diferente (guest) além da role de orientador.

---

## 🗄️ Alterações no Banco de Dados

### 1. Tabela `teacher_project`
Adicionar coluna `role` para diferenciar orientadores de convidados:

```sql
ALTER TABLE teacher_project 
ADD COLUMN role VARCHAR(20) DEFAULT 'advisor' NOT NULL;

-- Valores possíveis:
-- 'advisor' = Orientador
-- 'guest' = Convidado/Membro da Banca
```

**Índice recomendado:**
```sql
CREATE INDEX idx_teacher_project_role ON teacher_project(role);
```

---

## 🔌 Endpoints da API

### 1. **GET** `/project/:id`
**Alteração:** Incluir lista de `guests` na resposta

**Response atual:**
```json
{
  "success": true,
  "project": {
    "id": 1,
    "name": "Projeto X",
    "teachers": [...],
    "students": [...],
    ...
  }
}
```

**Response nova:**
```json
{
  "success": true,
  "project": {
    "id": 1,
    "name": "Projeto X",
    "teachers": [
      {
        "id": 1,
        "name": "Prof. João",
        "observation": "Orientador principal"
      }
    ],
    "guests": [
      {
        "id": 2,
        "name": "Prof. Maria",
        "observation": "Especialista em IA"
      }
    ],
    "students": [...],
    ...
  }
}
```

**Implementação sugerida:**
- Filtrar `teacher_project` por `role = 'advisor'` para `teachers`
- Filtrar `teacher_project` por `role = 'guest'` para `guests`

---

### 2. **PUT** `/project/:id/guests`
**Novo endpoint** para adicionar convidados

**Request:**
```json
{
  "guest_ids": [2, 3, 5]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Convidados adicionados com sucesso",
  "guests": [
    {
      "id": 2,
      "name": "Prof. Maria",
      "observation": "Especialista em IA"
    },
    ...
  ]
}
```

**Lógica:**
1. Validar se `guest_ids` é array não vazio
2. Validar se todos os IDs são de professores válidos
3. Verificar se algum já é orientador do projeto (role = 'advisor')
   - Se sim, retornar erro 400: "Professor já é orientador do projeto"
4. Verificar se algum já é convidado (role = 'guest')
   - Se sim, ignorar (idempotência) ou retornar aviso
5. Inserir em `teacher_project` com `role = 'guest'`

---

### 3. **DELETE** `/project/:id/guests/:guestId`
**Novo endpoint** para remover convidado

**Response:**
```json
{
  "success": true,
  "message": "Convidado removido com sucesso"
}
```

**Lógica:**
1. Validar se projeto existe
2. Validar se professor está como convidado (role = 'guest')
   - Se não, retornar erro 404: "Convidado não encontrado"
3. Deletar relação em `teacher_project`

---

## ✅ Validações Importantes

### Regras de Negócio:
1. **Um professor NÃO pode ser orientador E convidado ao mesmo tempo**
   - Ao adicionar como convidado, verificar se já é orientador
   - Ao adicionar como orientador, verificar se já é convidado
   
2. **Convidados podem ser removidos a qualquer momento**
   - Diferente de orientadores que podem ter restrições

3. **Listagem separada**
   - `teachers` (role = 'advisor')
   - `guests` (role = 'guest')

### Códigos de Erro:
- `400` - Professor já vinculado em outra role
- `404` - Convidado não encontrado
- `422` - Validação falhou (IDs inválidos, array vazio)

---

## 🔄 Migração de Dados Existentes

Se já existem dados na tabela `teacher_project`:

```sql
-- Todos os registros existentes serão orientadores por padrão
UPDATE teacher_project 
SET role = 'advisor' 
WHERE role IS NULL OR role = '';
```

---

## 📱 Frontend (Já Implementado)

### Componentes:
- ✅ Card "Convidados / Banca" na coluna direita
- ✅ Modal de seleção de convidados (filtro por busca)
- ✅ Funções JS: `openAddGuestModal()`, `confirmAddGuests()`, `removeGuest()`
- ✅ PDF inclui convidados nas assinaturas como "Membro da Banca"

### Chamadas API (Frontend):
```javascript
// Adicionar convidados
PUT /project/{id}/guests
Body: { guest_ids: [2, 3] }

// Remover convidado
DELETE /project/{id}/guests/{guestId}

// Listagem vem no GET /project/{id}
// Response: { ...project, guests: [...] }
```

---

## 🧪 Testes Sugeridos

### Casos de Teste:
1. ✅ Adicionar convidado que não é orientador → Sucesso
2. ✅ Adicionar convidado que já é orientador → Erro 400
3. ✅ Adicionar mesmo convidado duas vezes → Idempotente
4. ✅ Remover convidado existente → Sucesso
5. ✅ Remover convidado inexistente → Erro 404
6. ✅ Gerar PDF com orientadores + convidados → Assinaturas corretas

---

## 📝 Checklist de Implementação

Backend:
- [ ] Adicionar coluna `role` em `teacher_project`
- [ ] Atualizar endpoint GET `/project/:id` para incluir `guests`
- [ ] Criar endpoint PUT `/project/:id/guests`
- [ ] Criar endpoint DELETE `/project/:id/guests/:guestId`
- [ ] Implementar validações de role (não pode ser advisor + guest)
- [ ] Testar todos os casos

Frontend:
- [x] Card de convidados na UI
- [x] Modal de seleção
- [x] Funções de adicionar/remover
- [x] Integração no PDF

---

## 💡 Exemplo de Uso Completo

```javascript
// 1. Usuário adiciona Prof. Maria como convidada
PUT /project/123/guests
{ "guest_ids": [2] }

// 2. Backend valida:
//    - Prof. Maria não é orientadora do projeto ✅
//    - Prof. Maria ainda não é convidada ✅
//    - Insere: (project_id: 123, teacher_id: 2, role: 'guest')

// 3. Frontend renderiza no card "Convidados / Banca"

// 4. Ao gerar PDF, assinatura aparece:
//    _________________________________
//    Prof. Maria
//    Membro da Banca
```

---

## 🚀 Pronto para Implementar!

Segue essa spec e você terá toda a funcionalidade de convidados funcionando perfeitamente! 🎯
