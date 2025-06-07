import app from "./firebase";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";

let analyticsPromise: Promise<Analytics | undefined>;

if (typeof window !== "undefined") {
    analyticsPromise = isSupported().then((supported) => {
        if (supported) {
            return getAnalytics(app);
        } else {
            console.warn("Firebase Analytics is not supported in this environment.");
            return undefined;
        }
    });
} else {
    analyticsPromise = Promise.resolve(undefined);
}

export { analyticsPromise };