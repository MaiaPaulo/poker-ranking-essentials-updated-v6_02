import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Trophy, Users, DollarSign, Calendar, Plus, Trash2, Settings } from 'lucide-react'
import TournamentManager from './components/TournamentManager.jsx'
import PointsCalculator from './components/PointsCalculator.jsx' // Importar o novo componente
import './App.css'

function App() {
  const [ranking, setRanking] = useState([])
  const [tournaments, setTournaments] = useState([])
  const [showAddTournament, setShowAddTournament] = useState(false)
  const [newTournament, setNewTournament] = useState({
    nome_torneio: '',
    data: '',
    buy_in: '',
    total_participantes: '',
    resultados_jogadores: []
  })
  const [newPlayer, setNewPlayer] = useState({ nome_jogador: '', posicao_final: '' })

  // Função para calcular pontos (Nova lógica baseada no BSOP)
  const calculatePoints = (position, totalParticipants, buyIn) => {
    const pointsBasePosition = {
      1: 1000,
      2: 800,
      3: 700,
      4: 600,
      5: 500
    }
    
    let basePoints
    const paidPositionsCount = Math.max(1, Math.floor(totalParticipants * 0.10));

    if (position <= 5) {
      basePoints = pointsBasePosition[position]
    } else if (position === 6) {
      basePoints = 450
    } else if (position === 7) {
      basePoints = 400
    } else if (position === 8) {
      basePoints = 350
    } else if (position === 9) {
      basePoints = 300
    } else if (position >= 10 && position <= 12) {
      basePoints = 250
    } else if (position >= 13 && position <= 18) {
      basePoints = 200
    } else if (position > 18 && position <= paidPositionsCount) {
      basePoints = 100
    } else {
      basePoints = 10
    }

    const fatorParticipantes = (totalParticipants / 100) + 0.5
    const fatorBuyIn = (buyIn / 100) + 0.5

    return basePoints * fatorParticipantes * fatorBuyIn
  }

  // Função para recalcular ranking completo
  const recalculateRanking = (tournamentsList) => {
    const newRanking = []
    
    tournamentsList.forEach(tournament => {
      tournament.resultados_jogadores.forEach(player => {
        const existingPlayer = newRanking.find(p => p.nome_jogador === player.nome_jogador)
        if (existingPlayer) {
          existingPlayer.pontos_totais += player.pontos_ganhos
        } else {
          newRanking.push({
            nome_jogador: player.nome_jogador,
            pontos_totais: player.pontos_ganhos
          })
        }
      })
    })

    // Ordenar ranking por pontos totais
    newRanking.sort((a, b) => b.pontos_totais - a.pontos_totais)
    setRanking(newRanking)
  }

  // Função para adicionar resultado de torneio
  const addTournamentResult = (tournamentData) => {
    const updatedTournament = { ...tournamentData }
    
    // Calcular pontos para cada jogador
    updatedTournament.resultados_jogadores = updatedTournament.resultados_jogadores.map(player => ({
      ...player,
      pontos_ganhos: calculatePoints(
        parseInt(player.posicao_final),
        parseInt(updatedTournament.total_participantes),
        parseFloat(updatedTournament.buy_in)
      )
    }))

    const newTournaments = [...tournaments, updatedTournament]
    setTournaments(newTournaments)
    recalculateRanking(newTournaments)
  }

  // Função para atualizar torneio
  const updateTournament = (updatedTournament) => {
    // Recalcular pontos para cada jogador
    updatedTournament.resultados_jogadores = updatedTournament.resultados_jogadores.map(player => ({
      ...player,
      pontos_ganhos: calculatePoints(
        parseInt(player.posicao_final),
        parseInt(updatedTournament.total_participantes),
        parseFloat(updatedTournament.buy_in)
      )
    }))

    const updatedTournaments = tournaments.map(tournament => 
      tournament.id_torneio === updatedTournament.id_torneio ? updatedTournament : tournament
    )
    
    setTournaments(updatedTournaments)
    recalculateRanking(updatedTournaments)
  }

  // Função para excluir torneio
  const deleteTournament = (tournamentIndex) => {
    const updatedTournaments = tournaments.filter((_, index) => index !== tournamentIndex)
    setTournaments(updatedTournaments)
    recalculateRanking(updatedTournaments)
  }

  const handleAddPlayer = () => {
    if (newPlayer.nome_jogador && newPlayer.posicao_final) {
      setNewTournament({
        ...newTournament,
        resultados_jogadores: [...newTournament.resultados_jogadores, { ...newPlayer, pontos_ganhos: 0 }]
      })
      setNewPlayer({ nome_jogador: '', posicao_final: '' })
    }
  }

  const handleRemovePlayer = (index) => {
    const updatedPlayers = newTournament.resultados_jogadores.filter((_, i) => i !== index)
    setNewTournament({ ...newTournament, resultados_jogadores: updatedPlayers })
  }

  const handleSubmitTournament = () => {
    if (newTournament.nome_torneio && newTournament.data && newTournament.buy_in && 
        newTournament.total_participantes && newTournament.resultados_jogadores.length > 0) {
      
      const tournamentWithId = {
        ...newTournament,
        id_torneio: `T${Date.now()}` // ID único baseado no timestamp
      }
      
      addTournamentResult(tournamentWithId)
      setNewTournament({
        nome_torneio: '',
        data: '',
        buy_in: '',
        total_participantes: '',
        resultados_jogadores: []
      })
      setShowAddTournament(false)
    }
  }

  // Dados de exemplo para demonstração
  useEffect(() => {
    const exampleTournament1 = {
      id_torneio: "T001",
      nome_torneio: "Torneio Mensal Julho",
      data: "2025-07-01",
      buy_in: 100.00,
      total_participantes: 75,
      resultados_jogadores: [
        { nome_jogador: "Alice", posicao_final: 1, pontos_ganhos: 0 },
        { nome_jogador: "Bob", posicao_final: 5, pontos_ganhos: 0 },
        { nome_jogador: "Charlie", posicao_final: 15, pontos_ganhos: 0 }
      ]
    }

    const exampleTournament2 = {
      id_torneio: "T002",
      nome_torneio: "Torneio Semanal Quarta",
      data: "2025-07-03",
      buy_in: 50.00,
      total_participantes: 30,
      resultados_jogadores: [
        { nome_jogador: "Bob", posicao_final: 1, pontos_ganhos: 0 },
        { nome_jogador: "Alice", posicao_final: 7, pontos_ganhos: 0 },
        { nome_jogador: "David", posicao_final: 3, pontos_ganhos: 0 }
      ]
    }

    addTournamentResult(exampleTournament1)
    setTimeout(() => addTournamentResult(exampleTournament2), 100)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
            <Trophy className="text-yellow-500" size={40} />
            Sistema de Ranking de Poker
          </h1>
          <p className="text-gray-600">Acompanhe os resultados e rankings dos torneios</p>
        </div>

        <Tabs defaultValue="ranking" className="w-full">
          <TabsList className="grid w-full grid-cols-4"> {/* Alterado para 4 colunas */}
            <TabsTrigger value="ranking">Ranking</TabsTrigger>
            <TabsTrigger value="add-tournament">Adicionar Torneio</TabsTrigger>
            <TabsTrigger value="manage">Gerenciar</TabsTrigger>
            <TabsTrigger value="calculator">Calculadora</TabsTrigger> {/* Nova aba */}
          </TabsList>

          <TabsContent value="ranking" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Ranking Geral */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="text-yellow-500" size={24} />
                      Ranking Geral
                    </CardTitle>
                    <CardDescription>
                      Classificação geral baseada na pontuação acumulada
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {ranking.map((player, index) => (
                        <div key={player.nome_jogador} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex items-center gap-3">
                            <Badge variant={index === 0 ? "default" : index === 1 ? "secondary" : "outline"} className="w-8 h-8 rounded-full flex items-center justify-center">
                              {index + 1}
                            </Badge>
                            <span className="font-medium">{player.nome_jogador}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-lg font-bold text-green-600">
                              {player.pontos_totais.toFixed(1)} pts
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Estatísticas */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Estatísticas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Users className="text-blue-500" size={20} />
                      <div>
                        <p className="text-sm text-gray-600">Jogadores Ativos</p>
                        <p className="font-bold">{ranking.length}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="text-purple-500" size={20} />
                      <div>
                        <p className="text-sm text-gray-600">Torneios Realizados</p>
                        <p className="font-bold">{tournaments.length}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <DollarSign className="text-green-500" size={20} />
                      <div>
                        <p className="text-sm text-gray-600">Buy-in Total</p>
                        <p className="font-bold">
                          R$ {tournaments.reduce((sum, t) => sum + (t.buy_in * t.total_participantes), 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Histórico de Torneios */}
                {tournaments.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Últimos Torneios</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {tournaments.slice(-3).reverse().map((tournament, index) => (
                          <div key={index} className="border rounded-lg p-3">
                            <h4 className="font-medium text-sm">{tournament.nome_torneio}</h4>
                            <p className="text-xs text-gray-600">
                              {new Date(tournament.data).toLocaleDateString('pt-BR')} • 
                              R$ {tournament.buy_in}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="add-tournament">
            <Card>
              <CardHeader>
                <CardTitle>Adicionar Novo Torneio</CardTitle>
                <CardDescription>
                  Insira os dados do torneio e os resultados dos jogadores
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome_torneio">Nome do Torneio</Label>
                    <Input
                      id="nome_torneio"
                      value={newTournament.nome_torneio}
                      onChange={(e) => setNewTournament({ ...newTournament, nome_torneio: e.target.value })}
                      placeholder="Ex: Torneio Mensal Agosto"
                    />
                  </div>
                  <div>
                    <Label htmlFor="data">Data</Label>
                    <Input
                      id="data"
                      type="date"
                      value={newTournament.data}
                      onChange={(e) => setNewTournament({ ...newTournament, data: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="buy_in">Buy-in (R$)</Label>
                    <Input
                      id="buy_in"
                      type="number"
                      value={newTournament.buy_in}
                      onChange={(e) => setNewTournament({ ...newTournament, buy_in: e.target.value })}
                      placeholder="100.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="total_participantes">Total de Participantes</Label>
                    <Input
                      id="total_participantes"
                      type="number"
                      value={newTournament.total_participantes}
                      onChange={(e) => setNewTournament({ ...newTournament, total_participantes: e.target.value })}
                      placeholder="50"
                    />
                  </div>
                </div>

                {/* Adicionar Jogadores */}
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Resultados dos Jogadores</h4>
                  <div className="flex gap-2 mb-3">
                    <Input
                      placeholder="Nome do Jogador"
                      value={newPlayer.nome_jogador}
                      onChange={(e) => setNewPlayer({ ...newPlayer, nome_jogador: e.target.value })}
                    />
                    <Input
                      type="number"
                      placeholder="Posição"
                      value={newPlayer.posicao_final}
                      onChange={(e) => setNewPlayer({ ...newPlayer, posicao_final: e.target.value })}
                    />
                    <Button onClick={handleAddPlayer}>
                      <Plus size={16} />
                    </Button>
                  </div>

                  {/* Lista de Jogadores Adicionados */}
                  <div className="space-y-2">
                    {newTournament.resultados_jogadores.map((player, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span>{player.nome_jogador} - {player.posicao_final}º lugar</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemovePlayer(index)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSubmitTournament} className="flex-1">
                    Salvar Torneio
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage">
            <TournamentManager 
              tournaments={tournaments}
              onUpdateTournament={updateTournament}
              onDeleteTournament={deleteTournament}
            />
          </TabsContent>

          <TabsContent value="calculator"> {/* Nova aba de calculadora */}
            <PointsCalculator />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App

