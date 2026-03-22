<template>
  <div class="bg-(--bg-surface) border border-(--border-soft) rounded-lg p-5 mb-5">
    <!-- Header -->
    <div class="flex items-center justify-between mb-1 gap-3 flex-wrap">
      <div class="flex items-center gap-2.5">
        <span class="text-xl">🔮</span>
        <div>
          <h3 class="font-display font-bold text-(--text) text-base leading-tight">
            Potential Simulator
          </h3>
          <p class="text-xs text-(--text-muted) mt-0.5">
            Adjust a grade to see how your course eligibility changes in real time
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span v-if="hasOverrides"
          class="text-xs font-semibold text-warn bg-warn/10 px-2.5 py-1 rounded-full">
          {{ overrideCount }} override{{ overrideCount !== 1 ? 's' : '' }} active
        </span>
        <button @click="grades.clearWhatIf()"
          v-if="hasOverrides"
          class="text-xs font-semibold text-(--text-muted) hover:text-danger
                 border border-(--border-soft)] px-2.5 py-1 rounded-full transition-colors">
          Reset
        </button>
        <button @click="expanded = !expanded"
          class="text-xs font-semibold px-2.5 py-1 rounded-full border border-(--border-soft)]
                 text-(--text-muted) hover:bg-(--bg-hover) transition-colors">
          {{ expanded ? 'Hide ↑' : 'Expand ↓' }}
        </button>
      </div>
    </div>

    <!-- Sliders (expandable) -->
    <Transition name="fade">
      <div v-if="expanded" class="mt-4 flex flex-col gap-4 pt-4 border-t border-(--border-soft)">

        <div v-for="s in activePrincipals" :key="s.subject" class="flex flex-col gap-1.5">
          <div class="flex items-center justify-between">
            <span class="text-sm font-semibold text-(--text)">{{ s.subject }}</span>
            <div class="flex items-center gap-2">
              <span class="font-mono text-xs text-(--text-muted) line-through">
                {{ s.grade }}
              </span>
              <span class="font-mono text-sm font-bold text-gold w-6 text-center">
                {{ currentGrade(s.subject) }}
              </span>
              <span class="font-mono text-xs"
                :class="ptsDiff(s.subject) > 0 ? 'text-success' : ptsDiff(s.subject) < 0 ? 'text-danger' : 'text-(--text-muted)'">
                {{ ptsDiff(s.subject) > 0 ? '+' : '' }}{{ ptsDiff(s.subject) !== 0 ? ptsDiff(s.subject) : '' }}
              </span>
            </div>
          </div>

          <input type="range" class="grade-slider w-full"
            :min="0" :max="6" :value="gradeIndex(s.subject)"
            @input="onSlider(s.subject, $event.target.value)" />

          <div class="flex justify-between text-[0.6rem] font-mono text-(--text-muted) px-0.5">
            <span>F</span><span>O</span><span>E</span><span>D</span><span>C</span><span>B</span><span>A</span>
          </div>
        </div>

        <!-- Impact summary -->
        <div v-if="hasOverrides && impactSummary.length"
          class="bg-gold/5 border border-gold/15 rounded-md p-4 mt-1">
          <p class="text-xs font-bold uppercase tracking-widest text-gold mb-2.5">Impact Summary</p>
          <div class="flex flex-col gap-1.5">
            <div v-for="item in impactSummary" :key="item.name"
              class="flex items-center justify-between text-sm gap-3">
              <span class="text-(--text) truncate flex-1 min-w-0">{{ item.name }}</span>
              <div class="flex items-center gap-2 shrink-0">
                <span class="font-mono text-xs px-1.5 py-0.5 rounded"
                  :class="statusClass(item.oldStatus)">{{ item.oldStatus }}</span>
                <span class="text-(--text-muted)] text-xs">→</span>
                <span class="font-mono text-xs px-1.5 py-0.5 rounded"
                  :class="statusClass(item.newStatus)">{{ item.newStatus }}</span>
              </div>
            </div>
          </div>
        </div>

        <p v-if="!hasOverrides" class="text-xs text-(--text-muted) text-center py-2">
          Move a slider to simulate a different grade
        </p>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useGradesStore, GRADE_POINTS } from '@/stores/useGradesStore.js'
import { useResultsStore }              from '@/stores/useResultsStore.js'

const grades  = useGradesStore()
const results = useResultsStore()

const expanded = ref(false)

const GRADE_ORDER = ['F', 'O', 'E', 'D', 'C', 'B', 'A']

const activePrincipals = computed(() =>
  grades.principalSubjects.filter(s => s.subject && s.grade)
)

const hasOverrides   = computed(() => Object.keys(grades.whatIfOverrides).length > 0)
const overrideCount  = computed(() => Object.keys(grades.whatIfOverrides).length)

function gradeIndex(subject) {
  const g = grades.whatIfOverrides[subject] ??
    grades.principalSubjects.find(s => s.subject === subject)?.grade ?? 'F'
  return GRADE_ORDER.indexOf(g)
}

function currentGrade(subject) {
  return grades.whatIfOverrides[subject] ??
    grades.principalSubjects.find(s => s.subject === subject)?.grade ?? 'F'
}

function ptsDiff(subject) {
  const orig = GRADE_POINTS[grades.principalSubjects.find(s => s.subject === subject)?.grade ?? 'F'] ?? 0
  const curr = GRADE_POINTS[currentGrade(subject)] ?? 0
  return curr - orig
}

function onSlider(subject, idx) {
  const g = GRADE_ORDER[parseInt(idx)]
  const orig = grades.principalSubjects.find(s => s.subject === subject)?.grade
  if (g === orig) {
    const overrides = { ...grades.whatIfOverrides }
    delete overrides[subject]
    grades.whatIfOverrides = overrides
  } else {
    grades.setWhatIf(subject, g)
  }
}

const impactSummary = computed(() => {
  if (!hasOverrides.value) return []
  return results.whatIfResults
    .filter(r => r.whatIfStatus !== r.status)
    .slice(0, 8)
    .map(r => ({
      name:      r.name,
      oldStatus: r.status,
      newStatus: r.whatIfStatus,
    }))
})

function statusClass(s) {
  return {
    likely:     'bg-success/14 text-success',
    possible:   'bg-warn/14 text-warn',
    stretch:    'bg-danger/14 text-danger',
    ineligible: 'bg-[var(--text-muted)]/10 text-[var(--text-muted)]',
  }[s] ?? ''
}
</script>
