import React, { useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
    onReveal: () => void;
    children: React.ReactNode;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({ onReveal, children }) => {
    const revealRef = useRef<HTMLDivElement | null>(null);
    const [hasRevealed, setHasRevealed] = useState(false);

    useEffect(() => {
        if (!revealRef.current || hasRevealed) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    onReveal();
                    setHasRevealed(true);
                    observer.unobserve(entry.target); // Unobserve the element after revealing
                }
            },
            {
                root: null, // Use the viewport as the container
                rootMargin: "0px",
                threshold: 0.1, // Adjust this value based on when you want to trigger the callback
            },
        );

        observer.observe(revealRef.current);

        return () => {
            if (revealRef.current) {
                observer.unobserve(revealRef.current);
            }
        };
    }, [onReveal, hasRevealed]);

    return <div ref={revealRef}>{children}</div>;
};

export default ScrollReveal;
