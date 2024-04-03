import { initAuth } from "../../../src/main";

const auth = initAuth({ authApiPath: "http://localhost:3000/auth" });

export default auth;
