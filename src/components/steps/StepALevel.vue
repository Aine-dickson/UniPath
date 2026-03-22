<template>
    <div class="bg-(--bg-surface) border border-(--border-soft) rounded-lg p-6 md:p-7">
        <h2 class="font-display text-2xl font-bold text-(--text) mb-1 text-center">A-Level Subjects &amp; Grades (UACE)</h2>
        <p class="text-sm text-(--text-sub) leading-relaxed mb-12 text-center max-w-3xl mx-auto">
            Select your 3 principal subjects and grades.
            <strong class="text-(--text)">General Paper (GP) is compulsory</strong>. Select whether you passed (1 point)
            or failed (0 points). Choose one optional subsidiary: Sub Mathematics or Sub ICT.<br>
            Grade scale: <strong class="text-(--text)">A=6 · B=5 · C=4 · D=3 · E=2 · O=1 · F=0</strong>
        </p>

        <!-- Principal subjects -->
        <p class="text-xs font-bold uppercase tracking-widest text-gold pb-2 mb-4
              border-b border-(--border)">Principal Subjects — 3 required</p>

        <div class="flex flex-col gap-3 mb-6">
            <div v-for="(s, idx) in grades.principalSubjects" :key="'p' + idx"
                class="grid grid-cols-[1fr_auto_auto_auto] gap-2.5 items-center">
                <select v-model="s.subject" @change="s.grade = ''" class="rounded-md text-sm px-3 py-2.5">
                    <option value="">Select principal {{ idx + 1 }}…</option>
                    <option v-for="sub in grades.availablePrincipalFor(idx)" :key="sub" :value="sub">
                        {{ sub }}
                    </option>
                </select>

                <span class="text-[0.65rem] font-bold uppercase px-2 py-1 rounded
                     bg-gold/15 text-gold whitespace-nowrap">Principal</span>

                <select v-model="s.grade" :disabled="!s.subject" class="rounded-md text-sm px-3 py-2.5 w-32">
                    <option value="">Grade</option>
                    <option v-for="g in PRINCIPAL_GRADE_LIST" :key="g.val" :value="g.val">{{ g.label }}</option>
                </select>

                <button v-if="s.subject" @click="grades.clearPrincipal(idx)"
                    class="text-(--text-muted) hover:text-danger transition-colors text-sm px-1">✕</button>
                <span v-else class="w-5"></span>
            </div>
        </div>

        <!-- Subsidiary subjects -->
        <p class="text-xs font-bold uppercase tracking-widest text-gold pb-2 mb-4
              border-b border-(--border)">Subsidiary Subjects</p>

        <!-- GP compulsory row -->
        <div class="grid grid-cols-[1fr_auto_auto] gap-2.5 items-center mb-3">
            <div class="flex items-center justify-between px-3 py-2.5 rounded-md
                  bg-(--bg-raised) border border-(--border-soft)">
                <span class="text-sm text-(--text)">General Paper (GP)</span>
            </div>
            <span class="text-[0.65rem] font-bold uppercase px-2 py-1 rounded
                   bg-success/12 text-success whitespace-nowrap">Compulsory</span>
            <select v-model="grades.gpGrade" class="rounded-md text-sm px-3 py-2.5 w-32">
                <option value="">Grade</option>
                <option value="S">O — 1 pt</option>
                <option value="F">F — 0 pts</option>
            </select>
        </div>

        <!-- Optional sub row -->
        <div class="grid grid-cols-[1fr_auto_auto] gap-2.5 items-center">
            <select v-model="grades.optionalSub" class="rounded-md text-sm px-3 py-2.5">
                <option value="">No additional subsidiary…</option>
                <option value="Sub Mathematics">Sub Mathematics</option>
                <option value="Sub ICT">Sub ICT</option>
            </select>
            <span class="text-[0.65rem] font-bold uppercase px-2 py-1 rounded
                   bg-(--text-muted)/12 text-(--text-muted) whitespace-nowrap">
                Optional Sub
            </span>
            <select v-model="grades.optionalSubGrade" :disabled="!grades.optionalSub"
                class="rounded-md text-sm px-3 py-2.5 w-32">
                <option value="">Grade</option>
                <option value="S">O — 1 pt</option>
                <option value="F">F — 0 pts</option>
            </select>
        </div>

        <!-- Live formula preview -->
        <div v-if="grades.anyPrincipalFilled"
            class="mt-6 bg-(--bg-raised) border border-(--border) rounded-md p-5">
            <p class="text-xs font-bold uppercase tracking-widest text-gold mb-4">
                Live Score Preview
                <span class="normal-case font-normal tracking-normal text-(--text-muted)">
                    — principals shown as raw pts; course weights applied on results page
                </span>
            </p>

            <div class="flex flex-col divide-y divide-(--border-soft)">
                <div v-for="s in filledPrincipals" :key="s.subject"
                    class="grid grid-cols-[1fr_3rem_4rem_4rem] gap-2 items-center py-2.5 text-sm">
                    <span class="text-(--text)">
                        {{ s.subject }}
                        <span class="text-[0.6rem] font-bold uppercase px-1.5 py-0.5 rounded
                         bg-gold/15 text-gold ml-1.5">Principal</span>
                    </span>
                    <span class="font-mono text-gold text-center">{{ s.grade }}</span>
                    <span class="font-mono text-(--text-muted) text-xs text-center">×2–3</span>
                    <span class="font-mono text-success font-semibold text-right">
                        {{ GRADE_POINTS[s.grade] }} raw
                    </span>
                </div>

                <div class="grid grid-cols-[1fr_3rem_4rem_4rem] gap-2 items-center py-2.5 text-sm">
                    <span class="text-(--text)">
                        General Paper
                        <span class="text-[0.6rem] font-bold uppercase px-1.5 py-0.5 rounded
                         bg-(--text-muted)/12 text-(--text-muted) ml-1.5">Sub</span>
                    </span>
                    <span class="font-mono text-gold text-center">{{ grades.gpGrade === 'S' ? 'O' : 'F' }}</span>
                    <span class="font-mono text-(--text-muted) text-xs text-center">×1</span>
                    <span class="font-mono text-success font-semibold text-right">{{ grades.gpGrade === 'S' ? 1 : 0 }}</span>
                </div>

                <div v-if="grades.optionalSub && grades.optionalSubGrade"
                    class="grid grid-cols-[1fr_3rem_4rem_4rem] gap-2 items-center py-2.5 text-sm">
                    <span class="text-(--text)">
                        {{ grades.optionalSub }}
                        <span class="text-[0.6rem] font-bold uppercase px-1.5 py-0.5 rounded
                         bg-(--text-muted)/12 text-(--text-muted) ml-1.5">Sub</span>
                    </span>
                    <span class="font-mono text-gold text-center">{{ grades.optionalSubGrade === 'S' ? 'O' : 'F' }}</span>
                    <span class="font-mono text-(--text-muted) text-xs text-center">×1</span>
                    <span class="font-mono text-success font-semibold text-right">
                        {{ grades.optionalSubGrade === 'S' ? 1 : 0 }}
                    </span>
                </div>

                <div class="grid grid-cols-[1fr_3rem_4rem_4rem] gap-2 items-center py-2.5 text-sm">
                    <span class="text-(--text)">
                        O-Level Contribution
                        <span class="text-[0.6rem] font-bold uppercase px-1.5 py-0.5 rounded
                         bg-warn/12 text-warn ml-1.5">UCE</span>
                    </span>
                    <span></span><span></span>
                    <span class="font-mono text-warn font-semibold text-right">
                        +{{ grades.oLevelTotal.toFixed(2) }}
                    </span>
                </div>

                <!-- Total row -->
                <div class="grid grid-cols-[1fr_auto] gap-2 items-center pt-3 mt-1">
                    <span class="text-xs text-(--text-muted)">
                        Sub + O-Level base (principals weighted per course)
                    </span>
                    <span class="font-display text-2xl font-black text-gold">
                        {{ (grades.subsidiaryPts + grades.oLevelTotal).toFixed(2) }}
                    </span>
                </div>
            </div>
        </div>

        <!-- Nav -->
        <div class="flex justify-end items-center mt-7 gap-3">
            <button @click="emit('back')" class="px-4 py-2.5 rounded-md text-sm font-bold border border-(--border-soft)
               text-(--text-sub) hover:bg-(--bg-hover) transition-colors">
                ← Back
            </button>
            <div class="flex flex-col items-end gap-1">
                <button @click="emit('next')" :disabled="grades.principalsFilled < 2 || !grades.gpGrade" class="px-7 py-2.5 rounded-md text-sm font-bold bg-gold text-navy shadow-gold
                 hover:shadow-gold-lg hover:-translate-y-0.5 transition-all
                 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none">
                    See Eligible Courses →
                </button>
                <p v-if="grades.principalsFilled < 2" class="text-xs text-(--text-muted)">
                    Enter at least 2 principal subjects with grades
                </p>
                <p v-else-if="!grades.gpGrade" class="text-xs text-(--text-muted)">
                    Select General Paper as pass or fail
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { computed } from 'vue'
    import { useGradesStore, GRADE_POINTS, PRINCIPAL_GRADE_LIST } from '@/stores/useGradesStore.js'

    const emit = defineEmits(['next', 'back'])
    const grades = useGradesStore()

    const filledPrincipals = computed(() =>
        grades.principalSubjects.filter(s => s.subject && s.grade)
    )
</script>
