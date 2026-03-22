<template>
    <main class="max-w-6xl mx-auto px-4 sm:px-6 pb-16 pt-6">

        <StepperNav :current-step="step" @goto="handleGoto" />

        <Transition name="fade" mode="out-in">
            <StepOLevel v-if="step === 1" key="ol" @next="step = 2" />
            <StepALevel v-else-if="step === 2" key="al" @next="goToResults" @back="step = 1" />
        </Transition>

    </main>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import { useRouter } from 'vue-router'
    import { useResultsStore } from '@/stores/useResultsStore.js'
    import StepperNav from '@/components/layout/StepperNav.vue'
    import StepOLevel from '@/components/steps/StepOLevel.vue'
    import StepALevel from '@/components/steps/StepALevel.vue'

    const step = ref(1)
    const router = useRouter()
    const results = useResultsStore()

    onMounted(() => results.loadCourses())

    function handleGoto(id) {
        if (id <= step.value) step.value = id
    }

    async function goToResults() {
        await results.loadCourses()
        results.computeResults()
        router.push('/results')
    }
</script>
