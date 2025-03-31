'use client';

import { useEffect, useState } from 'react';
import { useTheme } from "next-themes";
import { useAppSelector } from '@/redux/hooks';
import { getThemeColors } from '@/utils/theme-utils';
import { hexToRgba } from '@/utils/color-utils';

export default function MouseGridBackground() {
    const { resolvedTheme } = useTheme();
    const { colorScheme, customThemeColors } = useAppSelector(state => state.settings);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
            setIsVisible(true);
        };

        const handleMouseLeave = () => setIsVisible(false);

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    const [gridColor, setGridColor] = useState("rgba(120,119,198,0.2)");

    useEffect(() => {
        const isDarkMode = resolvedTheme === 'dark';

        if (colorScheme === 'Custom') {
            const colors = isDarkMode
                ? customThemeColors?.dark
                : customThemeColors?.light;
            if (colors?.primary) {
                setGridColor(hexToRgba(colors.primary, 0.2));
            }
        } else if (colorScheme && colorScheme !== 'Default') {
            const colors = getThemeColors(colorScheme, isDarkMode);
            setGridColor(hexToRgba(colors?.primary, 0.2));
        } else {
            setGridColor(isDarkMode ? "rgba(138,43,226,0.2)" : "rgba(120,119,198,0.2)");
        }
    }, [colorScheme, resolvedTheme, customThemeColors?.dark, customThemeColors?.light]);

    return (
        <div className="fixed inset-0 z-[-1] h-full w-full pointer-events-none">
            <div
                className="absolute inset-0 h-full w-full"
                style={{
                    backgroundImage: `linear-gradient(to right, ${gridColor} 1px, transparent 1px), linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)`,
                    backgroundSize: '80px 80px',
                    maskImage: isVisible
                        ? `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, black 30px, transparent 120px)`
                        : 'none',
                    WebkitMaskImage: isVisible
                        ? `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, black 30px, transparent 120px)`
                        : 'none',
                    opacity: isVisible ? 1 : 0,
                    transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
            />
        </div>
    );
}
