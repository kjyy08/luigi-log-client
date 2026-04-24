import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { postQueries } from "@/entities/post/model/post.queries";
import { Card } from "@/shared/ui/card";

const toDateKey = (date: Date) => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");

	return `${year}-${month}-${day}`;
};

const parseLocalDateKey = (dateKey: string) => {
	const [year, month, day] = dateKey.split("-").map(Number);

	return new Date(year, month - 1, day);
};

const getContributionClassName = (count: number) => {
	if (count >= 4) return "bg-[#216e39]";
	if (count >= 3) return "bg-[#30a14e]";
	if (count >= 2) return "bg-[#40c463]";
	if (count >= 1) return "bg-[#9be9a8]";
	return "bg-[#ebedf0] dark:bg-[#161b22]";
};

const getLastYearRange = () => {
	const to = new Date();
	const from = new Date(to);
	from.setDate(to.getDate() - 364);

	return {
		from: toDateKey(from),
		to: toDateKey(to),
	};
};

const getDateRange = (from: string, to: string) => {
	const dates: string[] = [];
	const current = parseLocalDateKey(from);
	const end = parseLocalDateKey(to);

	while (current <= end) {
		dates.push(toDateKey(current));
		current.setDate(current.getDate() + 1);
	}

	return dates;
};

export const PostContributionGraph = () => {
	const range = useMemo(() => getLastYearRange(), []);
	const { data, isError, isLoading } = useQuery(
		postQueries.contributions(range),
	);

	const days = useMemo(() => {
		const countByDate = new Map(
			data?.days.map((day) => [day.date, day.count]) ?? [],
		);

		return getDateRange(data?.from ?? range.from, data?.to ?? range.to).map(
			(date) => ({
				date,
				count: countByDate.get(date) ?? 0,
			}),
		);
	}, [data, range.from, range.to]);

	const monthLabels = useMemo(() => {
		const formatter = new Intl.DateTimeFormat("en", { month: "short" });

		return days
			.filter((date) => date.date.endsWith("-01"))
			.map((date) => ({
				key: date.date,
				label: formatter.format(new Date(`${date.date}T00:00:00`)),
			}));
	}, [days]);

	return (
		<div className="min-w-0 space-y-2">
			<h2 className="text-base font-semibold">
				{isError
					? "Unable to load post activity"
					: isLoading
						? "Loading posts..."
						: `${data?.totalCount ?? 0} posts in the last year`}
			</h2>
			<Card className="overflow-hidden bg-background border-border p-2 sm:p-4">
				<div className="flex min-w-0 gap-2">
					<div className="flex shrink-0 flex-col justify-between pt-6 text-[10px] text-muted-foreground leading-[12px] sm:leading-[13px]">
						<span>Mon</span>
						<span>Wed</span>
						<span>Fri</span>
					</div>

					<div className="flex min-w-0 flex-1 flex-col gap-1 overflow-x-auto pb-1">
						<div className="flex min-w-[680px] justify-between px-1 text-[10px] text-muted-foreground sm:min-w-max">
							{monthLabels.map((month) => (
								<span key={month.key}>{month.label}</span>
							))}
						</div>

						<div className="grid h-[92px] min-w-[680px] grid-flow-col grid-rows-7 gap-[2px] sm:h-[100px] sm:min-w-max sm:gap-[3px]">
							{days.map((day) => (
								<div
									key={day.date}
									className={`h-[9px] w-[9px] rounded-sm sm:h-[10px] sm:w-[10px] ${getContributionClassName(day.count)}`}
									title={`${day.date}: ${day.count} posts`}
								/>
							))}
						</div>
						<div className="mt-2 flex flex-wrap items-center justify-end gap-1.5 text-xs text-muted-foreground sm:gap-2">
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
