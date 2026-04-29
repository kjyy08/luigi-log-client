import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { shouldScrollRouteToTop } from "@/entities/post/model/adjacent-post-navigation";

export const RouteScrollRestoration = () => {
	const location = useLocation();
	const previousPathnameRef = useRef(location.pathname);

	useEffect(() => {
		const previousPathname = previousPathnameRef.current;

		if (shouldScrollRouteToTop(previousPathname, location.pathname, location.hash)) {
			window.scrollTo({ top: 0, left: 0, behavior: "auto" });
		}

		previousPathnameRef.current = location.pathname;
	}, [location.hash, location.pathname]);

	return null;
};
