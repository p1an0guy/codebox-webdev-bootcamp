"use client";

import { useState, useEffect } from 'react';

interface RainDrop {
    id: number;
    x: number;
    y: number;
    char: string;
    speed: number;
}

export default function Home() {
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showCursor, setShowCursor] = useState(true);
    const [rainDrops, setRainDrops] = useState<RainDrop[]>([]);

    const fullText = "Welcome to p1an0_guy's Next.js Page!";
    const asciiChars = ['0', '1', '!', '@', '#', '$', '%', '^', '&', '*', '+', '=', '-', '_', '|', '\\', '/', '?', '<', '>', '~', '`'];

    // Typewriter effect with randomized speed
    useEffect(() => {
        if (currentIndex < fullText.length) {
            // Random typing speed to simulate human typing
            const randomDelay = Math.floor(Math.random() * 100) + 50;

            const timeout = setTimeout(() => {
                setDisplayedText(prev => prev + fullText[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, randomDelay);

            return () => clearTimeout(timeout);
        }
    }, [currentIndex, fullText]);

    // Blinking cursor effect
    useEffect(() => {
        const interval = setInterval(() => {
            setShowCursor(prev => !prev);
        }, 500); // Blink speed

        return () => clearInterval(interval);
    }, []);

    // ASCII Rain effect
    useEffect(() => {
        // Only run on client side
        if (typeof window === 'undefined') return;

        const createRainDrop = () => {
            const newDrop: RainDrop = {
                id: Math.random(),
                x: Math.random() * window.innerWidth,
                y: -20,
                char: asciiChars[Math.floor(Math.random() * asciiChars.length)],
                speed: Math.random() * 3 + 1
            };
            return newDrop;
        };

        const interval = setInterval(() => {
            setRainDrops(prev => {
                // Add more drops more frequently
                const newDrops = Math.random() < 0.7 ? [createRainDrop()] : [];
                
                // Update existing drops
                const updatedDrops = prev
                    .map(drop => ({
                        ...drop,
                        y: drop.y + drop.speed * 8
                    }))
                    .filter(drop => drop.y < window.innerHeight + 50);

                return [...updatedDrops, ...newDrops];
            });
        }, 100);

        return () => clearInterval(interval);
    }, [asciiChars]);

    return (
        <div style={{ position: 'relative', overflow: 'hidden' }}>
            {/* ASCII Rain Background */}
            <div style={{ 
                position: 'fixed', 
                top: 0, 
                left: 0, 
                width: '100%', 
                height: '100%', 
                pointerEvents: 'none',
                zIndex: 0
            }}>
                {rainDrops.map(drop => (
                    <div
                        key={drop.id}
                        style={{
                            position: 'absolute',
                            left: drop.x,
                            top: drop.y,
                            color: '#8ec07c',
                            opacity: 0.8,
                            fontSize: '16px',
                            fontFamily: 'monospace',
                            textShadow: '0 0 3px #8ec07c'
                        }}
                    >
                        {drop.char}
                    </div>
                ))}
            </div>

            <main className="flex min-h-screen flex-col items-center justify-center bg-yellow-900" style={{ backgroundColor: '#282828', fontFamily: '"JetBrainsMono Nerd Font", "JetBrains Mono", "Fira Code", "Cascadia Code", "SF Mono", Monaco, "Inconsolata", "Roboto Mono", "Source Code Pro", "Ubuntu Mono", monospace', position: 'relative', zIndex: 1 }}>
                <h1 className="text-4xl font-bold mb-6" style={{ color: '#fabd2f' }}>
                {displayedText}
                <span style={{
                    opacity: showCursor ? 1 : 0,
                    color: '#fabd2f'
                }}>_</span>
            </h1>
            <p className="text-lg mb-6" style={{ color: '#ebdbb2' }}>
                Edit this text in <code className="px-2 py-1 rounded" style={{ backgroundColor: '#3c3836', color: '#8ec07c' }}>app/page.tsx</code> to make it yours.
            </p>
            <button
                className="px-6 py-3 rounded-lg shadow transition hover:shadow-lg"
                style={{
                    backgroundColor: '#cc241d',
                    color: '#fbf1c7'
                }}
                onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#fb4934'}
                onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#cc241d'}
            >
                Click Me!
            </button>
            </main>
        </div>
    );
}
