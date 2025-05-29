<template>
  <div class="min-h-screen bg-dark text-light">
    <!-- Header -->
    <header class="bg-dark-light/50 backdrop-blur-lg border-b border-dark-lighter fixed w-full z-50">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div class="flex items-center">
          <h1 class="text-2xl font-bold text-light">WebAI</h1>
        </div>
        <div class="hidden lg:flex space-x-8">
          <a href="#" class="text-light-dark hover:text-primary transition-colors">Home</a>
          <a href="#" class="text-light-dark hover:text-primary transition-colors">Tools</a>
          <a href="#" class="text-light-dark hover:text-primary transition-colors">Features</a>
          <a href="#" class="text-light-dark hover:text-primary transition-colors">Testimonials</a>
          <a href="#" class="text-light-dark hover:text-primary transition-colors">Price</a>
        </div>
        <div class="hidden lg:block">
          <button class="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary-dark transition duration-300">
            Try WebAI Free
          </button>
        </div>
        <!-- Mobile menu button -->
        <div class="lg:hidden">
          <button class="text-light-dark hover:text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>
    </header>

    <!-- Hero Section -->
    <section class="pt-20 bg-hero-pattern animate-fade-up">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div class="text-center">
          <h1 class="text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl animate-fade-up">
            AI-Powered Solution For
            <span class="text-primary block mt-2">Effective Business</span>
          </h1>
          <p class="mt-8 text-xl text-light-dark max-w-3xl mx-auto leading-relaxed animate-fade-up animation-delay-200">
            Transform your content creation with AI-powered solutions. Generate high-quality content in seconds.
          </p>
          <div class="mt-12 flex flex-col sm:flex-row justify-center gap-4 animate-fade-up animation-delay-400">
            <button class="bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-dark transition duration-300">
              Try WebAI Free
            </button>
            <button class="bg-dark-light text-light border border-dark-lighter px-8 py-4 rounded-lg text-lg font-semibold hover:bg-dark-lighter transition duration-300">
              View Demo
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-24 bg-dark scroll-reveal">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold mb-4">AI Generate Content In Seconds</h2>
          <p class="text-light-dark">Best writing AI Alternative platform to create content easily</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="(feature, index) in features" :key="feature.title" 
               class="bg-dark-light p-8 rounded-xl border border-dark-lighter hover:border-primary transition-all duration-300 scroll-reveal"
               :style="{ animationDelay: `${index * 100}ms` }">
            <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
              <span class="text-2xl">{{ feature.icon }}</span>
            </div>
            <h3 class="text-xl font-semibold mb-4">{{ feature.title }}</h3>
            <p class="text-light-dark">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Tools Section -->
    <section class="py-24 bg-dark-light scroll-reveal">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold mb-4">What Can It Write For You?</h2>
          <p class="text-light-dark">Best writing AI Alternative platform to create content easily</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="(tool, index) in tools" :key="tool.title"
               class="bg-dark p-8 rounded-xl border border-dark-lighter hover:border-primary transition-all duration-300 scroll-reveal"
               :style="{ animationDelay: `${index * 100}ms` }">
            <div class="w-12 h-12 text-primary mb-6">
              <span v-html="tool.icon"></span>
            </div>
            <h3 class="text-xl font-semibold mb-4">{{ tool.title }}</h3>
            <p class="text-light-dark mb-6">{{ tool.description }}</p>
            <a href="#" class="text-primary hover:text-primary-dark transition-colors">Learn more →</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Company Logos Section -->
    <section class="py-16 bg-dark scroll-reveal">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold mb-4">Trusted by Leading Companies</h2>
          <p class="text-light-dark">Join thousands of satisfied customers who trust WebAI</p>
        </div>
        <div class="flex overflow-hidden">
          <div class="flex animate-scroll-x">
            <div v-for="(logo, index) in companyLogos" :key="index" 
                 class="mx-8 grayscale hover:grayscale-0 transition-all duration-300">
              <img :src="logo" alt="Company Logo" class="h-12" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Trending Topics Section -->
    <section class="py-24 bg-dark-light scroll-reveal">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold mb-4">Trending Topics</h2>
          <p class="text-light-dark">Explore the most popular AI content generation topics</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="(topic, index) in trendingTopics" :key="topic.title"
               class="bg-dark p-8 rounded-xl border border-dark-lighter hover:border-primary transition-all duration-300 scroll-reveal"
               :style="{ animationDelay: `${index * 100}ms` }">
            <h3 class="text-xl font-semibold mb-4">{{ topic.title }}</h3>
            <p class="text-light-dark mb-6">{{ topic.description }}</p>
            <div class="flex -space-x-2">
              <img v-for="avatar in topic.avatars" :key="avatar" 
                   :src="avatar" 
                   class="w-8 h-8 rounded-full border-2 border-dark" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="py-24 bg-dark scroll-reveal">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold mb-4">What Our Users Say</h2>
          <p class="text-light-dark">Hear from our satisfied customers</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="(testimonial, index) in testimonials" :key="testimonial.name"
               class="bg-dark-light p-8 rounded-xl border border-dark-lighter scroll-reveal"
               :style="{ animationDelay: `${index * 100}ms` }">
            <div class="flex items-center mb-6">
              <img :src="testimonial.avatar" alt="User" class="w-12 h-12 rounded-full" />
              <div class="ml-4">
                <h4 class="font-semibold">{{ testimonial.name }}</h4>
                <p class="text-light-dark text-sm">{{ testimonial.role }}</p>
              </div>
            </div>
            <p class="text-light-dark">{{ testimonial.content }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-24 bg-dark-light scroll-reveal">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p class="text-light-dark">Get answers to common questions about WebAI</p>
        </div>
        <div class="max-w-3xl mx-auto">
          <div v-for="(faq, index) in faqs" :key="index"
               class="mb-6 scroll-reveal"
               :style="{ animationDelay: `${index * 100}ms` }">
            <button @click="faq.isOpen = !faq.isOpen"
                    class="w-full text-left p-6 bg-dark rounded-lg flex justify-between items-center hover:bg-dark-lighter transition-colors">
              <span class="font-semibold">{{ faq.question }}</span>
              <span class="transform transition-transform" :class="{ 'rotate-180': faq.isOpen }">▼</span>
            </button>
            <div v-show="faq.isOpen" 
                 class="p-6 text-light-dark bg-dark-light mt-2 rounded-lg transition-all">
              {{ faq.answer }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section class="py-24 bg-dark scroll-reveal">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold mb-4">Pricing And Plans For Everyone</h2>
          <p class="text-light-dark">Best writing AI Alternative platform to create content easily</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="(plan, index) in plans" :key="plan.name"
               class="bg-dark-light p-8 rounded-xl border border-dark-lighter hover:border-primary transition-all duration-300 scroll-reveal"
               :style="{ animationDelay: `${index * 100}ms` }">
            <h3 class="text-2xl font-bold mb-2">{{ plan.name }}</h3>
            <div class="flex items-baseline mb-8">
              <span class="text-4xl font-bold">${{ plan.price }}</span>
              <span class="text-light-dark ml-2">/month</span>
            </div>
            <ul class="space-y-4 mb-8">
              <li v-for="feature in plan.features" :key="feature" class="flex items-center">
                <span class="text-primary mr-2">✓</span>
                <span>{{ feature }}</span>
              </li>
            </ul>
            <button class="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition duration-300">
              Try {{ plan.name }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-dark-light border-t border-dark-lighter py-12 scroll-reveal">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h2 class="text-2xl font-bold mb-6">WebAI</h2>
            <p class="text-light-dark">Transform your content creation with AI-powered solutions.</p>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4">Company</h3>
            <ul class="space-y-2">
              <li><a href="#" class="text-light-dark hover:text-primary transition-colors">About</a></li>
              <li><a href="#" class="text-light-dark hover:text-primary transition-colors">Features</a></li>
              <li><a href="#" class="text-light-dark hover:text-primary transition-colors">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4">Support</h3>
            <ul class="space-y-2">
              <li><a href="#" class="text-light-dark hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" class="text-light-dark hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" class="text-light-dark hover:text-primary transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4">Contact</h3>
            <ul class="space-y-2">
              <li><a href="#" class="text-light-dark hover:text-primary transition-colors">contact@webai.com</a></li>
              <li class="text-light-dark">123 AI Street, Tech City</li>
            </ul>
          </div>
        </div>
        <div class="mt-12 pt-8 border-t border-dark-lighter text-center text-light-dark">
          <p>© 2024 WebAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const features = [
  {
    icon: '🤖',
    title: 'Latest AI Technology',
    description: 'Access cutting-edge AI models for superior content generation and analysis.'
  },
  {
    icon: '⚡',
    title: 'Multiple languages',
    description: 'Generate content in multiple languages with native-like fluency and accuracy.'
  },
  {
    icon: '🎯',
    title: 'Edit text easily',
    description: 'Intuitive editing interface with AI-powered suggestions and improvements.'
  }
]

const tools = [
  {
    icon: '📝',
    title: 'Blog Post',
    description: 'Generate engaging blog posts with AI-powered content suggestions.'
  },
  {
    icon: '🌐',
    title: 'Social Media',
    description: 'Create compelling social media content that drives engagement.'
  },
  {
    icon: '📧',
    title: 'Email',
    description: 'Write professional emails with perfect tone and structure.'
  },
  {
    icon: '❓',
    title: 'FAQ',
    description: 'Generate comprehensive FAQ sections for your website.'
  },
  {
    icon: '💬',
    title: 'Testimonials',
    description: 'Create authentic-sounding testimonials for your products.'
  },
  {
    icon: '📱',
    title: 'App Description',
    description: 'Write compelling app descriptions that convert.'
  }
]

const plans = [
  {
    name: 'Free',
    price: '0',
    features: [
      '5,000 words per month',
      'Basic templates',
      'Standard support',
      'Single user'
    ]
  },
  {
    name: 'Starter',
    price: '39',
    features: [
      '50,000 words per month',
      'All templates',
      'Priority support',
      'Up to 3 users'
    ]
  },
  {
    name: 'Basic',
    price: '89',
    features: [
      '200,000 words per month',
      'Custom templates',
      '24/7 support',
      'Up to 10 users'
    ]
  },
  {
    name: 'Enterprise',
    price: '149',
    features: [
      'Unlimited words',
      'Custom solutions',
      'Dedicated support',
      'Unlimited users'
    ]
  }
]

const companyLogos = [
  'https://via.placeholder.com/150x50?text=Logo1',
  'https://via.placeholder.com/150x50?text=Logo2',
  'https://via.placeholder.com/150x50?text=Logo3',
  'https://via.placeholder.com/150x50?text=Logo4',
  'https://via.placeholder.com/150x50?text=Logo5',
  'https://via.placeholder.com/150x50?text=Logo6',
]

const trendingTopics = [
  {
    title: 'Blog Content',
    description: 'Generate engaging blog posts with AI assistance',
    avatars: [
      'https://i.pravatar.cc/150?img=1',
      'https://i.pravatar.cc/150?img=2',
      'https://i.pravatar.cc/150?img=3',
    ]
  },
  {
    title: 'Social Media',
    description: 'Create viral social media content instantly',
    avatars: [
      'https://i.pravatar.cc/150?img=4',
      'https://i.pravatar.cc/150?img=5',
    ]
  },
  {
    title: 'SEO Content',
    description: 'Generate SEO-optimized content that ranks',
    avatars: [
      'https://i.pravatar.cc/150?img=6',
      'https://i.pravatar.cc/150?img=7',
      'https://i.pravatar.cc/150?img=8',
      'https://i.pravatar.cc/150?img=9',
    ]
  }
]

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Content Manager',
    avatar: 'https://i.pravatar.cc/150?img=1',
    content: 'WebAI has transformed our content creation process. The quality and speed are unmatched.'
  },
  {
    name: 'Michael Chen',
    role: 'Marketing Director',
    avatar: 'https://i.pravatar.cc/150?img=2',
    content: 'The AI-powered tools have helped us scale our content strategy effectively.'
  },
  {
    name: 'Emma Davis',
    role: 'Freelance Writer',
    avatar: 'https://i.pravatar.cc/150?img=3',
    content: 'As a writer, WebAI helps me overcome writer\'s block and create better content faster.'
  }
]

const faqs = ref([
  {
    question: 'How does WebAI generate content?',
    answer: 'WebAI uses advanced machine learning algorithms to analyze your input and generate high-quality content that matches your requirements.',
    isOpen: false
  },
  {
    question: 'What type of content can I create?',
    answer: 'You can create various types of content including blog posts, social media updates, product descriptions, and more.',
    isOpen: false
  },
  {
    question: 'Is the content unique and original?',
    answer: 'Yes, all content generated by WebAI is unique and passes plagiarism checks.',
    isOpen: false
  }
])

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
      }
    })
  }, {
    threshold: 0.1
  })

  document.querySelectorAll('.scroll-reveal').forEach(el => {
    observer.observe(el)
  })
})
</script>

<style>
body {
  font-family: 'Inter', sans-serif;
}

.scroll-reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.scroll-reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

.animate-fade-up {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeUp 0.6s ease-out forwards;
}

.animation-delay-200 {
  animation-delay: 200ms;
}

.animation-delay-400 {
  animation-delay: 400ms;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scroll-x {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-scroll-x {
  animation: scroll-x 20s linear infinite;
  min-width: 100%;
}

.animate-scroll-x:hover {
  animation-play-state: paused;
}
</style>