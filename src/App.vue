<script setup lang="ts">
import { ref } from 'vue'

type Players = 1 | 2
type Rows = 1 | 2 | 3 | 4 | 5 | 6

const colors = {
  1: 'red',
  2: 'green',
}

const playGround = ref({
  1: new Array(8).fill(0) as number[],
  2: new Array(8).fill(0) as number[],
  3: new Array(8).fill(0) as number[],
  4: new Array(8).fill(0) as number[],
  5: new Array(8).fill(0) as number[],
  6: new Array(8).fill(0) as number[],
})

const turn = ref<Players>(1)
const flag = ref(new Array(7).fill(false))
const filled = ref<Rows[]>(new Array(8).fill(6))

const handleClick = (col: number) => {
  playGround.value[filled.value[col]][col] = turn.value
  console.log(playGround.value)
  
  turn.value = turn.value === 1 ? 2 : 1;
  filled.value[col] -= 1
  
}
</script>

<template>
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
            <div class="w-full h-full rounded-full" :class="{'bg-red-700': playGround[j][i] === 1, 'bg-green-700': playGround[j][i] === 2}"></div>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<style scoped>
</style>
