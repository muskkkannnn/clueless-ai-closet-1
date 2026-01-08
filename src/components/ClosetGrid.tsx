'use client'

import Image from 'next/image'

interface Item {
  id: string
  type: string
  image_url: string
  description?: string | null
}

interface ClosetGridProps {
  items: Item[]
}

export function ClosetGrid({ items }: ClosetGridProps) {
  if (items.length === 0) {
    return (
      <div className="text-center text-gray-500">
        <p>Your closet is empty.</p>
        <p>Upload some clothes to get started!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {items.map((item) => (
        <div key={item.id} className="group relative">
          <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
            <Image
              src={item.image_url}
              alt={item.description || 'A piece of clothing'}
              layout="fill"
              objectFit="cover"
              className="group-hover:opacity-75"
            />
          </div>
          <h3 className="mt-4 text-sm text-gray-700">{item.type}</h3>
        </div>
      ))}
    </div>
  )
}
