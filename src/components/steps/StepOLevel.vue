<template>
    <div class="bg-(--bg-surface) border border-(--border-soft) rounded-lg p-6 md:p-7">
        <h2 class="font-display text-2xl font-bold text-(--text) text-center mb-1">O-Level Results (UCE)</h2>
        <p class="text-sm text-(--text-sub) leading-relaxed mb-12 text-center">
            Enter all the grades you obtained. 7 compulsory subjects are pre-loaded — add 1 to 3
            optional subjects to reach your total (min 8, max 10).<br>
            <strong class="text-(--text)">Distinction (1–2) = 0.3 pts · Credit (3–5) = 0.2 pts · Pass (6) = 0.1 pts
                · Fail (7–9) = 0 pts.</strong>
            Maximum O-Level contribution = 3.0 pts.
        </p>

        <!-- Compulsory -->
        <p class="text-xs font-bold uppercase tracking-widest text-gold pb-2 mb-3
              border-b border-(--border)">
            Compulsory Subjects (7)
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-6">
            <SubjectRow v-for="s in grades.compulsorySubjects" :key="s.subject" :entry="s" badge="Core"
                badge-class="bg-gold/10 text-gold-dim" />
        </div>

        <!-- Optional -->
        <p class="text-xs font-bold uppercase tracking-widest text-gold pb-2 mb-3
              border-b border-(--border)">
            Optional Subjects
            <span class="normal-case font-normal tracking-normal text-(--text-muted)">
                &nbsp;{{ grades.optionalChosen.length }}/3 added
            </span>
        </p>
        <div v-if="grades.optionalChosen.length" class="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
            <SubjectRow v-for="(s, idx) in grades.optionalChosen" :key="s.subject" :entry="s" badge="Opt"
                badge-class="bg-(--text-muted)/10 text-(--text-muted)" removable
                @remove="grades.removeOptional(idx)" />
        </div>
        <div v-if="grades.optionalChosen.length < 3" class="flex flex-wrap items-end gap-3 p-4 rounded-md border border-dashed
             border-(--border-soft) bg-(--bg-raised)">
            <div class="flex-1 min-w-48">
                <label class="block text-xs font-bold uppercase tracking-widest
                      text-(--text-muted) mb-1.5">Add Optional Subject</label>
                <select v-model="grades.pendingOptional" class="w-full rounded-md text-sm px-3 py-2.5 appearance-none">
                    <option value="">Choose a subject…</option>
                    <option v-for="s in grades.availableOptionals" :key="s" :value="s">{{ s }}</option>
                </select>
            </div>
            <button @click="grades.addOptional" :disabled="!grades.pendingOptional" class="px-4 py-2.5 rounded-md text-sm font-bold border border-(--border-soft)
               bg-transparent text-(--text-sub) hover:bg-(--bg-hover)
               disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0">
                + Add
            </button>
        </div>

        <!-- Summary -->
        <div v-if="grades.oLevelCount > 0" class="flex flex-wrap gap-6 mt-5 px-5 py-4 rounded-md
             bg-gold/5 border border-gold/15">
            <div class="flex flex-col">
                <span class="font-mono text-xl text-gold font-medium leading-none">
                    {{ grades.oLevelTotal.toFixed(2) }}
                    <span class="text-sm text-(--text-muted) font-sans font-normal">/ 3.00</span>
                </span>
                <span class="text-[0.68rem] uppercase tracking-widest text-(--text-muted) mt-1">O-Level
                    contribution</span>
            </div>
            <div class="flex flex-col">
                <span class="font-mono text-xl text-(--text) font-medium leading-none">
                    {{ grades.oLevelCount }}
                    <span class="text-sm text-(--text-muted) font-sans font-normal">/ {{ grades.totalOCount
                        }}</span>
                </span>
                <span class="text-[0.68rem] uppercase tracking-widest text-(--text-muted) mt-1">Subjects
                    graded</span>
            </div>
            <div class="flex flex-col">
                <span class="font-mono text-xl font-medium leading-none"
                    :class="grades.oLevelCount >= 8 ? 'text-success' : 'text-warn'">
                    {{ grades.oLevelCount >= 8 ? '✓ Ready' : `${grades.oLevelCount}/8` }}
                </span>
                <span class="text-[0.68rem] uppercase tracking-widest text-(--text-muted) mt-1">Minimum
                    requirement</span>
            </div>
        </div>

        <!-- Nav -->
        <div class="flex justify-end items-center mt-7 gap-3">
            <RouterLink to="/" class="px-4 py-2.5 rounded-md text-sm font-bold border border-(--border-soft)
               text-(--text-sub) hover:bg-(--bg-hover) transition-colors">
                ← Home
            </RouterLink>
            <div class="flex flex-col items-end gap-1">
                <button @click="emit('next')" :disabled="grades.oLevelCount < 8" class="px-7 py-2.5 rounded-md text-sm font-bold bg-gold text-navy shadow-gold
                 hover:shadow-gold-lg hover:-translate-y-0.5 transition-all
                 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none">
                    Continue to A-Level →
                </button>
                <p v-if="grades.oLevelCount < 8" class="text-xs text-(--text-muted)">
                    Enter grades for at least 8 subjects ({{ grades.oLevelCount }}/8)
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { useGradesStore } from '@/stores/useGradesStore.js'
    import SubjectRow from './SubjectRow.vue'
    const emit = defineEmits(['next'])
    const grades = useGradesStore()
</script>
