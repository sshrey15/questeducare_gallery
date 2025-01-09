import React from 'react';
import Image from 'next/image';

const bottomImages = [
  '/carousel/7.png',
  '/carousel/8.png',
  '/carousel/9.png',
  '/carousel/10.png',
  '/carousel/11.png',
  '/carousel/12.png'
];

const BottomCarousel = () => {
  return (
    <div className="relative">
      <div className="flex animate-scroll-right">
        {/* First set */}
        <div className="flex shrink-0">
          {bottomImages.map((src, index) => (
            <div key={`bottom1-${index}`} className="w-72 h-48 shrink-0 p-2">
              <div className="rounded-lg overflow-hidden h-full">
                <Image
                  width={400}
                  height={320}
                  src={src}
                  alt={`Carousel image ${index + 1}`}
                  className="w-full h-full object-cover shadow-lg"
                />
              </div>
            </div>
          ))}
        </div>
        {/* Duplicate set for seamless loop */}
        <div className="flex shrink-0 ">
          {bottomImages.map((src, index) => (
            <div key={`bottom2-${index}`} className="w-72 h-48 shrink-0 p-2">
              <div className="rounded-lg overflow-hidden h-full ">
                <Image
                  width={400}
                  height={320}
                  src={src}
                  alt={`Carousel image ${index + 1}`}
                  className="w-full h-full object-cover "
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BottomCarousel;
// className="w-full h-full bg-[url('/sci.avif')] bg-fixed bg-center bg-[length:20%] opacity-30"
