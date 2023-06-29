<script setup lang="ts">
import { ref } from 'vue'
import { Agent } from './agent';

type Players = 1 | 2

const playGround = ref([
  new Array(8).fill(0), // actully useless
  new Array(8).fill(0),
  new Array(8).fill(0),
  new Array(8).fill(0),
  new Array(8).fill(0),
  new Array(8).fill(0),
  new Array(8).fill(0),
])

const turn = ref<Players>(1)
const flag = ref(new Array(7).fill(false))
const filled = ref<number[]>(new Array(8).fill(6))
const winner = ref('')

const checkGameEnded = () => {
  const moves = [
    { row: 1, col: 0 },
    { row: 0, col: 1 },
    { row: 1, col: 1 },
    { row: 1, col: -1 },
  ]
  
  for (const move of moves) {
    for (let row = 1; row <= 6; row++) {
      for (let col = 1; col <= 7; col++) {
        const pos = { row, col }
        let flag = true
        
        for (let i = 0; i < 4; i++) {
          if (
              !(pos.row >= 1 && pos.row <= 6) || 
              !(pos.col >= 1 && pos.col <= 7) || 
              playGround.value[pos.row][pos.col] != turn.value
          ) {
            flag = false
            break
          }

          pos.row += move.row
          pos.col += move.col
        }

        if (flag) {
          winner.value = `player ${turn.value} wins`
        }
      }
    }
  }
}

const handleClick = (col: number) => {
  if (winner.value !== '')
    return

  playGround.value[filled.value[col]][col] = turn.value
  checkGameEnded()
  
  turn.value = turn.value === 1 ? 2 : 1;
  filled.value[col] -= 1
  
  if (turn.value === 2)
    handleClick(Agent.nextMove(playGround.value))
}
</script>

<template>
  <div>
    <div class="flex">
      <template v-for="i in 7" :key="i">
        <div
          class="flex-col"
          @click="() => handleClick(i)"
        >
          <template v-for="j in 6" :key="i * 10 + j">
            <div 
              class="w-24 h-24 m-1 p-2" 
              :class="{'bg-gray-500': (i + j) % 2 === 1, 'bg-gray-300': (i + j) % 2 === 0}"
              @mouseover="flag[i] = true"
              @mouseout="flag[i] = false"
            >
              <div v-show="flag[i] && filled[i] == j" class="w-full h-full rounded-full" :class="{'bg-red-300': turn === 1, 'bg-green-300': turn === 2}"></div>
              <div class="w-full h-full rounded-full" :class="{'bg-red-500': playGround[j][i] === 1, 'bg-green-500': playGround[j][i] === 2}"></div>
            </div>
          </template>
        </div>
      </template>
    </div>
    <div>{{ winner }}</div>
  </div>
</template>

<style scoped>
</style>
