import * as authActions from "./auth";
import * as  updateProfileAction from "./profile";

export const actions={
    auth:{
        ...authActions
    },
    profile: updateProfileAction
}