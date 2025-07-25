import json

def calculate_points(position, total_participants, buy_in):
    points_base_position = {
        1: 1000,
        2: 800,
        3: 700,
        4: 600,
        5: 500
    }
    
    # Calculate the number of paid positions (top 10%)
    paid_positions_count = max(1, int(total_participants * 0.10))

    if position <= 5:
        base_points = points_base_position[position]
    elif position == 6:
        base_points = 450
    elif position == 7:
        base_points = 400
    elif position == 8:
        base_points = 350
    elif position == 9:
        base_points = 300
    elif 10 <= position <= 12:
        base_points = 250
    elif 13 <= position <= 18:
        base_points = 200
    elif position > 18 and position <= paid_positions_count:
        base_points = 100
    else:
        base_points = 10

    # Nova fórmula baseada no BSOP
    fator_participantes = (total_participants / 100) + 0.5
    fator_buy_in = (buy_in / 100) + 0.5

    total_points = base_points * fator_participantes * fator_buy_in
    return total_points

def add_tournament_result(tournament_data, ranking_data):
    for player_result in tournament_data["resultados_jogadores"]:
        player_name = player_result["nome_jogador"]
        position = player_result["posicao_final"]
        
        # Calculate points for the player
        points = calculate_points(
            position,
            tournament_data["total_participantes"],
            tournament_data["buy_in"]
        )
        player_result["pontos_ganhos"] = points

        # Update overall ranking
        found = False
        for player_ranking in ranking_data:
            if player_ranking["nome_jogador"] == player_name:
                player_ranking["pontos_totais"] += points
                found = True
                break
        if not found:
            ranking_data.append({
                "nome_jogador": player_name,
                "pontos_totais": points
            })
    
    # Sort ranking by total points
    ranking_data.sort(key=lambda x: x["pontos_totais"], reverse=True)
    return tournament_data, ranking_data

# Example Usage (for testing purposes)
if __name__ == "__main__":
    # Initial ranking data
    current_ranking = []

    # Example tournament 1
    tournament1 = {
        "id_torneio": "T001",
        "nome_torneio": "Torneio Mensal Julho",
        "data": "2025-07-01",
        "buy_in": 100.00,
        "total_participantes": 75,
        "resultados_jogadores": [
            {"nome_jogador": "Alice", "posicao_final": 1, "pontos_ganhos": 0.0},
            {"nome_jogador": "Bob", "posicao_final": 5, "pontos_ganhos": 0.0},
            {"nome_jogador": "Charlie", "posicao_final": 15, "pontos_ganhos": 0.0}
        ]
    }

    updated_tournament1, current_ranking = add_tournament_result(tournament1, current_ranking)
    print("\n--- Torneio 1 Atualizado ---")
    print(json.dumps(updated_tournament1, indent=4))
    print("\n--- Ranking Atualizado ---")
    print(json.dumps(current_ranking, indent=4))

    # Example tournament 2
    tournament2 = {
        "id_torneio": "T002",
        "nome_torneio": "Torneio Semanal Quarta",
        "data": "2025-07-03",
        "buy_in": 50.00,
        "total_participantes": 30,
        "resultados_jogadores": [
            {"nome_jogador": "Bob", "posicao_final": 1, "pontos_ganhos": 0.0},
            {"nome_jogador": "Alice", "posicao_final": 7, "pontos_ganhos": 0.0},
            {"nome_jogador": "David", "posicao_final": 3, "pontos_ganhos": 0.0}
        ]
    }

    updated_tournament2, current_ranking = add_tournament_result(tournament2, current_ranking)
    print("\n--- Torneio 2 Atualizado ---")
    print(json.dumps(updated_tournament2, indent=4))
    print("\n--- Ranking Final ---")
    print(json.dumps(current_ranking, indent=4))






