import React, { useState, useEffect } from 'react'
import './App.css'

type Players = "O" | "X";

function App() {

  const [turn, setTurn] = useState<Players>("O");

  const [winner, setWinner] = useState<Players | null>(null);

  const [draw, setDraw] = useState<boolean | null>(null);

  // Armazenar as posições como objeto:^
  // {
  //   "0": "x",
  //   "1": "O",
  //   "2": "x",
  //   ...
  // }
  const [marks, setMarks] = useState<{[key: string]: Players}>({});

  const finishGame = !!winner || !!draw;


  const getSquares = () => {
    return new Array(9).fill(true);
  };

  const play = (index: number) => {
    // Verificação para que o usuário não selecione um bloco já preenchido:
    if (marks[index] || finishGame) {
      return;
    }

    // preserva e adioiona um item a mais:
    setMarks(prev => ({ ...prev, [index]: turn}))

    // Depois da jogada troca a vez:
    setTurn(prev => prev === "O" ? "X" : "O")
  }

  // Identificar qual usuário selecionou a célula:
  const getCellPlayer = (index: number) => {
    if (!marks[index]) {
      return;
    }

    return marks[index];
  }

  // Identificar e obter o vencedor:
  const getWinner = () => {
    const victoryLines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 4, 8],
      [2, 4, 6],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
    ]

    for (const line of victoryLines) {
      const [a, b, c] = line;

      if (marks[a] && marks[a] === marks[b] && marks[a] === marks[c]) {
        return marks[a];
      }
    }
  }

  // CAso haja alguma alteração nos marks, verifica se há algum vencedor:
  useEffect(() => {
    const victorious = getWinner()

    if (victorious) {
      setWinner(victorious)
    } else {
      if (Object.keys(marks).length === 9) {
        setDraw(true)
      }
    }
  }, [marks])

  // Jogar Novamente:
  const reset = () => {
    setMarks({});
    setWinner(null);
    setDraw(null)
  }

  return (
    <div className="container">
      {winner && <h1>{winner === "O" ? "Bolinha Ganhou!" : "Xizinho Ganhou!"}</h1>}

      {draw && <h2>Empate</h2>}

      {finishGame && <button onClick={reset}>Jogar Novamente</button>}  

      {!finishGame && <p>É a vez de "{turn}" Jogar</p>}

      <div className={`board ${finishGame ? "Fim de Jogo!" : null}`}>
        {getSquares().map((_, i) => (
          <div className={`cell ${getCellPlayer(i)}`} onClick={() => play(i)}>
            {marks[i]}
          </div>
        ))}

      </div>
    </div>
  )
}

export default App
