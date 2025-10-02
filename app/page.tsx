"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './page.module.css';

export default function Home() {
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showCursor, setShowCursor] = useState(true);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHoveringClickable, setIsHoveringClickable] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const repulsionActive = true;

    const fullText = "Welcome to p1an0_guy&apos;s Next.js Page!";

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

    // Mobile detection
    useEffect(() => {
        const checkIfMobile = () => {
            const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
            const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase()) ||
                ('ontouchstart' in window) ||
                (navigator.maxTouchPoints > 0);
            setIsMobile(isMobileDevice);
        };

        checkIfMobile();

        // Also check on resize in case device orientation changes
        window.addEventListener('resize', checkIfMobile);
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    // Matrix-style ASCII rain using Canvas
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const canvas = document.createElement('canvas');
        canvas.id = 'matrix';
        canvas.className = styles['matrix-canvas'];
        document.body.appendChild(canvas);
        console.log('Canvas created and added to DOM', canvas.width, canvas.height);

        const characters = "!#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~'";
        const columns = Math.floor(window.innerWidth / 12); // More columns with tighter spacing
        const drops: number[] = [];
        let currentMousePos = { x: 0, y: 0 }; // Local mouse position for draw function

        for (let i = 0; i < columns; i++) {
            drops[i] = Math.floor(Math.random() * canvas.height / 12);
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
                const charX = i * columnWidth;
                const charY = drops[i] * fontSize;

                // Create cascading umbrella effect (only if repulsion is active)
                const horizontalDistance = charX - currentMousePos.x; // Keep sign for left/right
                const verticalDistance = charY - currentMousePos.y;
                const isUnderCursor = verticalDistance > 0; // Character is below cursor
                const umbrellaWidth = 120; // Width of umbrella effect
                const umbrellaHeight = 200; // How far down the umbrella effect extends

                // Create curved cascading effect - rain flows in parabolic arcs
                let cascadeOffset = 0;
                if (repulsionActive && isUnderCursor && Math.abs(horizontalDistance) < umbrellaWidth) {
                    // Calculate cascade with curved trajectory (parabolic)
                    const fallDistance = Math.min(verticalDistance, umbrellaHeight);
                    const normalizedFall = fallDistance / umbrellaHeight; // 0 to 1

                    // Create parabolic curve: starts slow, accelerates, then levels off
                    const curveStrength = Math.sin(normalizedFall * Math.PI * 0.8); // Sine curve for natural arc
                    const maxDeflection = 80; // Increased max deflection for more dramatic curve

                    // Add some randomness for natural water variation
                    const randomVariation = (Math.sin(charY * 0.1 + charX * 0.05) * 0.3 + 1); // 0.7 to 1.3 multiplier

                    cascadeOffset = curveStrength * maxDeflection * randomVariation;

                    // Determine cascade direction based on which side of cursor
                    if (horizontalDistance >= 0) {
                        cascadeOffset = cascadeOffset; // Right side - push right
                    } else {
                        cascadeOffset = -cascadeOffset; // Left side - push left
                    }
                }

                // Adjusted position after cascade
                const effectiveX = charX + cascadeOffset;
                const adjustedHorizontalDistance = effectiveX - currentMousePos.x;

                // Check if character is in the umbrella shadow zone (after cascade)
                const inUmbrellaZone =
                    isUnderCursor &&
                    Math.abs(adjustedHorizontalDistance) < umbrellaWidth * 0.7 && // Smaller core shadow
                    verticalDistance < umbrellaHeight;

                // Small exclusion zone directly around cursor
                const directDistance = Math.sqrt(
                    Math.pow(charX - currentMousePos.x, 2) + Math.pow(charY - currentMousePos.y, 2)
                );
                const tooCloseToCursor = directDistance < 50;

                // Only draw character if it's not in umbrella zone and not too close to cursor
                if (!inUmbrellaZone && !tooCloseToCursor) {
                    // Draw with cascade offset for dramatic effect
                    ctx.fillText(character, effectiveX, charY);
                }

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

        // Update local mouse position for cursor avoidance
        const handleMatrixMouseMove = (e: MouseEvent) => {
            currentMousePos = { x: e.clientX, y: e.clientY };
        };

        window.addEventListener('resize', resizeCanvas, false);
        window.addEventListener('mousemove', handleMatrixMouseMove, false);
        resizeCanvas();

        const interval = setInterval(draw, 50);

        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMatrixMouseMove);
            if (canvas && canvas.parentNode) {
                canvas.parentNode.removeChild(canvas);
            }
        };
    }, [repulsionActive]);

    // Custom retro mouse cursor tracking (desktop only)
    useEffect(() => {
        if (typeof window === 'undefined' || isMobile) return;

        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };

        // Hide default cursor on the entire document (desktop only)
        document.body.style.cursor = 'none';

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.body.style.cursor = 'auto';
        };
    }, [isMobile]);

    return (
        <div style={{ backgroundColor: '#282828', minHeight: '100vh' }}>
            {/* Custom Retro Cursor with Image Switching (Desktop Only) */}
            {!isMobile && (
                <Image
                    src={isHoveringClickable ? '/img/clicker.png' : '/img/pointer.png'}
                    alt="cursor"
                    width={24}
                    height={32}
                    className={styles['custom-cursor']}
                    style={{
                        left: mousePos.x,
                        top: mousePos.y,
                    }}
                />
            )}

            <main className={`flex min-h-screen flex-col items-center justify-center ${styles['main-container']}`}>
                <h1 className={styles['main-title']}>
                    {displayedText}
                    <span className={`${styles['blinking-cursor']} ${showCursor ? styles.visible : styles.hidden}`}>_</span>
                </h1>
                <div className={styles['about-section']}>
                    <h2 className={styles['about-heading']}>
                        About Me
                    </h2>
                    <p className={styles['about-paragraph']}>
                        Welcome! I&apos;m p1an0_guy (aka Jonah), a first year Computer Engineer at Cal Poly.
                    </p>
                    <p className={styles['about-paragraph']}>
                        I specialize in <code className={styles['code-highlight']}>Python</code> and <code className={styles['code-highlight']}>C++</code>, and I have experience developing Full Stack Generative AI applications on AWS Cloud technology.
                    </p>
                    <p className={styles['about-paragraph']}>
                        When I&apos;m not coding, you&apos;ll find me practicing my instruments, poking around with Unix operating systems, or cooking in the dorm kitchens.
                    </p>
                    <p className={styles['about-paragraph-last']}>
                        I look forward to joining CodeBox this year and being part of a project that will make a difference in the real world!
                    </p>
                </div>
                <a
                    href="https://github.com/p1an0guy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles['github-button']}
                    onMouseEnter={() => setIsHoveringClickable(true)}
                    onMouseLeave={() => setIsHoveringClickable(false)}
                >
                    Visit My GitHub!
                </a>
            </main>
        </div>
    );
}
