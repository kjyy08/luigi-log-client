import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useOutlet } from "react-router-dom";
import { cloneElement } from "react";

/**
 * AnimatedOutlet
 *
 * Renders the current route's outlet with a fade/slide animation.
 * Also handles resetting scroll position on page exit.
 */
export const AnimatedOutlet = () => {
    const location = useLocation();
    const element = useOutlet();

    return (
        <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
            <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-full h-full"
            >
                {element && cloneElement(element, { key: location.pathname })}
            </motion.div>
        </AnimatePresence>
    );
};
