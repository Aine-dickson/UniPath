<template>
  <div class="flex flex-col gap-2.5 mb-5">
    <!-- Status pills -->
    <div class="flex flex-wrap gap-2 items-center">
      <button v-for="p in statusPills" :key="p.val"
        @click="results.filterStatus = p.val"
        class="px-3.5 py-1.5 rounded-full text-sm font-semibold border-[1.5px] transition-all"
        :class="results.filterStatus === p.val
          ? 'bg-gold/12 border-gold text-gold'
          : 'bg-[var(--bg-surface)] border-[var(--border-soft)] text-[var(--text-muted)] hover:border-[var(--border)] hover:text-[var(--text)]'">
        {{ p.label }}
      </button>
    </div>

    <!-- Dropdowns -->
    <div class="flex flex-wrap gap-2">
      <select v-model="results.filterFaculty"
        class="rounded-full text-sm px-3.5 py-1.5 border-[1.5px] border-[var(--border-soft)]
               bg-[var(--bg-surface)] text-[var(--text-muted)] appearance-none cursor-pointer
               focus:border-gold focus:text-[var(--text)] focus:shadow-none">
        <option value="">All Faculties</option>
        <option v-for="f in results.faculties" :key="f" :value="f">{{ f }}</option>
      </select>

      <select v-model="results.filterUniversity"
        class="rounded-full text-sm px-3.5 py-1.5 border-[1.5px] border-[var(--border-soft)]
               bg-[var(--bg-surface)] text-[var(--text-muted)] appearance-none cursor-pointer
               focus:border-gold focus:text-[var(--text)] focus:shadow-none">
        <option value="">All Universities</option>
        <option v-for="u in results.universities" :key="u" :value="u">{{ u }}</option>
      </select>

      <span class="ml-auto font-mono text-xs text-[var(--text-muted)] px-3 py-1.5
                   bg-[var(--bg-raised)] border border-[var(--border-soft)] rounded-full self-center">
        {{ results.filteredResults.length }} / {{ results.results.length }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { useResultsStore } from '@/stores/useResultsStore.js'
const results = useResultsStore()

const statusPills = [
  { val: 'all',        label: 'All' },
  { val: 'likely',     label: '✅ Likely' },
  { val: 'possible',   label: '⚠️ Possible' },
  { val: 'stretch',    label: '🔴 Stretch' },
  { val: 'ineligible', label: '✕ Ineligible' },
]
</script>
