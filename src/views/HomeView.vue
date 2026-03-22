<template>
    <main class="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <HomeHero />
        <CountrySelector />
        <OpenUniversitySection />
    </main>
</template>

<script setup>
    import HomeHero from '@/components/home/HomeHero.vue'
    import CountrySelector from '@/components/home/CountrySelector.vue'
    import OpenUniversitySection from '@/components/home/OpenUniversitySection.vue'
</script>
