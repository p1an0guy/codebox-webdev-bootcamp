"use client";

import { useState, useEffect } from 'react';

export default function Home() {
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showCursor, setShowCursor] = useState(true);

    const fullText = "Welcome to p1an0_guy's Next.js Page!";

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

    // Matrix-style ASCII rain using Canvas
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const canvas = document.createElement('canvas');
        canvas.id = 'matrix';
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;
        document.body.appendChild(canvas);
        console.log('Canvas created and added to DOM', canvas.width, canvas.height);

        const characters = "!#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~'";
        const columns = 60;
        const drops: number[] = [];

        for (let i = 0; i < columns; i++) {
            drops[i] = 1;
        }

        function draw() {
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                console.log('Canvas context not available');
                return;
            }
            
            const fontSize = 16;

            // Fills the canvas with transparent background at low opacity, creating fade effect
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; // Very transparent black for fade effect
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#8ec07c'; // Gruvbox green
            ctx.font = 0.001 * fontSize * canvas.width + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const character = characters[Math.floor(Math.random() * characters.length)];

                ctx.fillText(
                    character,
                    i * (0.001 * fontSize + 0.001) * canvas.width,
                    drops[i] * (0.001 * fontSize) * canvas.width
                );

                if (
                    drops[i] * (0.001 * fontSize) * canvas.width > canvas.height &&
                    Math.random() > 0.975
                ) {
                    drops[i] = 0;
                }

                drops[i]++;
            }
        }

        function resizeCanvas() {
            canvas.width = window.innerWidth * 0.99;
            canvas.height = window.innerHeight;
        }

        window.addEventListener('resize', resizeCanvas, false);
        resizeCanvas();

        const interval = setInterval(draw, 50);

        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', resizeCanvas);
            if (canvas && canvas.parentNode) {
                canvas.parentNode.removeChild(canvas);
            }
        };
    }, []);

    return (
        <div style={{ backgroundColor: '#282828', minHeight: '100vh' }}>
            <main className="flex min-h-screen flex-col items-center justify-center" style={{ fontFamily: '"JetBrainsMono Nerd Font", "JetBrains Mono", "Fira Code", "Cascadia Code", "SF Mono", Monaco, "Inconsolata", "Roboto Mono", "Source Code Pro", "Ubuntu Mono", monospace', position: 'relative', zIndex: 10, backgroundColor: 'transparent' }}>
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
            <a
                href="https://github.com/p1an0guy"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-lg shadow transition hover:shadow-lg inline-block text-center no-underline"
                style={{
                    backgroundColor: '#cc241d',
                    color: '#fbf1c7'
                }}
                onMouseEnter={(e) => (e.target as HTMLAnchorElement).style.backgroundColor = '#fb4934'}
                onMouseLeave={(e) => (e.target as HTMLAnchorElement).style.backgroundColor = '#cc241d'}
            >
                Visit My GitHub!
            </a>
            </main>
        </div>
    );
}
