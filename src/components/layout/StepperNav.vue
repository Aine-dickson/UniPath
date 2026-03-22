<template>
  <div class="flex overflow-hidden rounded-md border border-(--border-soft)
              bg-(--bg-surface) mb-7">
    <div v-for="(s, idx) in steps" :key="s.id"
      class="flex-1 flex items-center gap-2.5 px-4 py-3.5 cursor-pointer
             border-r border-(--border-soft) last:border-r-0
             transition-colors hover:bg-(--bg-raised)"
      :class="{ 'bg-(--bg-raised)': currentStep === s.id }"
      @click="emit('goto', s.id)">

      <div class="w-7 h-7 rounded-full shrink-0 flex items-center justify-center
                  font-mono text-xs font-medium border-[1.5px] transition-all"
        :class="stepNumClass(s.id)">
        {{ currentStep > s.id ? '✓' : s.id }}
      </div>

      <div>
        <div class="text-sm font-semibold leading-tight"
          :class="currentStep === s.id ? 'text-(--text)' : 'text-(--text-muted)'">
          {{ s.title }}
        </div>
        <div class="text-[0.68rem] text-(--text-muted) opacity-70 mt-0.5">{{ s.hint }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ currentStep: Number })
const emit  = defineEmits(['goto'])

const steps = [
  { id: 1, title: 'O-Level Grades',   hint: 'UCE — 8 to 10 subjects' },
  { id: 2, title: 'A-Level Subjects', hint: 'UACE — 3 principal + GP + 1 optional sub' },
  { id: 3, title: 'Eligible Courses', hint: 'Weighted cutoff results' },
]

function stepNumClass(id) {
  if (props.currentStep > id)  return 'bg-success text-navy-DEFAULT border-success'
  if (props.currentStep === id) return 'bg-gold text-navy-DEFAULT border-gold'
  return 'bg-[var(--bg)] border-gold-dim text-gold'
}
</script>
