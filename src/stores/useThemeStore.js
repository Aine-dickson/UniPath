import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
    const theme = ref(localStorage.getItem('unipath-theme') || 'dark')

    function apply(t) {
        theme.value = t
        document.documentElement.classList.toggle('dark', t === 'dark')
        localStorage.setItem('unipath-theme', t)
    }

    function toggle() {
        apply(theme.value === 'dark' ? 'light' : 'dark')
    }

    // Apply on init
    apply(theme.value)

    return { theme, toggle }
})
