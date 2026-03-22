<template>
  <div class="flex items-start gap-2.5 text-sm leading-snug">
    <span class="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-0.5"
      :class="met ? 'bg-success' : warn ? 'bg-warn' : 'bg-danger'" />
    <span class="text-[var(--text-sub)]"><slot /></span>
  </div>
</template>

<script setup>
defineProps({
  met:  { type: Boolean, default: false },
  warn: { type: Boolean, default: false },
})
</script>
