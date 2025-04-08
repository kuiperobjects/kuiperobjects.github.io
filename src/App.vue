<script setup lang="ts">
import { ref, onMounted } from "vue";
import ProjectCard from "./components/ProjectCard.vue";
import { projects } from "./data/portfolio";

const scrollPosition = ref(0);
const isExpanded = ref(false);

// Research statement paragraphs for easier editing
const researchStatement = [
  "Hi, I'm David. Originally from Western New York, I went to Metropolitan State University of Denver to get my bachelors in Forensic Anthropology before doing graduate work in Arabic Translation at Stockholm University. After writing my masters thesis on Arabic Rap in Beirut, Lebanon, I moved to Cologne, Germany to work in the educational technology sector as a Computational Linguist. After Germany, I moved to Brooklyn where I currently live and work as an artist and an engineer.",

  " My projects range from purely technical to purely aeshetic and frequently are comprised of hybrid media, including  microcontrollers, plastic trash and code. Stuff I've made includes tools which afford greater accessibility--like text to speech readers and language translation software.",

  "Aesthetic projects are frequently designed as interactive art or wearable apparel. Produced artifacts intend to evoke a sense of ontological uncertainty and deep ecology. As biological and technological landscapes enconter each other, those within orbit of these objects of techno-mystic contemplation are invited to consider their subject position in the mesh and develop more ethical relationships with living beings and the enviroment.",
  
  "Through my work, I aim to amplify the voices, experiences, and perspectives of folks rarely heard from as well as provide individuals and commmunities tools for greater understanding, joy, and liberation. Creating new possibilities, by creating art objects as ways to embody and behold the speculative possibilities of post-petrol futures. Crafting to create enriching connections between each other, other living beings, and space. " 
];

// Research areas/keywords array for dynamic rendering
const researchAreas = [
 "Cognitive Science",
  "String Processing",
  "Computational Linguistics",
  "Computational Genomics",
  "Natural Language Processing",
  "Cultural Resource Management",
  "Forensic Anthropology",
  "Statistics",
  "Text Analysis",
  "Community Created Technology",
  "Human-Computer Interaction",
  "Biotechnology",
  "Semitic Linguistics",
  "Language Technology",
  "Digital Humanities",
  "Ethnography",
];

onMounted(() => {
  const updateScroll = () => {
    scrollPosition.value = window.scrollY;
  };
  window.addEventListener("scroll", updateScroll);
});
</script>

<template>
  <!-- Main content -->
  <main class="relative z-10" role="main">
    <!-- Header section with refined classical typography -->
    <header class="container max-w-screen-2xl mx-auto pt-8 md:pt-12 pb-6 md:pb-8 flex justify-center" role="banner">
      <div class="max-w-screen-xl w-full">
        <!-- Name with elegant typography -->
        <div class="mx-auto px-5 md:px-8 mb-6 md:mb-12">
          <div class="flex flex-col md:flex-row md:items-baseline gap-y-2 md:gap-x-4">
            <h1 class="font-mono text-3xl md:text-5xl text-lavender font-normal tracking-tight" tabindex="0">
              David Haddad
            </h1>
            <div class="flex items-center gap-x-3 text-sm md:text-base text-silver">
              <span aria-hidden="true">·</span>
              <a 
                href="https://github.com/kuiperobjects" 
                target="_blank" 
                rel="noopener noreferrer"
                class="hover:text-lavender transition-colors"
                aria-label="Visit GitHub profile"
              >
                github
              </a>
            </div>
          </div>
        </div>
        
        <!-- Content with elegant two-column layout -->
        <div class="mx-auto px-5 md:px-8 grid grid-cols-1 md:grid-cols-12 gap-y-6 md:gap-x-8">
          <!-- Research statement - elegant proportions with dynamic content -->
          <div class="col-span-1 md:col-span-7 mb-6 md:mb-0" role="region" aria-label="Research Statement">
            <div class="border-t border-silver/30 pt-6 md:pt-8  ">
              <div class="prose prose-invert max-w-none leading-snug md:leading-relaxed">
                <!-- First paragraph always visible -->
                <p tabindex="0" class="mb-4 md:mb-3 text-silver ">
                  {{ researchStatement[0] }}
                </p>
                
                <!-- Additional paragraphs - hidden on mobile until expanded -->
                <div :class="{ 'hidden md:block': !isExpanded }">
                  <p 
                    v-for="(paragraph, index) in researchStatement.slice(1)" 
                    :key="index"
                    :class="{ 'mb-4 md:mb-3': index < researchStatement.length - 2 }"
                    tabindex="0"
                    class="text-silver "
                  >
                    {{ paragraph }}
                  </p>
                </div>

                <!-- Mobile expand/collapse -->
                <div class="block md:hidden mt-4 font-mono">
                  <button 
                    @click="isExpanded = !isExpanded"
                    class="inline-flex items-center text-lavender hover:text-green transition-colors"
                    :aria-expanded="isExpanded"
                    :aria-label="isExpanded ? 'Show less' : 'Read full research statement'"
                  >
                    <span class="relative underline underline-offset-4 text-xs">
                      {{ isExpanded ? 'Show less' : 'Expand research statement' }}
                      <span 
                        class="absolute -bottom-px left-0 w-full h-px bg-lavender/30 origin-left transition-transform duration-300"
                        :class="{ 'scale-x-100': isExpanded, 'scale-x-0 group-hover:scale-x-100': !isExpanded }"
                      ></span>
                    </span>
                    <span 
                      class="ml-2 text-xs transition-opacity duration-300" 
                      :class="{ 'opacity-0': isExpanded }"
                      aria-hidden="true"
                    >+</span>
                  </button>
                  <span class="text-xs text-silver/50 ml-2">or just check out my projects below</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Keywords section - elegant layout with dynamic rendering -->
          <div class="md:col-span-5">
            <div class="md:border-l md:border-silver/30 md:pl-8 h-full">
              <h3 class="font-mono text-xs uppercase tracking-widest text-lavender mb-3" id="research-areas">Research Areas</h3>
              <div 
                class="flex flex-wrap gap-y-1.5 md:gap-y-2 gap-x-1.5 md:gap-x-2"
                role="list"
                aria-labelledby="research-areas"
              >
                <span 
                  v-for="(area, index) in researchAreas" 
                  :key="index"
                  class="inline-block font-medium px-1.5 md:px-3 py-0.5 md:py-1.5 text-xs md:text-base bg-green/10 border border-green/20 text-green transition-colors"
                  role="listitem"
                  tabindex="0"
                >
                  {{ area }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Projects grid with refined layout -->
    <section 
      id="projects"
      class="container max-w-screen-2xl mx-auto pb-16 md:pb-24"
      :class="{
        'backdrop-blur-sm': scrollPosition > 0
      }"
      role="region"
      aria-label="Projects"
    >      
      <div class="max-w-screen-xl mx-auto px-5 md:px-8">
        <div class="hidden md:block border-t border-silver/30 pt-6 md:pt-8 font-2xl mb-6"></div>
        <div 
          class="grid grid-cols-2 gap-8 md:gap-16 lg:gap-20"
          role="list"
          aria-label="Project list"
        >
          <ProjectCard
            v-for="project in projects"
            :key="project.id"
            :project="project"
            role="listitem"
          />
        </div>
      </div>
    </section>
  </main>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500&display=swap');

body {
  @apply bg-black text-silver;
  font-family: 'IBM Plex Mono', monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
  min-height: 100vh;
  letter-spacing: -0.01em;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
  min-height: 100vh;
}

/* Custom selection color */
::selection {
  @apply bg-green text-black;
}

/* Refined hover navigation effect */
a {
  position: relative;
  transition: all 0.3s ease;
}

a::after {
  content: '';
  position: absolute;
  width: 0;
  height: 1px;
  bottom: -1px;
  left: 0;
  background-color: currentColor;
  transition: width 0.3s ease-out;
}

a:hover::after {
  width: 100%;
}

/* Override default link styles for buttons */
button::after {
  display: none;
}

/* Arabic-inspired decorative elements */
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
  opacity: 0.3;
}

/* Project card hover effect */
.project-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(46, 139, 87, 0.1);
}
</style>
