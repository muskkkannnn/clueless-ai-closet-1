'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Item {
  id: string;
  type: string;
  image_url: string;
}

interface OutfitBuilderProps {
  items: Item[];
}

export function OutfitBuilder({ items }: OutfitBuilderProps) {
  const [selectedItems, setSelectedItems] = useState<Item[]>([])
  const [generating, setGenerating] = useState(false)
  const [visualization, setVisualization] = useState<string | null>(null)

  function handleSelectItem(item: Item) {
    // Clear previous visualization when selection changes
    if (visualization) setVisualization(null);

    setSelectedItems(prevSelectedItems => {
      if (prevSelectedItems.find(i => i.id === item.id)) {
        return prevSelectedItems.filter(i => i.id !== item.id)
      }
      // Simple rule: allow 1 top, 1 bottom, 1 shoes.
      // This can be made more complex later.
      const hasType = prevSelectedItems.some(i => i.type === item.type);
      if (!hasType && prevSelectedItems.length < 3) {
        return [...prevSelectedItems, item];
      }
      return prevSelectedItems
    })
  }

  async function handleGenerate() {
    if (selectedItems.length < 2) {
      alert('Please select at least 2 items.');
      return;
    }
    setGenerating(true);
    setVisualization(null);

    try {
      const res = await fetch('/api/visualize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemIds: selectedItems.map(i => i.id) }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.details || 'Failed to generate visualization.');
      }

      const data = await res.json();
      setVisualization(data.imageUrl);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      console.error('Visualization generation failed:', errorMessage);
      alert(`Error: ${errorMessage}`);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <h2 className="text-2xl font-semibold mb-4">Your Closet</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {items.map(item => (
            <button
              key={item.id}
              onClick={() => handleSelectItem(item)}
              className={`border-2 rounded-lg p-2 transition ${
                selectedItems.find(i => i.id === item.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                <Image
                  src={item.image_url}
                  alt={item.type}
                  width={150}
                  height={150}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="lg:col-span-1">
        <h2 className="text-2xl font-semibold mb-4">Outfit Canvas</h2>
        <div className="bg-gray-100 rounded-lg p-4 min-h-[300px] space-y-4">
          {selectedItems.length === 0 ? (
            <p className="text-center text-gray-500">Select up to 3 items (e.g., top, bottom, shoes) from your closet.</p>
          ) : (
            selectedItems.map(item => (
              <div key={item.id} className="flex items-center justify-between bg-white p-2 rounded-md">
                <div className="flex items-center gap-4">
                  <Image
                    src={item.image_url}
                    alt={item.type}
                    width={50}
                    height={50}
                    className="w-12 h-12 object-contain rounded"
                  />
                  <span className="capitalize">{item.type}</span>
                </div>
                <button
                  onClick={() => handleSelectItem(item)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
        <button
          onClick={handleGenerate}
          disabled={selectedItems.length < 2 || generating}
          className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {generating ? 'Generating... (can take up to 30s)' : 'Visualize Outfit'}
        </button>

        {generating && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
            <div className="bg-blue-600 h-2.5 rounded-full animate-pulse"></div>
          </div>
        )}

        {visualization && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Result:</h3>
            <div className="relative aspect-w-9 aspect-h-16 w-full overflow-hidden rounded-lg bg-gray-200">
                <Image
                    src={visualization}
                    alt="AI-generated outfit visualization"
                    layout="fill"
                    objectFit="cover"
                    className="w-full h-full object-cover object-center"
                />
            </div>
            <p className="text-xs text-center text-gray-500 mt-2">
              Note: This is an AI visualization. Colors and fit are approximate.
            </p>
            {/* Save/Download buttons will go here */}
          </div>
        )}

      </div>
    </div>
  )
}
