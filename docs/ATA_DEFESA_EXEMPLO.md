# ATA DE DEFESA - EXEMPLO

## Estrutura da Ata de Defesa

### Cabeçalho
```
ATA Nº [NÚMERO]

ATA DE DEFESA DO PROJETO DE GRADUAÇÃO DO CURSO DE TECNOLOGIA EM ANÁLISE E DESENVOLVIMENTO DE SISTEMAS DA FACULDADE DE TECNOLOGIA DE GARÇA "DEPUTADO JULIO JULINHO MARCONDES DE MOURA", APRESENTADO PELO ALUNO [NOME DO ALUNO].
```

### Corpo Principal
```
Aos [DD] dias do mês de [MÊS] de [YYYY], às [HH]:[MM]h, em sessão pública, realizou-se na [LOCAL DA DEFESA], a defesa do Projeto de Graduação "[TÍTULO DO TRABALHO]", de autoria do aluno [NOME DO ALUNO]. A Banca Examinadora iniciou suas atividades submetendo o aluno à forma regimental de defesa do Projeto de Graduação. Terminado o exame, a Banca procedeu ao julgamento e declarou o aluno [APROVADO/REPROVADO].

Desta forma, considera-se [aprovado/reprovado] o referido Projeto de Graduação. Encerradas as atividades, foi lavrada a presente ata, que após lida, ficará arquivada no prontuário do discente.
```

### Assinaturas

#### Orientador(es)
```
_________________________________________
[Nome do Orientador]
Orientador
```

#### Membros da Banca
```
_________________________________________
[Nome do Membro]
Membro da Banca
```

### Rodapé
```
Garça/SP, [DD] de [MÊS] de [YYYY]
Página [N] de [TOTAL]
```

---

## Formato Atual Implementado

### Campos do Modal:
- **ATA Nº**: Preenchido automaticamente (próximo ID disponível)
- **Resultado**: Aprovado / Reprovado
- **Local da Defesa**: Editável (padrão: Sala Maker da FATEC Garça)

### Dados do Projeto Utilizados:
- Nome do aluno (primeiro estudante do projeto)
- Título do trabalho (nome do projeto)
- Orientadores (lista de professores do projeto)
- Convidados/Banca (lista de guests do projeto)
- Data/hora atual da geração

### Layout do PDF:
1. **Linha 1 (topo esquerdo)**: ATA Nº [número]
2. **Após 2 quebras de linha**: Título principal centralizado
3. **Corpo**: Parágrafos formatados com justificação
4. **Assinaturas**: Linha horizontal + nome + cargo
5. **Rodapé**: Local/data centralizado + paginação

---

## Variações Futuras (Sugestões)

### Ata de Qualificação
- Mesma estrutura, mas:
  - Título: "ATA DE QUALIFICAÇÃO DO PROJETO..."
  - Resultado pode incluir: "Aprovado com ressalvas"
  - Adicionar campo "Observações da banca"

### Ata de Pré-projeto
- Estrutura simplificada
- Foco em aprovação da proposta
- Sem resultado aprovado/reprovado (apenas "Aprovado para prosseguir")

### Ata de Banca Externa
- Incluir instituição de origem dos membros
- Campo adicional para titulação (Dr., Me., etc.)

---

## Metadados Registrados no Backend

```json
{
  "file_id": 123,
  "student_name": "Nome do Aluno",
  "title": "Título do Trabalho",
  "result": "aprovado",
  "location": "Sala Maker da FATEC Garça",
  "started_at": "2025-07-04T21:15:00-03:00"
}
```

Registrado na tabela `defense_minutes` via endpoint:
```
POST /project/:projectId/atas
```

---

## Checklist de Validação

- [ ] ATA Nº aparece no topo esquerdo
- [ ] Título principal centralizado após 2 quebras de linha
- [ ] Data/hora no formato extenso português
- [ ] Local da defesa customizável
- [ ] Resultado (Aprovado/Reprovado) inserido corretamente
- [ ] Assinaturas de orientadores com label "Orientador"
- [ ] Assinaturas de convidados com label "Membro da Banca"
- [ ] Rodapé: Garça/SP + data + paginação
- [ ] PDF salvo nos arquivos do projeto
- [ ] Registro criado em `defense_minutes` com metadados
- [ ] Download automático para o usuário após geração
