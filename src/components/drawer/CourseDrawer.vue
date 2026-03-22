<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="course" class="fixed inset-0 z-[200] flex items-start justify-end"
        style="background: rgba(13,20,33,0.78); backdrop-filter: blur(6px);"
        @click.self="emit('close')">

        <div class="drawer-panel w-[500px] max-w-full h-screen overflow-y-auto
                    bg-[var(--bg-surface)] border-l border-[var(--border-soft)] p-7 flex flex-col gap-0">

          <!-- Header -->
          <div class="flex justify-between items-start mb-0.5">
            <div class="flex-1 pr-4">
              <h2 class="font-display text-xl font-bold text-[var(--text)] leading-snug">
                {{ course.name }}
              </h2>
              <p class="text-sm text-[var(--text-muted)] mt-1">
                {{ course.university }} · {{ course.faculty }} · {{ course.duration }}
              </p>
            </div>
            <button @click="emit('close')"
              class="text-[var(--text-muted)] hover:text-[var(--text)] text-xl
                     leading-none flex-shrink-0 transition-colors mt-0.5">✕</button>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-2 gap-2.5 mt-4">
            <div class="bg-[var(--bg-raised)] border border-[var(--border-soft)] rounded-md p-3.5">
              <div class="font-mono text-xl text-gold">{{ course.avgCutoff.toFixed(1) }}</div>
              <div class="text-[0.65rem] uppercase tracking-widest text-[var(--text-muted)] mt-1">Avg min cutoff (5yr)</div>
            </div>
            <div class="bg-[var(--bg-raised)] border border-[var(--border-soft)] rounded-md p-3.5">
              <div class="font-mono text-xl"
                :style="{ color: statusColor }">{{ course.yourScore.toFixed(2) }}</div>
              <div class="text-[0.65rem] uppercase tracking-widest text-[var(--text-muted)] mt-1">Your weighted score</div>
            </div>
          </div>

          <!-- Career -->
          <SectionHeading>Career Pathways</SectionHeading>
          <div class="bg-gold/5 border border-gold/15 rounded-md p-4
                      text-sm text-[var(--text-sub)] leading-relaxed">
            {{ course.career }}
          </div>

          <!-- Core units -->
          <SectionHeading>Major Core Units</SectionHeading>
          <div class="flex flex-wrap gap-2">
            <span v-for="unit in course.coreUnits" :key="unit"
              class="text-sm bg-[var(--bg-raised)] border border-[var(--border-soft)]
                     rounded-full px-3 py-1 text-[var(--text-sub)]">
              {{ unit }}
            </span>
          </div>

          <!-- Breakdown -->
          <SectionHeading>Weighted Score Breakdown</SectionHeading>
          <div class="divide-y divide-[var(--border-soft)]">
            <div v-for="row in course.breakdown" :key="row.label"
              class="grid grid-cols-[1fr_auto_auto] gap-3 items-center py-2.5 text-sm">
              <span class="text-[var(--text)]">
                {{ row.label }}
                <span class="text-[0.6rem] font-bold uppercase px-1.5 py-0.5 rounded ml-1.5"
                  :class="pillClass(row.pillClass)">{{ row.type }}</span>
              </span>
              <span class="font-mono text-[var(--text-muted)] text-xs">{{ row.calc }}</span>
              <span class="font-mono text-success font-semibold text-right">{{ row.score.toFixed(2) }}</span>
            </div>
          </div>
          <div class="flex justify-between items-center pt-3 mt-1 border-t-2 border-[var(--border)]">
            <span class="text-sm font-bold text-[var(--text)]">Total Weighted Score</span>
            <span class="font-display text-2xl font-black text-gold">{{ course.yourScore.toFixed(2) }}</span>
          </div>

          <!-- History table -->
          <SectionHeading>Historical Minimum Cutoff Points</SectionHeading>
          <table class="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th class="text-left py-2 px-2 text-[0.65rem] uppercase tracking-widest text-[var(--text-muted)] border-b border-[var(--border)]">Year</th>
                <th class="text-left py-2 px-2 text-[0.65rem] uppercase tracking-widest text-[var(--text-muted)] border-b border-[var(--border)]">Min Cutoff</th>
                <th class="text-left py-2 px-2 text-[0.65rem] uppercase tracking-widest text-[var(--text-muted)] border-b border-[var(--border)]">Gap (You)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(pt, yi) in course.history" :key="yi"
                class="border-b border-[var(--border-soft)]">
                <td class="py-2.5 px-2">{{ HISTORY_YEARS[yi] }}</td>
                <td class="py-2.5 px-2 font-mono">{{ pt }}</td>
                <td class="py-2.5 px-2 font-mono font-semibold"
                  :class="course.yourScore >= pt ? 'text-success' : 'text-danger'">
                  {{ course.yourScore >= pt ? '+' : '' }}{{ (course.yourScore - pt).toFixed(2) }}
                </td>
              </tr>
              <tr class="font-semibold text-gold">
                <td class="py-2.5 px-2">You (est.)</td>
                <td class="py-2.5 px-2 font-mono">{{ course.yourScore.toFixed(2) }}</td>
                <td class="py-2.5 px-2">—</td>
              </tr>
            </tbody>
          </table>

          <!-- A-Level requirements -->
          <SectionHeading>A-Level Requirements</SectionHeading>
          <div class="flex flex-col gap-2.5">
            <ReqItem :met="course.reqCheck.ess1.met">
              <strong>Essential 1:</strong> {{ course.essentials[0] }} (×3) —
              <span :class="course.reqCheck.ess1.met ? 'text-success' : 'text-danger'">
                {{ course.reqCheck.ess1.met ? 'You have this' : 'Missing — ineligible' }}
              </span>
            </ReqItem>
            <ReqItem :met="course.reqCheck.ess2.met">
              <strong>Essential 2:</strong> {{ course.essentials[1] }} (×3) —
              <span :class="course.reqCheck.ess2.met ? 'text-success' : 'text-danger'">
                {{ course.reqCheck.ess2.met ? 'You have this' : 'Missing — ineligible' }}
              </span>
            </ReqItem>
            <ReqItem :met="course.reqCheck.rel.met" warn>
              <strong>Relevant:</strong> {{ course.relevant }} (×2) —
              <span :class="course.reqCheck.rel.met ? 'text-success' : 'text-warn'">
                {{ course.reqCheck.rel.met ? 'You have this' : 'Not held — best remaining principal substituted' }}
              </span>
            </ReqItem>
          </div>

          <!-- O-Level requirements -->
          <SectionHeading>O-Level Requirements</SectionHeading>
          <div class="flex flex-col gap-2.5">
            <ReqItem v-for="req in course.oReqs" :key="req.subj" :met="req.met">
              {{ req.subj }} — {{ req.met ? 'Passed ✓' : 'Fail or not entered' }}
            </ReqItem>
          </div>

          <!-- Shortlist button -->
          <div class="mt-6 pt-4 border-t border-[var(--border-soft)]">
            <button @click="shortlist.toggle(course)"
              class="w-full flex items-center justify-center gap-2 py-3 rounded-md
                     text-sm font-bold transition-all"
              :class="shortlist.isShortlisted(course.id)
                ? 'border-[1.5px] border-[var(--border-soft)] text-[var(--text-sub)] hover:bg-[var(--bg-hover)]'
                : 'bg-gold text-navy shadow-gold hover:shadow-gold-lg hover:-translate-y-0.5'">
              {{ shortlist.isShortlisted(course.id) ? '★ Remove from Shortlist' : '☆ Add to Shortlist' }}
            </button>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { useShortlistStore }  from '@/stores/useShortlistStore.js'
import { HISTORY_YEARS }      from '@/stores/useResultsStore.js'
import SectionHeading from './SectionHeading.vue'
import ReqItem        from './ReqItem.vue'

const props = defineProps({ course: { type: Object, default: null } })
const emit  = defineEmits(['close'])

const shortlist = useShortlistStore()

const statusColor = computed(() => ({
  likely:     'var(--green)',
  possible:   'var(--amber)',
  stretch:    'var(--red)',
  ineligible: 'var(--text-muted)',
})[props.course?.status])

function pillClass(key) {
  return {
    'tt-ess': 'bg-gold/18 text-gold',
    'tt-rel': 'bg-success/14 text-success',
    'tt-sub': 'bg-[var(--text-muted)]/12 text-[var(--text-muted)]',
    'tt-ol':  'bg-warn/12 text-warn',
  }[key] ?? ''
}
</script>
