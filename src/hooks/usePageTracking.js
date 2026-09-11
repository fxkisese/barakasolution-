import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '@/utils/analytics';

/**
 * usePageTracking — fires a page_view analytics event on every route change.
 * Add this hook once inside a component that lives inside <Router>.
 */
export function usePageTracking() {
    const location = useLocation();

    useEffect(() => {
        trackPageView(location.pathname + location.search);
    }, [location.pathname, location.search]);
}
