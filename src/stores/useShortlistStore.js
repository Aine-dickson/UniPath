import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useResultsStore } from './useResultsStore.js'

export const useShortlistStore = defineStore('shortlist', () => {
    const ids = ref(JSON.parse(localStorage.getItem('unipath-shortlist') || '[]'))

    function persist() {
        localStorage.setItem('unipath-shortlist', JSON.stringify(ids.value))
    }

    function isShortlisted(id) { return ids.value.includes(id) }

    function toggle(course) {
        const idx = ids.value.indexOf(course.id)
        if (idx > -1) ids.value.splice(idx, 1)
        else ids.value.push(course.id)
        persist()
    }

    const details = computed(() => {
        const store = useResultsStore()
        return store.results.filter(r => ids.value.includes(r.id))
    })

    return { ids, isShortlisted, toggle, details }
})
