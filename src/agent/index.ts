const Cols = 7
const Rows = 6
const MaxDepth = 5
const Player = 1
const Bot = 2

type MinMax = 'min' | 'max'
type State = number[][]

interface ChildState {
  state: State
  col: number
}

interface Score {
  score: number
  col: number
}

interface AlphaBeta {
  alpha: number
  beta: number
}

export const Agent = {
  nextMove(state: State): number {
    const best = this.bestScore(state, 'max', 0, { alpha: -10000, beta: 10000})
    return best.col
  },
  bestScore(state: State, type: MinMax, depth: number, alphaBeta: AlphaBeta): Score {
    if (depth === MaxDepth)
      return { score: this.fitFunction(state), col: 0 }


    let target = 0
    let col = 0
    if (type === 'min')
      target = 100000
    else
      target = -100000

    for (const childState of this.children(state, type == 'max' ? Bot : Player)) {
      
      let score = 0
      
      if (this.gameEnded(childState.state, Bot))
        score = 10000 / (depth + 1)

      if (this.gameEnded(childState.state, Player)) {
        score = -10000 / (depth + 1)
      }
      
      if (score === 0)
        score = this.bestScore(childState.state, type === 'min' ? 'max' : 'min', depth + 1, alphaBeta).score

      if (type === 'min' && score < target) {
        target = score
        col = childState.col

        if (target < alphaBeta.alpha)
          break

        alphaBeta.beta = target
      }

      if (type === 'max' && score > target) {
        target = score
        col = childState.col
        
        if (target > alphaBeta.beta)
          break

        alphaBeta.alpha = target
      }
    }

    return { score: target, col }
  },
  children(state: State, player: number): ChildState[] {
    const states = [] as ChildState[]

    for (let i = 1; i <= Cols; i++) {
      const newState = state.map(arr => arr.slice())

      for (let j = Rows; j >= 1; j--) {
        if (newState[j][i] === 0) {
          newState[j][i] = player;
          states.push({ state: newState, col: i });
          break
        }
      }
    }

    return states
  },
  fitFunction(state: State): number {
    const moves = [
      { row: 1, col: 0 },
      { row: 0, col: 1 },
      { row: 1, col: 1 },
      { row: 1, col: -1 },
    ]
    let totalScore = 0

    for (const move of moves) {
      for (let row = 1; row <= Rows; row++) {
        for (let col = 1; col <= Cols; col++) {
          const pos = { row, col }
          let totalCount = 0
          const arr = []

          while (totalCount < 4) {
            if (
              !(pos.row >= 1 && pos.row <= 6) ||
              !(pos.col >= 1 && pos.col <= 7)
            ) {
              break
            }

            arr.push(state[pos.row][pos.col])

            pos.row += move.row
            pos.col += move.col
            totalCount += 1
          }

          if (totalCount == 4) {
            totalScore += this.calcScore(arr)
          }
        }
      }
    }

    return totalScore
  },
  calcScore(arr: number[]): number {
    const botIndex = arr.indexOf(Bot)
    const playerIndex = arr.indexOf(Player)

    if (botIndex > -1 && playerIndex > -1)
      return 0

    if (botIndex > -1)
      return arr.filter((element) => element === Bot).length ** 4

    if (playerIndex > -1)
      return -(arr.filter((element) => element === Player).length ** 4)

    return 0
  },
  gameEnded(state: State, player: number): boolean {
    const moves = [
      { row: 1, col: 0 },
      { row: 0, col: 1 },
      { row: 1, col: 1 },
      { row: 1, col: -1 },
    ]

    for (const move of moves) {
      for (let row = 1; row <= Rows; row++) {
        for (let col = 1; col <= Cols; col++) {
          const pos = { row, col }
          let flag = true

          for (let i = 0; i < 4; i++) {
            if (
              !(pos.row >= 1 && pos.row <= 6) ||
              !(pos.col >= 1 && pos.col <= 7) ||
              state[pos.row][pos.col] != player
            ) {
              flag = false
              break
            }

            pos.row += move.row
            pos.col += move.col
          }

          if (flag) {
            return true
          }
        }
      }
    }
    
    return false
  }
}
