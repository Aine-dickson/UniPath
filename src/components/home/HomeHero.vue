<template>
  <div class="text-center py-14 px-4">
    <div class="inline-block text-xs font-bold tracking-widest uppercase
                text-gold bg-gold/10 border border-gold/25 rounded-full
                px-4 py-1.5 mb-5">
      East Africa · University Admissions
    </div>

    <h1 class="font-display text-4xl md:text-5xl font-black text-[var(--text)]
               leading-tight mb-4">
      Know your courses<br>
      <span class="text-gold">before results day.</span>
    </h1>

    <p class="text-base md:text-lg text-[var(--text-sub)] max-w-xl mx-auto
              leading-relaxed mb-9 font-light">
      Enter your O-Level and A-Level results. UniPath calculates your official
      weighted cutoff score and tells you exactly which university courses you
      qualify for — across Uganda, Kenya and Tanzania.
    </p>

    <RouterLink to="/check"
      class="inline-flex items-center gap-2 bg-gold text-navy font-bold text-base
             px-8 py-3.5 rounded-md shadow-gold hover:shadow-gold-lg
             hover:-translate-y-0.5 transition-all duration-200">
      Check My Eligibility →
    </RouterLink>

    <div class="flex justify-center flex-wrap gap-2.5 mt-7">
      <span v-for="pill in pills" :key="pill"
        class="flex items-center gap-1.5 text-sm text-[var(--text-sub)]
               bg-[var(--bg-surface)] border border-[var(--border-soft)]
               rounded-full px-3.5 py-1.5">
        {{ pill }}
      </span>
    </div>
  </div>
</template>

<script setup>
const pills = [
  '🎓 Official PUJAB formula',
  '📊 5-year cutoff trends',
  '🌍 Uganda · Kenya · Tanzania',
  '⭐ Course shortlisting',
  '🔮 What-If grade simulator',
]
</script>
