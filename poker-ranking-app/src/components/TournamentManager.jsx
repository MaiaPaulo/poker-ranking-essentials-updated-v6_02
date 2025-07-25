import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog.jsx'
import { Edit, Trash2, Plus, Save, X } from 'lucide-react'

const TournamentManager = ({ tournaments, onUpdateTournament, onDeleteTournament }) => {
  const [editingTournament, setEditingTournament] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [newPlayer, setNewPlayer] = useState({ nome_jogador: '', posicao_final: '' })

  const handleEditTournament = (tournament) => {
    setEditingTournament(tournament)
    setEditForm({ ...tournament })
  }

  const handleSaveEdit = () => {
    onUpdateTournament(editForm)
    setEditingTournament(null)
    setEditForm({})
  }

  const handleCancelEdit = () => {
    setEditingTournament(null)
    setEditForm({})
  }

  const handleAddPlayerToEdit = () => {
    if (newPlayer.nome_jogador && newPlayer.posicao_final) {
      setEditForm({
        ...editForm,
        resultados_jogadores: [...editForm.resultados_jogadores, { ...newPlayer, pontos_ganhos: 0 }]
      })
      setNewPlayer({ nome_jogador: '', posicao_final: '' })
    }
  }

  const handleRemovePlayerFromEdit = (index) => {
    const updatedPlayers = editForm.resultados_jogadores.filter((_, i) => i !== index)
    setEditForm({ ...editForm, resultados_jogadores: updatedPlayers })
  }

  const handleDeleteTournament = (tournamentIndex) => {
    onDeleteTournament(tournamentIndex)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciar Torneios</CardTitle>
        <CardDescription>
          Edite ou exclua torneios existentes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tournaments.map((tournament, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-medium">{tournament.nome_torneio}</h4>
                  <p className="text-sm text-gray-600">
                    {new Date(tournament.data).toLocaleDateString('pt-BR')} • 
                    Buy-in: R$ {tournament.buy_in} • 
                    {tournament.total_participantes} participantes
                  </p>
                </div>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditTournament(tournament)}
                      >
                        <Edit size={14} className="mr-1" />
                        Editar
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Editar Torneio</DialogTitle>
                        <DialogDescription>
                          Modifique os dados do torneio e os resultados dos jogadores
                        </DialogDescription>
                      </DialogHeader>
                      
                      {editingTournament && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="edit_nome_torneio">Nome do Torneio</Label>
                              <Input
                                id="edit_nome_torneio"
                                value={editForm.nome_torneio || ''}
                                onChange={(e) => setEditForm({ ...editForm, nome_torneio: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit_data">Data</Label>
                              <Input
                                id="edit_data"
                                type="date"
                                value={editForm.data || ''}
                                onChange={(e) => setEditForm({ ...editForm, data: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit_buy_in">Buy-in (R$)</Label>
                              <Input
                                id="edit_buy_in"
                                type="number"
                                value={editForm.buy_in || ''}
                                onChange={(e) => setEditForm({ ...editForm, buy_in: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit_total_participantes">Total de Participantes</Label>
                              <Input
                                id="edit_total_participantes"
                                type="number"
                                value={editForm.total_participantes || ''}
                                onChange={(e) => setEditForm({ ...editForm, total_participantes: e.target.value })}
                              />
                            </div>
                          </div>

                          {/* Editar Jogadores */}
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
                              <Button onClick={handleAddPlayerToEdit}>
                                <Plus size={16} />
                              </Button>
                            </div>

                            {/* Lista de Jogadores */}
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                              {editForm.resultados_jogadores?.map((player, playerIndex) => (
                                <div key={playerIndex} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                  <span>{player.nome_jogador} - {player.posicao_final}º lugar</span>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleRemovePlayerFromEdit(playerIndex)}
                                  >
                                    <Trash2 size={14} />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex gap-2 pt-4">
                            <Button onClick={handleSaveEdit} className="flex-1">
                              <Save size={16} className="mr-2" />
                              Salvar Alterações
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={handleCancelEdit}
                              className="flex-1"
                            >
                              <X size={16} className="mr-2" />
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 size={14} className="mr-1" />
                        Excluir
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza de que deseja excluir o torneio "{tournament.nome_torneio}"? 
                          Esta ação não pode ser desfeita e afetará o ranking geral.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteTournament(index)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {tournament.resultados_jogadores.slice(0, 3).map((player, playerIndex) => (
                  <div key={playerIndex} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm">
                      {player.posicao_final}º {player.nome_jogador}
                    </span>
                    <span className="text-sm font-medium text-green-600">
                      +{player.pontos_ganhos.toFixed(1)} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default TournamentManager

