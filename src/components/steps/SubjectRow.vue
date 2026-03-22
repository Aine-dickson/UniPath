<template>
    <div class="flex items-center gap-2.5 px-3 py-2.5 rounded-md
              bg-(--bg-raised) border border-(--border-soft)
              hover:border-(--border) transition-colors"
        :class="removable ? 'border-l-[3px] border-l-(--text-muted)/35' : 'border-l-[3px] border-l-gold/45'">

        <span class="text-[0.6rem] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded shrink-0"
            :class="badgeClass">
            {{ badge }}
        </span>

        <span class="text-sm text-(--text) flex-1 min-w-0 leading-tight truncate">{{ entry.subject }}</span>

        <select class="grade-mini appearance-none bg-none" v-model="entry.grade">
            <option value="">—</option>
            <option v-for="g in oGrades" :key="g" :value="g">{{ g }}</option>
        </select>

        <span class="font-mono text-xs text-success w-8 text-right shrink-0 font-medium">
            {{ entry.grade ? '+' + oContrib(entry.grade).toFixed(1) : '' }}
        </span>

        <button v-if="removable" @click="emit('remove')" class="text-(--text-muted) hover:text-danger transition-colors
             text-sm leading-none shrink-0 ml-0.5">
            ✕
        </button>
    </div>
</template>

<script setup>
    import { oContrib, O_GRADES as oGrades } from '@/stores/useGradesStore.js'

    defineProps({
        entry: { type: Object, required: true },
        badge: { type: String, default: '' },
        badgeClass: { type: String, default: '' },
        removable: { type: Boolean, default: false },
    })
    const emit = defineEmits(['remove'])
</script>
