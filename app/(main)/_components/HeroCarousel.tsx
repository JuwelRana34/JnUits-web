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
      color: 'from-cyan-900/50 to-slate-900/60',
      image: '/photo1.jpg',
    },
    {
      id: 2,
      title: 'Learn & Lead',
      subtitle:
        'Empowering students through cutting-edge technology and collaboration.',
      color: 'from-blue-900/50 to-slate-900/60',
      image: '/photo2.jpeg',
    },
    {
      id: 3,
      title: 'Build network',
      subtitle:
        ' Connect with like-minded innovators and industry leaders at IT Society.',
      color: 'from-purple-900/50 to-slate-900/60',
      image: '/photo3.jpeg',
    },
  ]

  return (
    <div className="w-full">
      <Carousel
        opts={{ loop: true }}
        plugins={[plugin.current]}
        className="w-full"
      >
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.id}>
              <div className="relative h-[60vh] min-h-125 w-full overflow-hidden md:h-[80vh]">
                {/* Background Image */}
                <Image
                  src={slide.image}
                  alt={slide.title}
                  width={500}
                  height={500}
                  className="absolute inset-0 h-full w-full object-cover"
                />

                {/* Gradient Overlay */}
                <div
                  className={`absolute inset-0 bg-linear-to-r ${slide.color} mix-blend-multiply`}
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
