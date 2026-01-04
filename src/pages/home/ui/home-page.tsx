import { Button } from "@/shared/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { Luigi3DBackground, LuigiHeroLogo } from "@/features/hero-3d";

export const HomePage = () => {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
            },
        },
    };

    return (
        <div className="relative z-0 flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] overflow-hidden">
            <Luigi3DBackground />

            <div className="container relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20 px-6">
                <motion.div
                    className="flex items-center justify-center h-[400px] lg:h-[600px] w-full"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <LuigiHeroLogo />
                </motion.div>

                <motion.div
                    className="space-y-8 text-center lg:text-left flex flex-col items-center lg:items-start"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div variants={itemVariants}>
                        <div className="inline-block px-4 py-1.5 mb-2 text-sm font-bold rounded-full bg-luigi-green/20 text-luigi-green border border-luigi-green/30 backdrop-blur-md shadow-lg shadow-luigi-green/10">
                            Welcome to my creative space
                        </div>
                    </motion.div>

                    <motion.h1
                        variants={itemVariants}
                        className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter bg-gradient-to-br from-luigi-green via-luigi-green to-luigi-blue bg-clip-text text-transparent pb-4 drop-shadow-2xl"
                        style={{ lineHeight: 1.1 }}
                    >
                        Fun,<br />Professional,<br />Unique.
                    </motion.h1>

                    <motion.p
                        variants={itemVariants}
                        className="text-xl text-foreground md:text-2xl font-medium leading-tight max-w-2xl drop-shadow-sm"
                    >
                        개발자 <span className="font-extrabold text-luigi-green underline underline-offset-8 decoration-luigi-green/50">Luigi</span>의 기술 블로그에 오신 것을 환영합니다.
                    </motion.p>

                    <motion.div
                        variants={itemVariants}
                        className="space-y-4 text-base md:text-lg text-foreground/90 max-w-2xl font-semibold leading-relaxed"
                    >
                        <p className="drop-shadow-sm">여기는 기술적인 고민과 성장을 기록하는 공간입니다.</p>
                        <p className="hidden md:block drop-shadow-sm">딱딱한 기술 생태계에 약간의 유머와 활기를 더하고 싶습니다.</p>
                    </motion.div>

                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row gap-6 mt-6 w-full justify-center lg:justify-start"
                    >
                        <Button asChild size="lg" className="h-16 bg-luigi-green hover:bg-luigi-green/90 text-white font-black rounded-2xl px-12 text-xl shadow-2xl shadow-luigi-green/40 transition-all duration-300 transform-gpu hover:scale-105 active:scale-95 border-b-4 border-luigi-blue/20" style={{ backfaceVisibility: 'hidden' }}>
                            <Link to="/blog">
                                Browse Posts <ArrowRight className="ml-2 h-7 w-7" />
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="h-16 rounded-2xl px-12 text-xl border-4 border-luigi-blue/30 text-foreground font-bold hover:bg-luigi-blue/10 backdrop-blur-md transition-all duration-300 transform-gpu hover:scale-105 active:scale-95 shadow-xl" style={{ backfaceVisibility: 'hidden' }}>
                            <Link to="/about">
                                About Me
                            </Link>
                        </Button>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};
