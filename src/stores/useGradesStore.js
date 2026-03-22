import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// ── O-Level constants ─────────────────────────────────────────
export const COMPULSORY_SUBJECTS = [
    'Mathematics', 'English Language', 'Biology',
    'Physics', 'Chemistry', 'History', 'Geography',
]
export const OPTIONAL_POOL = [
    'Art & Design', 'Commerce', 'Entrepreneurship', 'Computer Studies',
    'Christian Religious Education (CRE)', 'Islamic Religious Education (IRE)',
    'Literature in English', 'Luganda', 'Runyankore/Rukiga', 'Lusoga',
    'Ateso', 'Luo', 'Music', 'Agriculture', 'Physical Education',
    'Technical Drawing', 'Food & Nutrition',
]

// ── A-Level constants ─────────────────────────────────────────
export const ALL_PRINCIPAL_SUBJECTS = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Geography',
    'History', 'Economics', 'Entrepreneurship', 'Art', 'Music',
    'Agriculture', 'Computer Studies', 'Technical Drawing',
    'Christian Religious Education', 'Literature in English',
    'French', 'Kiswahili', 'Luganda',
]

export const GRADE_POINTS = { A: 6, B: 5, C: 4, D: 3, E: 2, O: 1, F: 0 }

export const PRINCIPAL_GRADE_LIST = [
    { val: 'A', label: 'A — 6 pts' },
    { val: 'B', label: 'B — 5 pts' },
    { val: 'C', label: 'C — 4 pts' },
    { val: 'D', label: 'D — 3 pts' },
    { val: 'E', label: 'E — 2 pts' },
    { val: 'O', label: 'O — 1 pt' },
    { val: 'F', label: 'F — 0 pts' },
]

export const O_GRADES = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

// O-Level grade → contribution points
export function oContrib(grade) {
    const g = parseInt(grade)
    if (!g) return 0
    if (g <= 2) return 0.3
    if (g <= 5) return 0.2
    if (g === 6) return 0.1
    return 0.0
}

export const useGradesStore = defineStore('grades', () => {
    // ── O-Level ──────────────────────────────────────────────
    const compulsorySubjects = ref(COMPULSORY_SUBJECTS.map(s => ({ subject: s, grade: '' })))
    const optionalChosen = ref([])
    const pendingOptional = ref('')

    const availableOptionals = computed(() =>
        OPTIONAL_POOL.filter(s => !optionalChosen.value.some(o => o.subject === s))
    )
    const allOLevel = computed(() => [...compulsorySubjects.value, ...optionalChosen.value])
    const oLevelTotal = computed(() =>
        Math.min(3.0, allOLevel.value.reduce((sum, e) => sum + oContrib(e.grade), 0))
    )
    const oLevelCount = computed(() => allOLevel.value.filter(e => e.grade).length)
    const totalOCount = computed(() => allOLevel.value.length)

    function addOptional() {
        if (!pendingOptional.value || optionalChosen.value.length >= 3) return
        optionalChosen.value.push({ subject: pendingOptional.value, grade: '' })
        pendingOptional.value = ''
    }
    function removeOptional(idx) { optionalChosen.value.splice(idx, 1) }

    // O-Level grade lookup by subject name (fuzzy)
    function oGradeVal(subj) {
        const entry = allOLevel.value.find(x =>
            x.subject.toLowerCase().includes(subj.toLowerCase()) ||
            subj.toLowerCase().includes(x.subject.toLowerCase().split(' ')[0])
        )
        return entry ? parseInt(entry.grade) || 99 : 99
    }
    function oMet(subj) { return oGradeVal(subj) <= 6 }

    // ── A-Level ───────────────────────────────────────────────
    const principalSubjects = ref([
        { subject: '', grade: '' },
        { subject: '', grade: '' },
        { subject: '', grade: '' },
    ])
    const gpGrade = ref('')   // 'S' | 'F' | '' (compulsory selection)
    const optionalSub = ref('')   // 'Sub Mathematics' | 'Sub ICT' | ''
    const optionalSubGrade = ref('')   // 'S' | 'F' | ''

    const usedPrincipal = computed(() =>
        principalSubjects.value.map(s => s.subject).filter(Boolean)
    )

    function availablePrincipalFor(idx) {
        const others = principalSubjects.value
            .filter((_, i) => i !== idx)
            .map(s => s.subject)
            .filter(Boolean)
        return ALL_PRINCIPAL_SUBJECTS.filter(s => !others.includes(s))
    }
    function clearPrincipal(idx) {
        principalSubjects.value[idx] = { subject: '', grade: '' }
    }

    const principalsFilled = computed(() =>
        principalSubjects.value.filter(s => s.subject && s.grade).length
    )
    const anyPrincipalFilled = computed(() =>
        principalSubjects.value.some(s => s.subject && s.grade)
    )
    // GP = 1 if S, 0 if F; optional sub = 1 if S
    const subsidiaryPts = computed(() =>
        (gpGrade.value === 'S' ? 1 : 0) +
        (optionalSub.value && optionalSubGrade.value === 'S' ? 1 : 0)
    )

    // ── What-If overrides ─────────────────────────────────────
    // Maps subject → hypothetical grade override
    const whatIfOverrides = ref({}) // { 'Mathematics': 'A', ... }

    function setWhatIf(subject, grade) {
        whatIfOverrides.value[subject] = grade
    }
    function clearWhatIf() {
        whatIfOverrides.value = {}
    }

    // Effective grade for a principal subject (respects what-if)
    function effectiveGrade(subject) {
        return whatIfOverrides.value[subject] ??
            (principalSubjects.value.find(s => s.subject === subject)?.grade ?? null)
    }

    return {
        // O-Level
        compulsorySubjects, optionalChosen, pendingOptional,
        availableOptionals, allOLevel, oLevelTotal, oLevelCount, totalOCount,
        addOptional, removeOptional, oGradeVal, oMet,
        // A-Level
        principalSubjects, gpGrade, optionalSub, optionalSubGrade,
        usedPrincipal, availablePrincipalFor, clearPrincipal,
        principalsFilled, anyPrincipalFilled, subsidiaryPts,
        // What-if
        whatIfOverrides, setWhatIf, clearWhatIf, effectiveGrade,
    }
})
