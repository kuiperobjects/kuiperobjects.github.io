<script setup lang="ts">
import { computed } from 'vue';
import type { Project } from '../data/portfolio';

const props = defineProps<{
  project: Project;
}>();

const getYouTubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};
</script>

<template>
  <article class="project-card group relative overflow-hidden" role="article" :aria-labelledby="`project-title-${props.project.id}`">
    <!-- Decorative Arabic-inspired border -->
    <div class="decorative-border absolute top-0 left-0 right-0 h-1"></div>
    
    <!-- Media section -->
    <template v-if="props.project.media?.src">
      <template v-if="props.project.media.type === 'youtube'">
        <div class="relative w-full aspect-video">
          <iframe
            :src="`https://www.youtube.com/embed/${getYouTubeId(props.project.media.src)}`"
            class="absolute top-0 left-0 w-full h-full"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            :aria-label="props.project.media.alt"
          ></iframe>
        </div>
      </template>
      <template v-else>
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
    </template>

    <!-- Secondary Images -->
    <div v-if="props.project.secondaryImages?.length" class="grid grid-cols-2 gap-4 p-4 bg-black/50">
      <img
        v-for="(image, index) in props.project.secondaryImages"
        :key="index"
        :src="image.src"
        :alt="image.alt"
        :class="[
          'w-full object-contain bg-black/30 rounded-sm',
          props.project.secondaryImages.length % 2 !== 0 && index === props.project.secondaryImages.length - 1 ? 'col-span-2 max-w-[50%] mx-auto' : ''
        ]"
      />
    </div>

    <!-- Content section -->
    <div class="p-6 md:p-8 bg-black/80 backdrop-blur-sm">
      <!-- Title and links -->
      <div class="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 md:gap-4 mb-4">
        <h2 
          :id="`project-title-${props.project.id}`"
          class="font-mono text-xl md:text-xl text-lavender font-normal"
        >
          {{ props.project.title }}
        </h2>
        <div class="flex items-center gap-x-3 text-lg text-silver">
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
      <p class="text-silver text-xl mb-6 md:mb-8 leading-relaxed">
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

/* Arabic-inspired decorative elements */
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