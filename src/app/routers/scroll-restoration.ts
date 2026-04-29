import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

interface ScrollLocation {
	pathname: string;
	hash: string;
}

export const shouldScrollToTopOnLocationChange = (
	previousLocation: ScrollLocation | null,
	currentLocation: ScrollLocation,
) => {
	if (currentLocation.hash) return false;
	if (!previousLocation) return true;
	return previousLocation.pathname !== currentLocation.pathname;
};

export const ScrollRestoration = () => {
	const location = useLocation();
	const previousLocationRef = useRef<ScrollLocation | null>(null);

	useEffect(() => {
		const currentLocation = {
			pathname: location.pathname,
			hash: location.hash,
		};

		if (shouldScrollToTopOnLocationChange(previousLocationRef.current, currentLocation)) {
			window.scrollTo({ top: 0, left: 0, behavior: "auto" });
		}

		previousLocationRef.current = currentLocation;
	}, [location.pathname, location.hash]);

	return null;
};
