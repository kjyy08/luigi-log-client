import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useOutlet } from "react-router-dom";
import { cloneElement } from "react";

/**
 * AnimatedOutlet
 *
 * 페이지 전환 시 깔끔하고 빠른 페이드 애니메이션을 제공합니다.
 * 순수한 opacity 전환으로 안정적이고 프로페셔널한 느낌을 제공합니다.
 */
export const AnimatedOutlet = () => {
    const location = useLocation();
    const element = useOutlet();

    return (
        <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
            <motion.div
                key={location.pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="w-full h-full"
            >
                {element && cloneElement(element, { key: location.pathname })}
            </motion.div>
        </AnimatePresence>
    );
};
