'use client'

import * as React from 'react'

import Image from 'next/image'

import Autoplay from 'embla-carousel-autoplay'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

export function HeroCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  )

  const slides = [
    {
      id: 1,
      title: 'Innovating the Future',
      subtitle: 'Join the premier tech community at Jagannath University.',
      color: 'from-cyan-900/80 to-slate-900/90',
      image:
        'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop',
    },
    {
      id: 2,
      title: 'Learn & Lead',
      subtitle:
        'Empowering students through cutting-edge technology and collaboration.',
      color: 'from-blue-900/80 to-slate-900/90',
      image:
        'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop',
    },
    {
      id: 3,
      title: 'Build Real Projects',
      subtitle:
        'Turn your ideas into reality with hands-on experience and expert mentorship.',
      color: 'from-purple-900/80 to-slate-900/90',
      image:
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop',
    },
  ]

  return (
    <div className="w-full">
      <Carousel
        opts={{ loop: true }}
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.id}>
              <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden md:h-[80vh]">
                {/* Background Image */}
                <Image
                  src={slide.image}
                  alt={slide.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />

                {/* Gradient Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${slide.color} mix-blend-multiply`}
                />
                <div className="absolute inset-0 bg-black/40" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
                  <h2 className="animate-fade-in-up text-4xl font-extrabold tracking-tight text-white drop-shadow-lg sm:text-5xl md:text-7xl lg:text-8xl">
                    {slide.title}
                  </h2>
                  <p
                    className="animate-fade-in-up mt-6 max-w-2xl text-lg text-slate-200 drop-shadow-md sm:text-2xl md:text-3xl"
                    style={{ animationDelay: '0.2s' }}
                  >
                    {slide.subtitle}
                  </p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 hidden h-12 w-12 border-none bg-white/10 text-white backdrop-blur-md hover:bg-white/20 md:flex" />
        <CarouselNext className="right-4 hidden h-12 w-12 border-none bg-white/10 text-white backdrop-blur-md hover:bg-white/20 md:flex" />
      </Carousel>
    </div>
  )
}
