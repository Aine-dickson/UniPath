<template>
    <main class="max-w-6xl mx-auto px-4 sm:px-6 pb-16 pt-6">

        <!-- Guard: redirect if no results -->
        <div v-if="!results.results.length" class="text-center py-20 text-(--text-muted)">
            <p class="font-display text-xl text-(--text) mb-3">No results yet</p>
            <RouterLink to="/check"
                class="inline-block px-6 py-2.5 rounded-md bg-gold text-navy text-sm font-bold shadow-gold">
                ← Back to check
            </RouterLink>
        </div>

        <template v-else>
            <!-- Info note -->
            <!-- <div class="bg-info/6 border border-info/18 rounded-md px-4 py-3 text-sm
                  text-(--text-sub) leading-relaxed mb-5">
                <strong class="text-(--text)">Formula:</strong>
                (Essential₁ × 3) + (Essential₂ × 3) + (Relevant × 2) + subsidiary pts + O-Level pts.
                Max = 53 pts.
                <strong class="text-(--text)">Likely</strong> = score ≥ avg cutoff + 2.
                <strong class="text-(--text)">Possible</strong> = at or above historical minimum.
                <strong class="text-(--text)">Stretch</strong> = below minimum but subjects present.
                <strong class="text-(--text)">Ineligible</strong> = missing essential subject or O-Level
                requirement.
                <span v-if="results.selectedCountry === 'ke'">
                    &nbsp;|&nbsp; <strong class="text-(--text)">Kenya mode:</strong>
                    UNEB grades converted to KCSE cluster points (A→12, B→11, C→9, D→7, E→5, O→3, F→0).
                </span>
            </div> -->

            <!-- Score banner -->
            <ScoreBanner />

            <!-- What-If Simulator -->
            <WhatIfSimulator />

            <!-- Results header -->
            <div class="flex items-baseline justify-between mb-1">
                <div>
                    <h1 class="font-display text-2xl font-bold text-(--text)">Eligible Courses</h1>
                    <p class="text-sm text-(--text-muted) mt-0.5">
                        {{ activeCountry.name }} · 5-year average minimum cutoffs
                    </p>
                </div>
            </div>

            <FilterBar class="mt-3" />

            <!-- Course grid -->
            <div v-if="results.filteredResults.length" class="flex flex-col gap-3">
                <CourseCard v-for="course in results.filteredResults" :key="course.id" :course="course"
                    @open="openCourse" />
            </div>

            <div v-else class="text-center py-16">
                <div class="text-4xl opacity-30 mb-3">🎓</div>
                <p class="font-display text-lg text-(--text) mb-1">No courses match this filter</p>
                <p class="text-sm text-(--text-muted)">Adjust the status, faculty, or university filter above.</p>
            </div>
        </template>

        <!-- Course detail drawer -->
        <CourseDrawer :course="activeCourse" @close="activeCourse = null" />

        <!-- Shortlist drawer -->
        <ShortlistDrawer :open="showShortlist" @close="showShortlist = false" />

    </main>
</template>

<script setup>
    import { ref, computed, onMounted } from 'vue'
    import { useResultsStore } from '@/stores/useResultsStore.js'

    import ScoreBanner from '@/components/results/ScoreBanner.vue'
    import FilterBar from '@/components/results/FilterBar.vue'
    import CourseCard from '@/components/results/CourseCard.vue'
    import CourseDrawer from '@/components/drawer/CourseDrawer.vue'
    import ShortlistDrawer from '@/components/drawer/ShortlistDrawer.vue'
    import WhatIfSimulator from '@/components/simulator/WhatIfSimulator.vue'

    const results = useResultsStore()
    const activeCourse = ref(null)
    const showShortlist = ref(false)

    const countries = [
        { id: 'ug', name: 'Uganda', flag: '🇺🇬' },
        { id: 'ke', name: 'Kenya', flag: '🇰🇪' },
        { id: 'tz', name: 'Tanzania', flag: '🇹🇿' },
    ]
    const activeCountry = computed(() => countries.find(c => c.id === results.selectedCountry))

    function openCourse(course) { activeCourse.value = course }

    // Expose shortlist toggle for AppHeader via provide/inject if needed
    // For now, a simple event bus approach is handled in AppHeader directly
</script>
