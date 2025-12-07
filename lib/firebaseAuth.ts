import { getAuth, browserLocalPersistence, initializeAuth, browserPopupRedirectResolver, Auth } from "firebase/auth";
import app from "@/lib/firebase"

let auth: Auth;

if (typeof window !== 'undefined') {
    auth = initializeAuth(app, {
        persistence: browserLocalPersistence,
        popupRedirectResolver: browserPopupRedirectResolver
    });
} else {
    auth = getAuth(app);
}

export default auth;