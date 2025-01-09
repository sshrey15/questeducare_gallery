import React from 'react';
import Image from 'next/image';

const topImages = [
  '/carousel/1.png',
  '/carousel/2.png',
  '/carousel/3.png',
  '/carousel/4.png',
  '/carousel/5.png',
  '/carousel/6.png'
];

const TopCarousel = () => {
  return (
    <div className="relative w-full overflow-hidden">
      <div className="flex animate-scroll-left">
        {/* First set */}
        <div className="flex shrink-0">
          {topImages.map((src, index) => (
            <div 
              key={`top1-${index}`} 
              className="w-48 sm:w-56 md:w-64 lg:w-72 h-32 sm:h-40 md:h-44 lg:h-48 shrink-0 p-1 sm:p-2"
            >
              <div className="rounded-lg overflow-hidden h-full shadow-sm hover:shadow-md transition-shadow">
                <Image 
                  width={400}
                  height={320}
                  src={src}
                  alt={`Carousel image ${index + 1}`}
                  className="w-full h-full object-cover"
                  priority={index < 2} // Prioritize loading first two images
                />
              </div>
            </div>
          ))}
        </div>
        {/* Duplicate set for seamless loop */}
        <div className="flex shrink-0">
          {topImages.map((src, index) => (
            <div 
              key={`top2-${index}`} 
              className="w-48 sm:w-56 md:w-64 lg:w-72 h-32 sm:h-40 md:h-44 lg:h-48 shrink-0 p-1 sm:p-2"
            >
              <div className="rounded-lg overflow-hidden h-full shadow-sm hover:shadow-md transition-shadow">
                <Image
                  width={400}
                  height={320}
                  src={src}
                  alt={`Carousel image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopCarousel;