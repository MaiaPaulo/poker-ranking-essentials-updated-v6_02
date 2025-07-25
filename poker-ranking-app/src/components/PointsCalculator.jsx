import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Calculator, Trophy, Users, DollarSign } from 'lucide-react'

function PointsCalculator() {
  const [position, setPosition] = useState('')
  const [totalParticipants, setTotalParticipants] = useState('')
  const [buyIn, setBuyIn] = useState('')
  const [calculatedPoints, setCalculatedPoints] = useState(null)
  const [breakdown, setBreakdown] = useState(null)

  // Função para calcular pontos (baseada no BSOP)
  const calculatePoints = (pos, participants, buyInValue) => {
    const pointsBasePosition = {
      1: 1000,
      2: 800,
      3: 700,
      4: 600,
      5: 500
    }
    
    let basePoints
    const paidPositionsCount = Math.max(1, Math.floor(participants * 0.10));

    if (pos <= 5) {
      basePoints = pointsBasePosition[pos]
    } else if (pos === 6) {
      basePoints = 450
    } else if (pos === 7) {
      basePoints = 400
    } else if (pos === 8) {
      basePoints = 350
    } else if (pos === 9) {
      basePoints = 300
    } else if (pos >= 10 && pos <= 12) {
      basePoints = 250
    } else if (pos >= 13 && pos <= 18) {
      basePoints = 200
    } else if (pos > 18 && pos <= paidPositionsCount) {
      basePoints = 100
    } else {
      basePoints = 10
    }

    const fatorParticipantes = (participants / 100) + 0.5
    const fatorBuyIn = (buyInValue / 100) + 0.5

    const totalPoints = basePoints * fatorParticipantes * fatorBuyIn

    return {
      totalPoints,
      basePoints,
      fatorParticipantes,
      fatorBuyIn,
      paidPositionsCount
    }
  }

  const handleCalculate = () => {
    const pos = parseInt(position)
    const participants = parseInt(totalParticipants)
    const buyInValue = parseFloat(buyIn)

    if (!pos || !participants || !buyInValue || pos < 1 || participants < 1 || buyInValue < 0) {
      alert('Por favor, preencha todos os campos com valores válidos.')
      return
    }

    if (pos > participants) {
      alert('A posição não pode ser maior que o total de participantes.')
      return
    }

    const result = calculatePoints(pos, participants, buyInValue)
    setCalculatedPoints(result.totalPoints)
    setBreakdown(result)
  }

  const handleClear = () => {
    setPosition('')
    setTotalParticipants('')
    setBuyIn('')
    setCalculatedPoints(null)
    setBreakdown(null)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="text-blue-500" size={24} />
            Calculadora de Pontos BSOP
          </CardTitle>
          <CardDescription>
            Calcule automaticamente os pontos baseados na posição final, número de participantes e buy-in
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="position">Posição Final</Label>
              <Input
                id="position"
                type="number"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Ex: 1"
                min="1"
              />
            </div>
            <div>
              <Label htmlFor="participants">Total de Participantes</Label>
              <Input
                id="participants"
                type="number"
                value={totalParticipants}
                onChange={(e) => setTotalParticipants(e.target.value)}
                placeholder="Ex: 100"
                min="1"
              />
            </div>
            <div>
              <Label htmlFor="buyIn">Buy-in (R$)</Label>
              <Input
                id="buyIn"
                type="number"
                step="0.01"
                value={buyIn}
                onChange={(e) => setBuyIn(e.target.value)}
                placeholder="Ex: 100.00"
                min="0"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleCalculate} className="flex-1">
              <Calculator size={16} className="mr-2" />
              Calcular Pontos
            </Button>
            <Button variant="outline" onClick={handleClear}>
              Limpar
            </Button>
          </div>
        </CardContent>
      </Card>

      {calculatedPoints !== null && breakdown && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="text-yellow-500" size={24} />
              Resultado do Cálculo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Resultado Principal */}
              <div className="text-center p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Pontos Totais</h3>
                <div className="text-4xl font-bold text-green-600">
                  {calculatedPoints.toFixed(1)} pts
                </div>
              </div>

              {/* Breakdown do Cálculo */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="text-yellow-500" size={16} />
                    <span className="text-sm font-medium text-gray-600">Pontos Base</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {breakdown.basePoints}
                  </div>
                  <div className="text-xs text-gray-500">
                    Posição: {position}º lugar
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="text-blue-500" size={16} />
                    <span className="text-sm font-medium text-gray-600">Fator Participantes</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {breakdown.fatorParticipantes.toFixed(2)}x
                  </div>
                  <div className="text-xs text-gray-500">
                    {totalParticipants} participantes
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="text-green-500" size={16} />
                    <span className="text-sm font-medium text-gray-600">Fator Buy-in</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {breakdown.fatorBuyIn.toFixed(2)}x
                  </div>
                  <div className="text-xs text-gray-500">
                    R$ {parseFloat(buyIn).toFixed(2)}
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="text-purple-500" size={16} />
                    <span className="text-sm font-medium text-gray-600">Posições Pagas</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {breakdown.paidPositionsCount}
                  </div>
                  <div className="text-xs text-gray-500">
                    Top 10% do field
                  </div>
                </div>
              </div>

              {/* Fórmula */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Fórmula de Cálculo:</h4>
                <div className="text-sm text-blue-800 font-mono">
                  Pontos = {breakdown.basePoints} × {breakdown.fatorParticipantes.toFixed(2)} × {breakdown.fatorBuyIn.toFixed(2)} = {calculatedPoints.toFixed(1)}
                </div>
                <div className="text-xs text-blue-600 mt-1">
                  Pontos Base × Fator Participantes × Fator Buy-in
                </div>
              </div>

              {/* Informações Adicionais */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-yellow-50 rounded border border-yellow-200">
                  <h5 className="font-medium text-yellow-800 mb-1">Posição no Ranking</h5>
                  <p className="text-yellow-700">
                    {parseInt(position) === 1 ? '🏆 Campeão!' : 
                     parseInt(position) <= 3 ? '🥉 Pódio!' :
                     parseInt(position) <= breakdown.paidPositionsCount ? '💰 Posição premiada' :
                     '📊 Participação pontuada'}
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded border border-green-200">
                  <h5 className="font-medium text-green-800 mb-1">Percentual do Field</h5>
                  <p className="text-green-700">
                    Top {((parseInt(position) / parseInt(totalParticipants)) * 100).toFixed(1)}% do torneio
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabela de Referência */}
      <Card>
        <CardHeader>
          <CardTitle>Tabela de Pontuação Base</CardTitle>
          <CardDescription>
            Pontos atribuídos por posição final (antes dos multiplicadores)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 text-sm">
            <div className="p-2 bg-yellow-50 rounded border">
              <div className="font-medium">1º lugar</div>
              <div className="text-yellow-600 font-bold">1000 pts</div>
            </div>
            <div className="p-2 bg-gray-50 rounded border">
              <div className="font-medium">2º lugar</div>
              <div className="text-gray-600 font-bold">800 pts</div>
            </div>
            <div className="p-2 bg-orange-50 rounded border">
              <div className="font-medium">3º lugar</div>
              <div className="text-orange-600 font-bold">700 pts</div>
            </div>
            <div className="p-2 bg-blue-50 rounded border">
              <div className="font-medium">4º lugar</div>
              <div className="text-blue-600 font-bold">600 pts</div>
            </div>
            <div className="p-2 bg-purple-50 rounded border">
              <div className="font-medium">5º lugar</div>
              <div className="text-purple-600 font-bold">500 pts</div>
            </div>
            <div className="p-2 bg-green-50 rounded border">
              <div className="font-medium">6º lugar</div>
              <div className="text-green-600 font-bold">450 pts</div>
            </div>
            <div className="p-2 bg-red-50 rounded border">
              <div className="font-medium">7º lugar</div>
              <div className="text-red-600 font-bold">400 pts</div>
            </div>
            <div className="p-2 bg-indigo-50 rounded border">
              <div className="font-medium">8º lugar</div>
              <div className="text-indigo-600 font-bold">350 pts</div>
            </div>
            <div className="p-2 bg-pink-50 rounded border">
              <div className="font-medium">9º lugar</div>
              <div className="text-pink-600 font-bold">300 pts</div>
            </div>
            <div className="p-2 bg-teal-50 rounded border">
              <div className="font-medium">10º-12º</div>
              <div className="text-teal-600 font-bold">250 pts</div>
            </div>
            <div className="p-2 bg-cyan-50 rounded border">
              <div className="font-medium">13º-18º</div>
              <div className="text-cyan-600 font-bold">200 pts</div>
            </div>
            <div className="p-2 bg-lime-50 rounded border">
              <div className="font-medium">Top 10%</div>
              <div className="text-lime-600 font-bold">100 pts</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PointsCalculator

