import { motion } from 'framer-motion';

const glitchVariants = {
    animate: {
        x: [0, -3, 4, -2, 0, 3, -4, 0],
        transition: {
            duration: 0.4,
            repeat: Infinity,
            repeatDelay: 3,
            ease: 'easeInOut',
        },
    },
};

export default function GlitchText({ children, className = '' }) {
    return (
        <motion.span
            variants={glitchVariants}
            animate="animate"
            className={`inline-block ${className}`}
            style={{ willChange: 'transform' }}
        >
            {children}
        </motion.span>
    );
}
