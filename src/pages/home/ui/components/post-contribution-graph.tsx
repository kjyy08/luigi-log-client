import { Card } from "@/shared/ui/card";

export const PostContributionGraph = () => {
    // Generate a simple contribution grid visualization
    const days = Array.from({ length: 365 }, () => {
        const value = Math.random();
        if (value > 0.9) return "bg-[#216e39]"; // High
        if (value > 0.7) return "bg-[#30a14e]"; // Medium
        if (value > 0.4) return "bg-[#40c463]"; // Low
        if (value > 0.2) return "bg-[#9be9a8]"; // Very Low
        return "bg-[#ebedf0] dark:bg-[#161b22]"; // None
    });

    return (
        <div className="space-y-2">
            <h2 className="text-base font-semibold">87 posts in the last year</h2>
            <Card className="bg-background border-border p-4">
                <div className="flex gap-2">
                    {/* Day labels */}
                    <div className="flex flex-col justify-between pt-6 text-[10px] text-muted-foreground leading-[13px]">
                        <span>Mon</span>
                        <span>Wed</span>
                        <span>Fri</span>
                    </div>

                    <div className="flex flex-col gap-1 overflow-x-auto flex-1">
                        {/* Month labels - Simplified approximation */}
                        <div className="flex justify-between text-[10px] text-muted-foreground px-1">
                            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                            <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                        </div>

                        <div className="grid grid-rows-7 grid-flow-col gap-[3px] h-[100px] min-w-max">
                            {days.map((bg, index) => (
                                <div key={index} className={`w-[10px] h-[10px] rounded-sm ${bg}`} title={`Posts: ${bg}`} />
                            ))}
                        </div>
                        <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground mt-2">
                            <span>Less</span>
                            <div className="w-[10px] h-[10px] bg-[#ebedf0] dark:bg-[#161b22] rounded-sm" />
                            <div className="w-[10px] h-[10px] bg-[#9be9a8] rounded-sm" />
                            <div className="w-[10px] h-[10px] bg-[#40c463] rounded-sm" />
                            <div className="w-[10px] h-[10px] bg-[#30a14e] rounded-sm" />
                            <div className="w-[10px] h-[10px] bg-[#216e39] rounded-sm" />
                            <span>More</span>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};
