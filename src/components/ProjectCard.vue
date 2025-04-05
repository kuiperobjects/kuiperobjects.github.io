<script setup lang="ts">
import { computed } from 'vue';
import type { Project } from '../data/portfolio';

const props = defineProps<{
  project: Project;
}>();
</script>

<template>
  <article class="project-card group relative overflow-hidden" role="article" :aria-labelledby="`project-title-${props.project.id}`">
    <div class="decorative-border absolute top-0 left-0 right-0 h-1"></div>
    
    <!-- Media section -->
    <template v-if="props.project.media?.src">
      <component
        :is="props.project.media.type === 'video' ? 'video' : 'img'"
        :src="props.project.media.src"
        :alt="props.project.media.alt"
        class="w-full object-contain bg-black/50"
        :aria-label="props.project.media.alt"
        v-bind="props.project.media.type === 'video' ? { 
          autoplay: true, 
          muted: true, 
          loop: true, 
          'webkit-playsinline': true, 
          playsinline: true,
          controls: false,
          'aria-label': props.project.media.alt
        } : {}"
      />
    </template>

    <!-- Content section -->
    <div class="p-6 md:p-8 bg-black/80 backdrop-blur-sm">
      <!-- Title and links -->
      <div class="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 md:gap-4 mb-4">
        <h2 
          :id="`project-title-${props.project.id}`"
          class="font-mono text-xl md:text-2xl text-lavender font-normal"
        >
          {{ props.project.title }}
        </h2>
        <div class="flex items-center gap-x-3 text-sm text-silver">
          <template v-for="(url, type) in props.project.links" :key="type">
            <a 
              v-if="type === 'github'"
              :href="url"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:text-green transition-colors"
              :aria-label="`View ${props.project.title} on GitHub`"
            >
              github
            </a>
            <a 
              v-else-if="type === 'demo'"
              :href="url"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:text-green transition-colors"
              :aria-label="`View ${props.project.title} demo`"
            >
              demo
            </a>
            <a 
              v-else
              :href="url"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:text-green transition-colors"
              :aria-label="`View ${props.project.title} ${type}`"
            >
              {{ type }}
            </a>
          </template>
        </div>
      </div>

      <!-- Description -->
      <p class="text-silver mb-6 md:mb-8 leading-relaxed">
        {{ props.project.description }}
      </p>

      <!-- Technologies -->
      <div class="flex flex-wrap gap-2">
        <span 
          v-for="tech in props.project.technologies" 
          :key="tech"
          class="inline-block px-2 py-1 text-xs md:text-sm bg-green/10 border border-green/20 text-green"
        >
          {{ tech }}
        </span>
      </div>
    </div>
  </article>
</template>

<style scoped>
.project-card {
  @apply relative overflow-hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(46, 139, 87, 0.1);
}

.decorative-border {
  position: relative;
}

.decorative-border::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, theme('colors.green'), theme('colors.lavender'), theme('colors.green'));
  opacity: 0.5;
}

.project-card::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, theme('colors.silver'), transparent);
  opacity: 0.1;
}
</style> 