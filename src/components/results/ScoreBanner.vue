<template>
  <div class="flex flex-wrap items-center gap-6 px-5 py-4 rounded-md mb-5
              bg-gold/7 border border-gold/20">

    <div class="flex flex-col flex-1 min-w-0">
      <span class="text-[0.65rem] uppercase tracking-widest text-[var(--text-muted)]">Subjects</span>
      <span class="text-sm font-semibold text-[var(--text)] leading-snug mt-0.5 truncate">
        {{ principalLabel }}
        <span class="text-[var(--text-muted)] font-normal"> + {{ subLabel }}</span>
      </span>
    </div>

    <div v-for="item in stats" :key="item.label" class="flex flex-col flex-shrink-0">
      <span class="text-[0.65rem] uppercase tracking-widest text-[var(--text-muted)]">{{ item.label }}</span>
      <span class="font-display text-xl font-black leading-none mt-0.5"
        :class="item.color || 'text-[var(--text)]'">
        {{ item.value }}
      </span>
    </div>

    <div class="ml-auto flex-shrink-0">
      <RouterLink to="/check"
        class="px-3.5 py-2 rounded-md text-xs font-bold border border-[var(--border-soft)]
               text-[var(--text-sub)] hover:bg-[var(--bg-hover)] transition-colors">
        Edit
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGradesStore } from '@/stores/useGradesStore.js'

const grades = useGradesStore()

const principalLabel = computed(() =>
  grades.principalSubjects.filter(s => s.subject).map(s => s.subject).join(' · ')
)
const subLabel = computed(() =>
  grades.optionalSub ? `GP + ${grades.optionalSub}` : 'GP only'
)
const stats = computed(() => [
  { label: 'O-Level Pts',    value: grades.oLevelTotal.toFixed(2), color: 'text-gold' },
  { label: 'Subsidiary Pts', value: grades.subsidiaryPts,          color: '' },
])
</script>
