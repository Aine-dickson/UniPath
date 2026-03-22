<template>
  <div class="rounded-lg border border-[var(--border-soft)] border-t-4 border-t-warn
              bg-[var(--bg-surface)] p-7 mb-8">
    <div class="flex items-center gap-3 mb-2">
      <span class="text-2xl">🏫</span>
      <h2 class="font-display text-xl font-bold text-[var(--text)]">
        Open &amp; Private University Admissions
      </h2>
    </div>
    <p class="text-sm text-[var(--text-sub)] leading-relaxed mb-5">
      Didn't make the government-sponsored cutoff? Open and private universities
      offer degree programmes with lower or no minimum cutoff requirements. Most
      admit students on a <strong class="text-[var(--text)]">self-sponsored</strong> basis
      regardless of points — your O &amp; A-Level results still matter for course
      selection, but you won't be locked out.
    </p>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      <div v-for="u in visible" :key="u.name"
        class="bg-[var(--bg-raised)] border border-[var(--border-soft)]
               rounded-md p-4 flex flex-col gap-1">
        <p class="font-semibold text-[var(--text)] text-sm leading-snug">{{ u.name }}</p>
        <p class="text-xs text-[var(--text-muted)]">{{ u.location }} · {{ u.type }}</p>
        <p class="text-xs font-semibold text-warn">Min cutoff: {{ u.minCutoff }}</p>
        <p class="text-xs text-[var(--text-muted)]">📅 {{ u.deadline }}</p>
        <a :href="u.url" target="_blank" rel="noopener"
          class="inline-flex items-center gap-1 text-xs font-semibold text-gold
                 hover:underline mt-1.5">
          Apply / Learn more ↗
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useResultsStore } from '@/stores/useResultsStore.js'
const results = useResultsStore()

const openUniversities = [
  { country: 'ug', name: 'Kampala International University',  location: 'Kampala',          type: 'Private',          minCutoff: 'Any 2 A-Level passes', deadline: 'Rolling admissions — apply anytime', url: 'https://www.kiu.ac.ug' },
  { country: 'ug', name: 'Uganda Martyrs University',         location: 'Nkozi / Kampala',  type: 'Private',          minCutoff: '2 principal passes',   deadline: 'Jan & Aug intakes',                url: 'https://www.umu.ac.ug' },
  { country: 'ug', name: 'Ndejje University',                 location: 'Luweero',          type: 'Private',          minCutoff: '2 principal passes',   deadline: 'Sept & Feb intakes',               url: 'https://www.ndejjeuniversity.ac.ug' },
  { country: 'ug', name: 'Nkumba University',                 location: 'Entebbe',          type: 'Private',          minCutoff: 'Any UACE',             deadline: 'Sept intake; apply by Aug',        url: 'https://www.nkumbauniversity.ac.ug' },
  { country: 'ke', name: 'Mount Kenya University',            location: 'Thika / Nairobi',  type: 'Private',          minCutoff: 'C plain KCSE',         deadline: 'January & May intakes',            url: 'https://www.mku.ac.ke' },
  { country: 'ke', name: 'Kabarak University',                location: 'Nakuru',           type: 'Private/Christian',minCutoff: 'C+ KCSE',              deadline: 'September intake',                 url: 'https://www.kabarak.ac.ke' },
  { country: 'tz', name: 'Tumaini University Dar es Salaam',  location: 'Dar es Salaam',    type: 'Private',          minCutoff: '2 A-Level passes',     deadline: 'Oct & March intakes',              url: 'https://www.tumaini.ac.tz' },
  { country: 'tz', name: 'St. Augustine University (SAUT)',   location: 'Mwanza',           type: 'Private/Catholic', minCutoff: '2 A-Level passes',     deadline: 'November intake',                  url: 'https://www.saut.ac.tz' },
]

const visible = computed(() =>
  openUniversities.filter(u => u.country === results.selectedCountry)
)
</script>
