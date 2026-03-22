<template>
  <div class="relative overflow-hidden rounded-md border border-[var(--border-soft)]
              bg-[var(--bg-surface)] card-status cursor-pointer transition-all duration-150
              hover:border-[var(--border)] hover:bg-[var(--bg-raised)] hover:-translate-y-px hover:shadow-sm"
    :class="[`status-${course.status}`, { 'opacity-55': course.status === 'ineligible' }]"
    @click="emit('open', course)">

    <!-- Bookmark -->
    <button @click.stop="shortlist.toggle(course)"
      class="absolute top-3 right-3 z-10 text-base leading-none transition-colors"
      :class="shortlist.isShortlisted(course.id) ? 'text-gold' : 'text-[var(--text-muted)] hover:text-gold'">
      {{ shortlist.isShortlisted(course.id) ? '★' : '☆' }}
    </button>

    <div class="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 p-5">
      <!-- Left -->
      <div>
        <p class="font-display font-bold text-[var(--text)] text-base leading-snug mb-1 pr-6">
          {{ course.name }}
        </p>
        <p class="text-xs text-[var(--text-muted)] mb-3">{{ course.university }}</p>

        <div class="flex flex-wrap gap-1.5 mb-3">
          <span class="text-[0.62rem] font-bold uppercase px-2 py-0.5 rounded
                       bg-gold/10 text-gold">{{ course.faculty }}</span>
          <span class="text-[0.62rem] font-bold uppercase px-2 py-0.5 rounded
                       bg-[var(--text-muted)]/10 text-[var(--text-muted)]">
            {{ course.essentials.join(' + ') }}
          </span>
          <span class="text-[0.62rem] font-bold uppercase px-2 py-0.5 rounded
                       bg-success/8 text-success">{{ course.duration }}</span>
          <span class="text-[0.62rem] font-bold uppercase px-2 py-0.5 rounded
                       bg-info/10 text-info">{{ course.countryLabel }}</span>
        </div>

        <!-- Sparkline trend -->
        <div class="flex items-center gap-2.5">
          <span class="text-[0.68rem] text-[var(--text-muted)] whitespace-nowrap">Cutoff trend:</span>
          <div class="sparkline">
            <div v-for="(pt, yi) in course.history" :key="yi" class="spark-bar"
              :style="{
                height: ((pt / 80) * 22) + 'px',
                background: yi === course.history.length - 1
                  ? 'var(--gold)'
                  : 'rgba(233,185,73,0.25)'
              }" :title="`${HISTORY_YEARS[yi]}: ${pt}`" />
          </div>
          <span class="text-xs font-semibold whitespace-nowrap"
            :style="{ color: trendColor }">
            {{ trendLabel }}
          </span>
        </div>
      </div>

      <!-- Right -->
      <div class="flex flex-col items-start sm:items-end gap-1.5 sm:pt-5">
        <span class="text-[0.6rem] uppercase tracking-widest text-[var(--text-muted)]">Avg Min Cutoff</span>
        <span class="font-mono text-xl text-gold leading-none">
          {{ course.avgCutoff.toFixed(1) }}
        </span>

        <!-- What-if delta -->
        <span v-if="whatIfActive" class="text-xs font-mono"
          :class="whatIfCourse && whatIfCourse.whatIfScore > course.yourScore ? 'text-success' : 'text-[var(--text-muted)]'">
          {{ whatIfDelta }}
        </span>

        <span class="text-xs text-[var(--text-muted)]">
          You: <strong class="text-[var(--text)]">{{ course.yourScore.toFixed(2) }}</strong>
        </span>

        <span class="inline-block px-2.5 py-0.5 rounded-full text-[0.68rem] font-bold uppercase tracking-wide mt-0.5"
          :class="badgeClass">
          {{ badgeLabel }}
        </span>

        <!-- What-if status change indicator -->
        <span v-if="whatIfActive && whatIfCourse && whatIfCourse.whatIfStatus !== course.status"
          class="text-[0.65rem] font-bold px-2 py-0.5 rounded-full bg-success/15 text-success">
          → {{ whatIfCourse.whatIfStatus }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useShortlistStore }  from '@/stores/useShortlistStore.js'
import { useResultsStore, HISTORY_YEARS } from '@/stores/useResultsStore.js'
import { useGradesStore }     from '@/stores/useGradesStore.js'

const props = defineProps({ course: { type: Object, required: true } })
const emit  = defineEmits(['open'])

const shortlist = useShortlistStore()
const results   = useResultsStore()
const grades    = useGradesStore()

const whatIfActive = computed(() => Object.keys(grades.whatIfOverrides).length > 0)
const whatIfCourse = computed(() => results.whatIfResults.find(r => r.id === props.course.id))
const whatIfDelta  = computed(() => {
  if (!whatIfCourse.value) return ''
  const diff = whatIfCourse.value.whatIfScore - props.course.yourScore
  return diff > 0 ? `+${diff.toFixed(2)} with changes` : ''
})

const trendColor = computed(() => ({
  up:     'var(--red)',
  down:   'var(--green)',
  stable: 'var(--text-muted)',
})[props.course.trendDir])

const trendLabel = computed(() => ({
  up: '↑ Rising', down: '↓ Easing', stable: '→ Stable',
})[props.course.trendDir])

const badgeMap = {
  likely:     { cls: 'bg-success/14 text-success',     lbl: 'Likely'     },
  possible:   { cls: 'bg-warn/14 text-warn',           lbl: 'Possible'   },
  stretch:    { cls: 'bg-danger/14 text-danger',       lbl: 'Stretch'    },
  ineligible: { cls: 'bg-[var(--text-muted)]/10 text-[var(--text-muted)]', lbl: 'Ineligible' },
}
const badgeClass = computed(() => badgeMap[props.course.status]?.cls)
const badgeLabel = computed(() => badgeMap[props.course.status]?.lbl)
</script>
