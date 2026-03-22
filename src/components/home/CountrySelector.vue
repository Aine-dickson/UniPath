<template>
  <div class="mb-5">
    <p class="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3">
      Select your country
    </p>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div v-for="c in countries" :key="c.id"
        @click="results.selectedCountry = c.id"
        class="flex flex-col gap-1 p-5 rounded-md cursor-pointer transition-all
               bg-[var(--bg-surface)] border-2
               hover:bg-[var(--bg-raised)] hover:shadow-sm"
        :class="results.selectedCountry === c.id
          ? 'border-gold'
          : 'border-[var(--border-soft)]'">
        <span class="text-3xl leading-none mb-1">{{ c.flag }}</span>
        <span class="font-display text-base font-bold text-[var(--text)]">{{ c.name }}</span>
        <span class="text-xs text-[var(--text-muted)]">{{ c.system }}</span>
        <span class="text-xs font-semibold text-gold mt-1">{{ c.courseCount }} courses indexed</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useResultsStore } from '@/stores/useResultsStore.js'
const results = useResultsStore()

const countries = [
  { id: 'ug', name: 'Uganda',   flag: '🇺🇬', system: 'UNEB / UACE',   courseCount: 24 },
  { id: 'ke', name: 'Kenya',    flag: '🇰🇪', system: 'KNEC / KCSE',   courseCount: 10 },
  { id: 'tz', name: 'Tanzania', flag: '🇹🇿', system: 'NECTA / ACSEE', courseCount: 12 },
]
</script>
