<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="open" class="fixed inset-0 z-[200] flex items-start justify-end"
        style="background: rgba(13,20,33,0.78); backdrop-filter: blur(6px);"
        @click.self="emit('close')">

        <div class="drawer-panel w-[440px] max-w-full h-screen overflow-y-auto
                    bg-[var(--bg-surface)] border-l border-[var(--border-soft)] p-7">

          <div class="flex items-center justify-between mb-6">
            <h2 class="font-display text-xl font-bold text-[var(--text)]">★ Your Shortlist</h2>
            <button @click="emit('close')"
              class="text-[var(--text-muted)] hover:text-[var(--text)] text-xl transition-colors">✕</button>
          </div>

          <p v-if="!shortlist.details.length"
            class="text-center py-12 text-sm text-[var(--text-muted)]">
            No courses shortlisted yet.<br>Click ☆ on any course card to add it here.
          </p>

          <div v-else class="flex flex-col gap-2.5">
            <div v-for="c in shortlist.details" :key="c.id"
              class="flex items-center gap-3 bg-[var(--bg-raised)] border border-[var(--border-soft)]
                     rounded-md px-4 py-3.5">
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-[var(--text)] leading-snug truncate">{{ c.name }}</p>
                <p class="text-xs text-[var(--text-muted)] mt-0.5">{{ c.university }} · {{ c.faculty }}</p>
              </div>
              <div class="flex flex-col items-end gap-1 flex-shrink-0">
                <span class="font-mono text-sm text-gold">
                  {{ c.yourScore.toFixed(1) }} / {{ c.avgCutoff.toFixed(1) }}
                </span>
                <span class="text-[0.65rem] font-bold uppercase px-2 py-0.5 rounded-full"
                  :class="badgeClass(c.status)">
                  {{ c.status }}
                </span>
              </div>
              <button @click="shortlist.toggle(c)"
                class="text-[var(--text-muted)] hover:text-danger transition-colors ml-1 text-sm">✕</button>
            </div>

            <p class="text-center text-xs text-[var(--text-muted)] pt-2">
              {{ shortlist.details.length }} course{{ shortlist.details.length !== 1 ? 's' : '' }} shortlisted
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { useShortlistStore } from '@/stores/useShortlistStore.js'

defineProps({ open: Boolean })
const emit = defineEmits(['close'])

const shortlist = useShortlistStore()

function badgeClass(status) {
  return {
    likely:     'bg-success/14 text-success',
    possible:   'bg-warn/14 text-warn',
    stretch:    'bg-danger/14 text-danger',
    ineligible: 'bg-[var(--text-muted)]/10 text-[var(--text-muted)]',
  }[status] ?? ''
}
</script>
