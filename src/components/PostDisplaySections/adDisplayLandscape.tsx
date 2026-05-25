import cloudinaryLoader from '@/app/helpers/cloudinary'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const AdDisplayLandscape = () => {
  return (
    <div className=" aspect-video  relative h-full    w-full">
        <Link
          href="https://www.simandou2040.gn/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            loader={cloudinaryLoader}
            src="/images/ads/portConakry.webp"
            alt="Port Conakry Ad"
            className="object-contain   w-full transition-transform  duration-500 hover:scale-105"
            fill
            priority
          />
        </Link>
      </div>
  )
}

export default AdDisplayLandscape
