
## Estrutura de Dados

### Resultados dos Torneios
Cada resultado de torneio será armazenado como um objeto JSON com a seguinte estrutura:

```json
{
    "id_torneio": "UUID_DO_TORNEIO",
    "nome_torneio": "Nome do Torneio",
    "data": "AAAA-MM-DD",
    "buy_in": 100.00,
    "total_participantes": 50,
    "resultados_jogadores": [
        {
            "nome_jogador": "Nome do Jogador 1",
            "posicao_final": 1,
            "pontos_ganhos": 0.0
        },
        {
            "nome_jogador": "Nome do Jogador 2",
            "posicao_final": 2,
            "pontos_ganhos": 0.0
        }
        // ... outros jogadores
    ]
}
```

### Ranking Geral
O ranking geral será uma lista de objetos JSON, onde cada objeto representa um jogador e seus pontos totais:

```json
[
    {
        "nome_jogador": "Nome do Jogador A",
        "pontos_totais": 1500.50
    },
    {
        "nome_jogador": "Nome do Jogador B",
        "pontos_totais": 1200.75
    }
    // ... outros jogadores
]
```


