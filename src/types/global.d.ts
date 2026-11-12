export {};

declare global {
    interface Window {
        gtag?: (...args: any[]) => void;
        fbq?: ((...args: any[]) => void) & { callMethod?: (...args: any[]) => void; queue?: any[]; push?: any; loaded?: boolean; version?: string };
        _fbq?: Window["fbq"];
        dataLayer?: any[];
    }
}
