<template>
    <header class="sticky top-0 z-50 flex items-center justify-between gap-4 flex-wrap
                 px-6 py-3 border-b border-(--border-soft)
                 bg-(--bg-surface) backdrop-blur-md">

        <!-- Left -->
        <div class="flex items-center gap-5">
            <RouterLink to="/" class="font-display text-2xl font-black text-gold leading-none tracking-tight">
                UniPath<span class="text-(--text) font-normal">.ea</span>
            </RouterLink>

            <!-- Country pill — only in non-home routes -->
            <div v-if="route.path !== '/'" class="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold
               bg-(--bg-raised) border border-(--border)
               text-(--text)">
                <span class="text-lg leading-none">{{ activeCountry.flag }}</span>
                <select v-model="results.selectedCountry" class="bg-transparent! border-none text-(--text) text-sm font-semibold
                 p-1 outline-none cursor-pointer appearance-none">
                    <option v-for="c in countries" :key="c.id" :value="c.id">{{ c.name }}</option>
                </select>
            </div>
        </div>

        <!-- Right -->
        <div class="flex items-center gap-2.5">
            <!-- Shortlist -->
            <button v-if="route.path === '/results'" @click="$emit('open-shortlist')" class="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold
               bg-(--bg-raised) border border-(--border) text-(--text)
               hover:bg-(--bg-hover) transition-colors">
                ★ Shortlist
                <span v-if="shortlist.ids.length"
                    class="bg-gold text-navy text-xs font-bold px-1.5 py-0.5 rounded-full leading-none">
                    {{ shortlist.ids.length }}
                </span>
            </button>

            <!-- Theme toggle -->
            <button @click="theme.toggle" class="w-9 h-9 rounded-full flex items-center justify-center text-lg
               bg-(--bg-raised) border border-(--border-soft)
               hover:bg-(--bg-hover) transition-colors"
                :title="theme.theme === 'dark' ? 'Switch to light' : 'Switch to dark'">
                {{ theme.theme === 'dark' ? '☀️' : '🌙' }}
            </button>
        </div>

    </header>
</template>

<script setup>
    import { computed } from 'vue'
    import { useRoute } from 'vue-router'
    import { useThemeStore } from '@/stores/useThemeStore.js'
    import { useResultsStore } from '@/stores/useResultsStore.js'
    import { useShortlistStore } from '@/stores/useShortlistStore.js'

    defineEmits(['open-shortlist'])

    const route = useRoute()
    const theme = useThemeStore()
    const results = useResultsStore()
    const shortlist = useShortlistStore()

    const countries = [
        { id: 'ug', name: 'Uganda', flag: '🇺🇬' },
        { id: 'ke', name: 'Kenya', flag: '🇰🇪' },
        { id: 'tz', name: 'Tanzania', flag: '🇹🇿' },
    ]
    const activeCountry = computed(() => countries.find(c => c.id === results.selectedCountry))
</script>
