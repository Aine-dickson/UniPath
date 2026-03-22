<template>
    <div class="min-h-screen bg-(--bg) text-(--text) transition-colors duration-200">
        <AppHeader />
        <RouterView />
    </div>
</template>

<script setup>
    import AppHeader from '@/components/layout/AppHeader.vue'
    import { useThemeStore } from '@/stores/useThemeStore.js'
    // Ensure theme is initialised
    useThemeStore()
</script>
