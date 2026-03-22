import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useGradesStore, GRADE_POINTS, oContrib } from './useGradesStore.js'

export const HISTORY_YEARS = ['2020', '2021', '2022', '2023', '2024']

// UNEB principal grade → KCSE cluster points (out of 12 per subject)
const UNEB_TO_KCSE = { A: 12, B: 11, C: 9, D: 7, E: 5, O: 3, F: 0 }
function unebToKcse(grade) { return UNEB_TO_KCSE[grade] ?? 0 }

export const useResultsStore = defineStore('results', () => {
    const grades = useGradesStore()

    const allCourses = ref([])        // raw JSON loaded once
    const results = ref([])        // computed results after scoring
    const selectedCountry = ref('ug')
    const filterStatus = ref('all')
    const filterFaculty = ref('')
    const filterUniversity = ref('')

    // Load course data from public JSON
    async function loadCourses() {
        if (allCourses.value.length) return
        const res = await fetch('/data/courses.json')
        allCourses.value = await res.json()
    }

    // ── Core scoring engine ────────────────────────────────────
    function scoreForCourse(course, useWhatIf = false) {
        // Build subject→points map
        const myMap = {}
        const grade = useWhatIf
            ? (subj) => grades.whatIfOverrides[subj] ?? grades.principalSubjects.find(s => s.subject === subj)?.grade
            : (subj) => grades.principalSubjects.find(s => s.subject === subj)?.grade

        grades.principalSubjects.filter(s => s.subject && s.grade).forEach(s => {
            const g = useWhatIf ? (grades.whatIfOverrides[s.subject] ?? s.grade) : s.grade
            if (!g) return
            myMap[s.subject] = course.country === 'ke'
                ? unebToKcse(g)
                : (GRADE_POINTS[g] ?? 0)
        })

        const ess1pts = myMap[course.essentials[0]] ?? null
        const ess2pts = myMap[course.essentials[1]] ?? null
        const relPts = myMap[course.relevant] ?? null

        const ess1Met = ess1pts !== null
        const ess2Met = ess2pts !== null
        const relMet = relPts !== null
        const eligible = ess1Met && ess2Met

        // Relevant substitution: best remaining principal
        const remainPts = Object.entries(myMap)
            .filter(([k]) => k !== course.essentials[0] && k !== course.essentials[1])
            .map(([, v]) => v)
        const relVal = relMet ? relPts : (remainPts.length > 0 ? Math.max(...remainPts) : 0)

        const e1 = (ess1pts ?? 0) * 3
        const e2 = (ess2pts ?? 0) * 3
        const r = relVal * 2
        const subPts = grades.subsidiaryPts
        const olPts = grades.oLevelTotal
        const total = e1 + e2 + r + subPts + olPts

        const optSubLabel = grades.optionalSub
            ? `GP + ${grades.optionalSub}`
            : 'GP only'

        const breakdown = [
            { label: course.essentials[0], type: 'Ess ×3', pillClass: 'tt-ess', calc: `${ess1pts ?? 0} × 3`, score: e1 },
            { label: course.essentials[1], type: 'Ess ×3', pillClass: 'tt-ess', calc: `${ess2pts ?? 0} × 3`, score: e2 },
            { label: course.relevant + (relMet ? '' : ' (sub.)'), type: 'Rel ×2', pillClass: 'tt-rel', calc: `${relVal} × 2`, score: r },
            { label: optSubLabel, type: 'Sub ×1', pillClass: 'tt-sub', calc: `${subPts} × 1`, score: subPts },
            { label: 'O-Level Contribution', type: 'UCE', pillClass: 'tt-ol', calc: olPts.toFixed(2), score: olPts },
        ]

        const oReqs = course.oLevelRequired.map(subj => ({
            subj,
            met: grades.oMet(subj),
        }))
        const oRequirementsMet = oReqs.every(r => r.met)

        return {
            total, eligible, breakdown,
            reqCheck: { ess1: { met: ess1Met }, ess2: { met: ess2Met }, rel: { met: relMet } },
            oReqs, oRequirementsMet,
        }
    }

    function computeResults() {
        const country = selectedCountry.value
        results.value = allCourses.value
            .filter(c => c.country === country)
            .map(course => {
                const { total, eligible, breakdown, reqCheck, oReqs, oRequirementsMet } =
                    scoreForCourse(course)

                const avgCutoff = course.history.reduce((a, b) => a + b, 0) / course.history.length
                const minCutoff = Math.min(...course.history)
                const trendDiff = course.history[4] - course.history[0]
                const trendDir = trendDiff > 1 ? 'up' : trendDiff < -1 ? 'down' : 'stable'

                let status
                if (!eligible || !oRequirementsMet) status = 'ineligible'
                else if (total >= avgCutoff + 2) status = 'likely'
                else if (total >= minCutoff) status = 'possible'
                else status = 'stretch'

                return { ...course, yourScore: total, avgCutoff, minCutoff, trendDir, status, breakdown, reqCheck, oReqs }
            })

        filterStatus.value = 'all'
        filterFaculty.value = ''
        filterUniversity.value = ''
    }

    // What-if version of results (re-scores with overrides)
    const whatIfResults = computed(() => {
        if (!results.value.length) return []
        return results.value.map(course => {
            const { total } = scoreForCourse(course, true)
            const avgCutoff = course.avgCutoff
            const minCutoff = course.minCutoff
            let status
            const eligible = course.reqCheck.ess1.met && course.reqCheck.ess2.met
            if (!eligible || !course.oReqs.every(r => r.met)) status = 'ineligible'
            else if (total >= avgCutoff + 2) status = 'likely'
            else if (total >= minCutoff) status = 'possible'
            else status = 'stretch'
            return { ...course, whatIfScore: total, whatIfStatus: status }
        })
    })

    const filteredResults = computed(() =>
        results.value
            .filter(r =>
                (filterStatus.value === 'all' || r.status === filterStatus.value) &&
                (filterFaculty.value === '' || r.faculty === filterFaculty.value) &&
                (filterUniversity.value === '' || r.university === filterUniversity.value)
            )
            .sort((a, b) => {
                const o = { likely: 0, possible: 1, stretch: 2, ineligible: 3 }
                return o[a.status] !== o[b.status]
                    ? o[a.status] - o[b.status]
                    : b.yourScore - a.yourScore
            })
    )

    const faculties = computed(() => [...new Set(results.value.map(c => c.faculty))].sort())
    const universities = computed(() => [...new Set(results.value.map(c => c.university))].sort())

    return {
        allCourses, results, whatIfResults, filteredResults,
        selectedCountry, filterStatus, filterFaculty, filterUniversity,
        faculties, universities,
        loadCourses, computeResults, scoreForCourse,
    }
})
