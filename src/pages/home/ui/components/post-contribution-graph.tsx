import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { postQueries } from "@/entities/post/model/post.queries";
import { Card } from "@/shared/ui/card";

const CELL_SIZE = 10;
const CELL_GAP = 3;
const ROW_COUNT = 7;
const MIN_COMPACT_CONTENT_WIDTH = 112;

const WEEKDAY_LABELS = [
	{ row: 2, label: "Mon" },
	{ row: 4, label: "Wed" },
	{ row: 6, label: "Fri" },
];

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
	if (count >= 4) return "bg-[#216e39] dark:bg-[#39d353]";
	if (count >= 3) return "bg-[#30a14e] dark:bg-[#26a641]";
	if (count >= 2) return "bg-[#40c463] dark:bg-[#006d32]";
	if (count >= 1) return "bg-[#9be9a8] dark:bg-[#0e4429]";
	return "bg-[#ebedf0] dark:bg-[#161b22]";
};

const getLastMonthRange = () => {
	const to = new Date();
	const from = new Date(to);
	const targetMonth = to.getMonth() - 1;
	const normalizedTargetMonth = (targetMonth + 12) % 12;

	from.setMonth(targetMonth);

	if (from.getMonth() !== normalizedTargetMonth) {
		from.setDate(0);
	}

	return {
		from: toDateKey(from),
		to: toDateKey(to),
	};
};

const getStartOfWeek = (date: Date) => {
	const start = new Date(date);
	start.setDate(date.getDate() - date.getDay());

	return start;
};

const getEndOfWeek = (date: Date) => {
	const end = new Date(date);
	end.setDate(date.getDate() + (ROW_COUNT - 1 - date.getDay()));

	return end;
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

const formatDate = (dateKey: string) => {
	const date = parseLocalDateKey(dateKey);

	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	}).format(date);
};

const formatRangeLabel = (dateKey: string) => {
	const date = parseLocalDateKey(dateKey);

	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
	}).format(date);
};

interface ContributionCell {
	date: string;
	count: number;
	isInRange: boolean;
}

export const PostContributionGraph = () => {
	const range = useMemo(() => getLastMonthRange(), []);
	const { data, isError, isLoading } = useQuery(
		postQueries.contributions(range),
	);

	const { weeks, rangeLabels } = useMemo(() => {
		const from = data?.from ?? range.from;
		const to = data?.to ?? range.to;
		const countByDate = new Map(
			data?.days.map((day) => [day.date, day.count]) ?? [],
		);
		const rangeStart = parseLocalDateKey(from);
		const rangeEnd = parseLocalDateKey(to);
		const calendarStart = getStartOfWeek(rangeStart);
		const calendarEnd = getEndOfWeek(rangeEnd);
		const allDates = getDateRange(toDateKey(calendarStart), toDateKey(calendarEnd));
		const nextWeeks: ContributionCell[][] = [];

		allDates.forEach((dateKey, index) => {
			const date = parseLocalDateKey(dateKey);
			const weekIndex = Math.floor(index / ROW_COUNT);
			const isInRange = date >= rangeStart && date <= rangeEnd;

			if (!nextWeeks[weekIndex]) {
				nextWeeks[weekIndex] = [];
			}

			nextWeeks[weekIndex].push({
				date: dateKey,
				count: isInRange ? (countByDate.get(dateKey) ?? 0) : 0,
				isInRange,
			});
		});

		return {
			weeks: nextWeeks,
			rangeLabels: {
				from: formatRangeLabel(from),
				to: formatRangeLabel(to),
			},
		};
	}, [data, range.from, range.to]);

	const graphWidth = weeks.length * CELL_SIZE + (weeks.length - 1) * CELL_GAP;
	const contentWidth = Math.max(graphWidth, MIN_COMPACT_CONTENT_WIDTH);
	const graphGridStyle = {
		gridTemplateColumns: `repeat(${weeks.length}, ${CELL_SIZE}px)`,
		columnGap: `${CELL_GAP}px`,
	};
	const totalCount = data?.totalCount ?? 0;
	const title = isError
		? "Unable to load post activity"
		: isLoading
			? "Loading posts..."
			: totalCount === 1
				? "1 post in the last month"
				: `${totalCount} posts in the last month`;

	return (
		<div className="min-w-0 space-y-2">
			<h2 className="text-base font-semibold">{title}</h2>
			<Card className="overflow-hidden border-border bg-background p-3 sm:p-4">
				<div className="overflow-x-auto pb-1">
					<div className="flex w-max max-w-full gap-2">
						<div
							className="grid w-6 shrink-0 pt-[22px] text-[10px] leading-[10px] text-muted-foreground"
							style={{ gridTemplateRows: `repeat(${ROW_COUNT}, ${CELL_SIZE}px)`, rowGap: `${CELL_GAP}px` }}
						>
							{WEEKDAY_LABELS.map((weekday) => (
								<span
									key={weekday.label}
									className="flex h-[10px] items-center"
									style={{ gridRowStart: weekday.row }}
								>
									{weekday.label}
								</span>
							))}
						</div>

						<div className="space-y-1.5" style={{ width: contentWidth }}>
							<div className="flex h-4 items-center justify-between gap-2 text-[10px] leading-4 text-muted-foreground">
								<span className="whitespace-nowrap">{rangeLabels.from}</span>
								<span className="whitespace-nowrap text-right">{rangeLabels.to}</span>
							</div>

							<div className="grid" style={graphGridStyle}>
								{weeks.map((week, weekIndex) => (
									<div key={weekIndex} className="grid gap-[3px]">
										{week.map((day) => {
											const postLabel = day.count === 1 ? "post" : "posts";
											const label = `${day.count} ${postLabel} on ${formatDate(day.date)}`;

											return (
												<div
													key={day.date}
													aria-hidden={!day.isInRange}
													aria-label={day.isInRange ? label : undefined}
													className={`h-[10px] w-[10px] rounded-[2px] ${
														day.isInRange
															? getContributionClassName(day.count)
															: "bg-transparent"
													}`}
													title={day.isInRange ? label : undefined}
												/>
											);
										})}
									</div>
								))}
							</div>

							<div className="mt-2 flex items-center justify-end gap-1 text-[11px] text-muted-foreground">
								<span>Less</span>
								{[0, 1, 2, 3, 4].map((count) => (
									<div
										key={count}
										className={`h-[10px] w-[10px] rounded-[2px] ${getContributionClassName(count)}`}
										aria-hidden="true"
									/>
								))}
								<span>More</span>
							</div>
						</div>
					</div>
				</div>
			</Card>
		</div>
	);
};
