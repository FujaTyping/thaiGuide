import { getAuth } from "firebase/auth";
import app from "@/lib/firebase"

const auth = getAuth(app);

export default auth;