# Sistema de Ranking de Poker

Um sistema completo para gerenciar rankings de torneios de poker, desenvolvido em React com interface moderna e intuitiva.

## Características Principais

### Fórmula de Pontuação
O sistema utiliza uma fórmula que combina três fatores:
- **Posição final no torneio**
- **Número total de participantes**
- **Valor do buy-in**

**Fórmula:** `Pontos = (Pontos_Base_Posicao * Multiplicador_Participantes) + (Buy_in * Fator_Buy_in)`

#### Pontos Base por Posição:
- 1º lugar: 1000 pontos
- 2º lugar: 700 pontos
- 3º lugar: 500 pontos
- 4º lugar: 300 pontos
- 5º lugar: 200 pontos
- 6º-10º lugar: 100 pontos
- 11º-20º lugar: 50 pontos
- Outros participantes: 10 pontos

#### Multiplicadores:
- **Multiplicador de Participantes:** `Número_de_Participantes / 50`
- **Fator Buy-in:** `0.01`

### Funcionalidades

1. **Visualização do Ranking**
   - Ranking geral ordenado por pontuação total
   - Estatísticas gerais (jogadores ativos, torneios realizados, buy-in total)
   - Histórico dos últimos torneios

2. **Adicionar Torneios**
   - Formulário completo para inserir dados do torneio
   - Adição de múltiplos jogadores e suas posições
   - Cálculo automático de pontos

3. **Gerenciar Torneios**
   - Edição de torneios existentes
   - Exclusão de torneios com confirmação
   - Recálculo automático do ranking

## Como Usar

### Executar o Sistema

1. **Instalar dependências:**
   ```bash
   cd poker-ranking-app
   pnpm install
   ```

2. **Iniciar o servidor de desenvolvimento:**
   ```bash
   pnpm run dev
   ```

3. **Acessar a aplicação:**
   Abra o navegador em `http://localhost:5173`

### Navegação

O sistema possui três abas principais:

#### 1. Ranking
- Visualize o ranking geral dos jogadores
- Consulte estatísticas dos torneios
- Veja o histórico dos últimos torneios realizados

#### 2. Adicionar Torneio
- Preencha os dados básicos do torneio (nome, data, buy-in, participantes)
- Adicione os resultados dos jogadores um por um
- Clique em "Salvar Torneio" para processar os dados

#### 3. Gerenciar
- Visualize todos os torneios cadastrados
- Use "Editar" para modificar dados de um torneio
- Use "Excluir" para remover um torneio (com confirmação)

### Exemplo de Uso

1. **Adicionar um novo torneio:**
   - Vá para a aba "Adicionar Torneio"
   - Preencha: Nome = "Torneio Semanal", Data = "2025-08-15", Buy-in = "50", Participantes = "30"
   - Adicione jogadores: "João" - 1º lugar, "Maria" - 2º lugar, etc.
   - Clique em "Salvar Torneio"

2. **Verificar o ranking:**
   - Vá para a aba "Ranking"
   - O ranking será atualizado automaticamente com os novos pontos

3. **Editar um torneio:**
   - Vá para a aba "Gerenciar"
   - Clique em "Editar" no torneio desejado
   - Modifique os dados necessários
   - Clique em "Salvar Alterações"

## Estrutura do Projeto

```
poker-ranking-app/
├── src/
│   ├── components/
│   │   ├── ui/           # Componentes de interface (shadcn/ui)
│   │   └── TournamentManager.jsx  # Gerenciador de torneios
│   ├── App.jsx           # Componente principal
│   ├── App.css           # Estilos da aplicação
│   └── main.jsx          # Ponto de entrada
├── public/               # Arquivos estáticos
├── package.json          # Dependências do projeto
└── README.md            # Esta documentação
```

## Tecnologias Utilizadas

- **React 18** - Framework principal
- **Vite** - Build tool e servidor de desenvolvimento
- **Tailwind CSS** - Framework de estilos
- **shadcn/ui** - Componentes de interface
- **Lucide React** - Ícones

## Manutenção

### Backup dos Dados
Os dados são armazenados no estado da aplicação. Para persistência, considere implementar:
- LocalStorage para dados locais
- Backend com banco de dados para uso em produção

### Personalização da Fórmula
Para alterar a fórmula de pontuação, edite a função `calculatePoints` no arquivo `src/App.jsx`.

### Adição de Novas Funcionalidades
O sistema foi desenvolvido de forma modular. Novas funcionalidades podem ser adicionadas criando novos componentes na pasta `src/components/`.

## Suporte

Para dúvidas ou problemas, consulte:
1. Esta documentação
2. Os comentários no código-fonte
3. A estrutura de dados definida em `data_structure.md`

