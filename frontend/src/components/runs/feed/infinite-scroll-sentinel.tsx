import { useEffect, useRef } from "react";

export function InfiniteScrollSentinel(props: {
	enabled: boolean;
	onIntersect: () => void;
}) {
	const ref = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!props.enabled) {
			return;
		}

		const node = ref.current;
		if (!node) {
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				const entry = entries[0];
				if (entry?.isIntersecting) {
					props.onIntersect();
				}
			},
			{
				rootMargin: "300px 0px",
			},
		);

		observer.observe(node);

		return () => {
			observer.disconnect();
		};
	}, [props.enabled, props.onIntersect]);

	return <div ref={ref} className="h-8 w-full" aria-hidden="true" />;
}
