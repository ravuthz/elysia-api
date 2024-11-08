import router from "./core/router";
import { UserController } from "./controllers/user.controller";

router.resource('/users', UserController);

export default router;