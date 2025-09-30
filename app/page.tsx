"use client";

import { useState, useEffect } from 'react';

export default function Home() {
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showCursor, setShowCursor] = useState(true);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHoveringClickable, setIsHoveringClickable] = useState(false);

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
        const columns = Math.floor(window.innerWidth / 12); // More columns with tighter spacing
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

            const fontSize = 12; // Fixed small font size
            const columnWidth = 12; // Tighter column spacing for more density

            // Fills the canvas with transparent background at low opacity, creating fade effect
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; // Very transparent black for fade effect
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#8ec07c'; // Gruvbox green
            ctx.font = fontSize + 'px monospace'; // Fixed font size

            for (let i = 0; i < drops.length; i++) {
                const character = characters[Math.floor(Math.random() * characters.length)];

                ctx.fillText(
                    character,
                    i * columnWidth, // Fixed column spacing
                    drops[i] * fontSize // Fixed row spacing
                );

                if (
                    drops[i] * fontSize > canvas.height &&
                    Math.random() > 0.95
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

    // Custom retro mouse cursor tracking
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };

        // Hide default cursor on the entire document
        document.body.style.cursor = 'none';

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.body.style.cursor = 'auto';
        };
    }, []);

    return (
        <div style={{ backgroundColor: '#282828', minHeight: '100vh' }}>
            {/* Custom Retro Cursor with Image Switching */}
            <img
                src={isHoveringClickable ? '/img/clicker.png' : '/img/pointer.png'}
                alt="cursor"
                style={{
                    position: 'fixed',
                    left: mousePos.x,
                    top: mousePos.y,
                    width: '24px',
                    height: '32px',
                    pointerEvents: 'none',
                    zIndex: 9999,
                    filter: 'drop-shadow(0 0 6px rgba(250, 189, 47, 0.3)) drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.8))',
                    imageRendering: 'pixelated'
                }}
            />

            <main className="flex min-h-screen flex-col items-center justify-center" style={{ fontFamily: '"JetBrainsMono Nerd Font", "JetBrains Mono", "Fira Code", "Cascadia Code", "SF Mono", Monaco, "Inconsolata", "Roboto Mono", "Source Code Pro", "Ubuntu Mono", monospace', position: 'relative', zIndex: 10, backgroundColor: 'transparent' }}>
                <h1 style={{
                    color: '#fabd2f',
                    fontSize: '48px',
                    fontWeight: 'bold',
                    marginBottom: '24px',
                    textShadow: '0 0 10px rgba(250, 189, 47, 0.8), 0 0 20px rgba(250, 189, 47, 0.6), 0 0 30px rgba(250, 189, 47, 0.4), 2px 2px 4px rgba(0, 0, 0, 0.8)'
                }}>
                    {displayedText}
                    <span style={{
                        opacity: showCursor ? 1 : 0,
                        color: '#fabd2f',
                        textShadow: '0 0 10px rgba(250, 189, 47, 0.8), 0 0 20px rgba(250, 189, 47, 0.6), 0 0 30px rgba(250, 189, 47, 0.4), 2px 2px 4px rgba(0, 0, 0, 0.8)'
                    }}>_</span>
                </h1>
                <p style={{
                    color: '#ebdbb2',
                    fontSize: '20px',
                    marginBottom: '24px',
                    textShadow: '0 0 8px rgba(235, 219, 178, 0.6), 2px 2px 4px rgba(0, 0, 0, 0.8)'
                }}>
                    Edit this text in <code style={{
                        backgroundColor: '#3c3836',
                        color: '#8ec07c',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '18px',
                        textShadow: '0 0 6px rgba(142, 192, 124, 0.5), 1px 1px 2px rgba(0, 0, 0, 0.8)'
                    }}>app/page.tsx</code> to make it yours.
                </p>
                <a
                    href="https://github.com/p1an0guy"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        backgroundColor: '#cc241d',
                        color: '#fbf1c7',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        textDecoration: 'none',
                        display: 'inline-block',
                        textAlign: 'center',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3), 0 0 15px rgba(204, 36, 29, 0.4)',
                        textShadow: '0 0 8px rgba(251, 241, 199, 0.6), 2px 2px 4px rgba(0, 0, 0, 0.8)'
                    }}
                    onMouseEnter={(e) => {
                        (e.target as HTMLAnchorElement).style.backgroundColor = '#fb4934';
                        (e.target as HTMLAnchorElement).style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.4), 0 0 20px rgba(251, 73, 52, 0.5)';
                        setIsHoveringClickable(true);
                    }}
                    onMouseLeave={(e) => {
                        (e.target as HTMLAnchorElement).style.backgroundColor = '#cc241d';
                        (e.target as HTMLAnchorElement).style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3), 0 0 15px rgba(204, 36, 29, 0.4)';
                        setIsHoveringClickable(false);
                    }}
                >
                    Visit My GitHub!
                </a>
            </main>
        </div>
    );
}
