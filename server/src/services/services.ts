import { initUserService } from "./userService"

export const initServices = (router) => {
    initUserService(router);
}