import { Button } from "@/shared/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const HomePage = () => {
    return (
        <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center gap-10 py-20 overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-luigi-green/20 rounded-full blur-[100px] -z-10 animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-luigi-blue/10 rounded-full blur-[100px] -z-10 animate-pulse" style={{ animationDelay: '1s' }} />

            <div className="space-y-6 max-w-4xl animate-fade-in-up">
                <div className="inline-block px-4 py-1.5 mb-2 text-sm font-medium rounded-full bg-luigi-green/10 text-luigi-green border border-luigi-green/20">
                    Welcome to my creative space
                </div>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter bg-gradient-to-br from-luigi-green via-luigi-blue to-luigi-blue bg-clip-text text-transparent pb-4">
                    Fun, Professional, Unique.
                </h1>
                <p className="text-xl text-muted-foreground md:text-2xl font-light leading-relaxed max-w-2xl mx-auto">
                    개발자 <span className="font-bold text-foreground underline underline-offset-4 decoration-luigi-green/30">Luigi</span>의 기술 블로그에 오신 것을 환영합니다.
                </p>
                <div className="space-y-2 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto font-medium opacity-80">
                    <p>여기는 기술적인 고민과 성장을 기록하는 공간입니다.</p>
                    <p className="hidden md:block">딱딱한 기술 생태계에 약간의 유머와 활기를 더하고 싶습니다.</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 mt-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <Button asChild size="lg" className="h-14 bg-luigi-green hover:bg-luigi-green/90 text-white font-bold rounded-2xl px-10 text-lg shadow-xl shadow-luigi-green/30 transition-all hover:scale-105 active:scale-95">
                    <Link to="/posts">
                        Browse All Posts <ArrowRight className="ml-2 h-6 w-6" />
                    </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-14 rounded-2xl px-10 text-lg border-2 hover:bg-accent/50 transition-all hover:scale-105 active:scale-95">
                    <Link to="/about">
                        About Me
                    </Link>
                </Button>
            </div>
        </div>
    );
};

