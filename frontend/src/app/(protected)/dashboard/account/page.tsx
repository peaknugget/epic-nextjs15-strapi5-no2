import { ProfileForm } from "@/components/form/profile-form";
import { ProfileImageForm } from "@/components/form/profile-image-form";
import { actions } from "@/data/actions";
import { validateApiResponse } from "@/lib/error-handler";
import { TAuthUser } from "@/types";

 
export default async function AccountRoute() {
  const user = await actions.auth.getUserMeAction();
  const userData = validateApiResponse(user, "user profile") as TAuthUser;
  const userImage = userData?.image;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 p-4">
      <ProfileForm user={userData} className="col-span-3" /> 
       <ProfileImageForm image={userImage} className="col-span-2" /> 
    </div>
  );
  
}