import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { postQueries } from "@/entities/post/model/post.queries";
import { Card } from "@/shared/ui/card";

const CELL_SIZE = 10;
const CELL_GAP = 3;
const ROW_COUNT = 7;

const WEEKDAY_LABELS = [
	{ row: 2, label: "월" },
	{ row: 4, label: "수" },
	{ row: 6, label: "금" },
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

const getLastYearRange = () => {
	const to = new Date();
	const from = new Date(to);
	from.setDate(to.getDate() - 364);

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

const formatKoreanDate = (dateKey: string) => {
	const date = parseLocalDateKey(dateKey);

	return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
};

interface ContributionCell {
	date: string;
	count: number;
	isInRange: boolean;
}

export const PostContributionGraph = () => {
	const range = useMemo(() => getLastYearRange(), []);
	const { data, isError, isLoading } = useQuery(
		postQueries.contributions(range),
	);

	const { weeks, monthLabels } = useMemo(() => {
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
		const nextMonthLabels: Array<{ key: string; label: string; weekIndex: number }> = [];
		const formatter = new Intl.DateTimeFormat("ko-KR", { month: "short" });

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

			if (isInRange && date.getDate() === 1) {
				nextMonthLabels.push({
					key: dateKey,
					label: formatter.format(date),
					weekIndex,
				});
			}
		});

		return { weeks: nextWeeks, monthLabels: nextMonthLabels };
	}, [data, range.from, range.to]);

	const graphWidth = weeks.length * CELL_SIZE + (weeks.length - 1) * CELL_GAP;
	const graphGridStyle = {
		gridTemplateColumns: `repeat(${weeks.length}, ${CELL_SIZE}px)`,
		columnGap: `${CELL_GAP}px`,
	};
	const title = isError
		? "게시글 활동을 불러올 수 없습니다"
		: isLoading
			? "게시글을 불러오는 중..."
			: `최근 12개월 게시글 ${data?.totalCount ?? 0}개`;

	return (
		<div className="min-w-0 space-y-2">
			<h2 className="text-base font-semibold">{title}</h2>
			<Card className="overflow-hidden border-border bg-background p-3 sm:p-4">
				<div className="overflow-x-auto pb-1">
					<div className="flex w-max min-w-[690px] gap-2">
						<div
							className="grid shrink-0 pt-[22px] text-[10px] leading-[10px] text-muted-foreground"
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

						<div className="space-y-1.5" style={{ width: graphWidth }}>
							<div
								className="grid h-4 text-[10px] leading-4 text-muted-foreground"
								style={graphGridStyle}
							>
								{monthLabels.map((month) => (
									<span
										key={month.key}
										className="whitespace-nowrap"
										style={{ gridColumnStart: month.weekIndex + 1 }}
									>
										{month.label}
									</span>
								))}
							</div>

							<div className="grid" style={graphGridStyle}>
								{weeks.map((week, weekIndex) => (
									<div key={weekIndex} className="grid gap-[3px]">
										{week.map((day) => {
											const label = `${formatKoreanDate(day.date)} 게시글 ${day.count}개`;

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
								<span>적음</span>
								{[0, 1, 2, 3, 4].map((count) => (
									<div
										key={count}
										className={`h-[10px] w-[10px] rounded-[2px] ${getContributionClassName(count)}`}
										aria-hidden="true"
									/>
								))}
								<span>많음</span>
							</div>
						</div>
					</div>
				</div>
			</Card>
		</div>
	);
};
