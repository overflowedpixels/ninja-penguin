
import React, { useEffect, useRef } from 'react';
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';
import { useLocation } from 'react-router-dom';

const ScrollWrapper = ({ children }) => {
    const scrollRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        if (!scrollRef.current) return;

        const scroll = new LocomotiveScroll({
            el: scrollRef.current,
            smooth: true,
            smoothMobile: true,
            smartphone: {
                smooth: true,
            },
            tablet: {
                smooth: true,
            },
        });

        // Update scroll on route change
        // Using a timeout to ensure DOM is rendered
        setTimeout(() => {
            scroll.update();
        }, 100);

        // Handle anchor links
        const handleAnchorLinks = (e) => {
            const target = e.target.closest('a');
            if (target && target.hash) {
                e.preventDefault();
                scroll.scrollTo(target.hash);
            }
        };

        // Custom handling for button clicks that might navigate to hash
        const handleHashNavigation = () => {
            if (window.location.hash) {
                scroll.scrollTo(window.location.hash);
            }
        };

        window.addEventListener('hashchange', handleHashNavigation);


        return () => {
            if (scroll) scroll.destroy();
            window.removeEventListener('hashchange', handleHashNavigation);
        };
    }, [location]); // Re-init or update on location change. Re-init might be safer for locomotive scroll 4.

    return (
        <div data-scroll-container ref={scrollRef}>
            {children}
        </div>
    );
};

export default ScrollWrapper;
