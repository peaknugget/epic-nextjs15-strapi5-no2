"use server";
import { z } from "zod";
import {
  ProfileFormSchema,
  ProfileImageFormSchema,
  ProfileImageFormState,
  type ProfileFormState,
} from "../validation/profile";
import { services } from "../services";
import { requireAuthUser } from "@/lib/auth-helpers";

export async function updateProfileAction(
  prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  console.log("🔖 updateProfileAction", formData);

  const fields = Object.fromEntries(formData);
  console.dir(fields);

  const validatedFields = ProfileFormSchema.safeParse(fields);

  if (!validatedFields.success) {
    const flattenedErrors = z.flattenError(validatedFields.error);
    console.log(
      "❌ updateProfileAction flattenedErrors",
      flattenedErrors.fieldErrors
    );
    return {
      success: false,
      message: "유효성 검사 실패",
      strapiErrors: null,
      zodErrors: flattenedErrors.fieldErrors,
      data: {
        ...prevState.data,
        ...fields,
      },
    } as ProfileFormState;
  }

  console.log("✅ updateProfileAction validatedFields", validatedFields.data);

  // // JWT 가져오기
  // const token = await getAuthTokenAction();
  // if (!token) throw new Error("로그인이 필요합니다.");

  // // 내 정보 조회
  // const me = await services.auth.getUserMeService(token);
  // if (!me.success || !me.data) throw new Error("사용자 정보를 불러올 수 없습니다.");

  const responseData = await services.profile.updateProfileService(
    validatedFields.data
  );

  if (responseData.error) {
    return {
      success: false,
      message: "Failed to Login.",
      strapiErrors: responseData.error,
      zodErrors: null,
      data: {
        ...prevState.data,
        ...fields,
      },
    };
  }

  console.log("#############");
  console.log("User Login Successfully", responseData);
  console.log("#############");

  return {
    success: false,
    message: "성공적으로 업데이트 처리되었습니다.",
    strapiErrors: null,
    zodErrors: null,
    data: {
      ...prevState.data,
      ...fields,
    },
  };
}


export async function updateProfileImageAction(
  prevState: ProfileImageFormState,
  formData: FormData
): Promise<ProfileImageFormState> {
  console.log("Hello From Update Profile Image Action");

  // Get current user
  const { user } = await requireAuthUser();
  if (!user) {
    return {
      success: false,
      message: "You are not authorized to perform this action.",
      strapiErrors: null,
      zodErrors: null,
      data: prevState.data,
    };
  }

  const currentImageId = user.image?.id;

  const image = formData.get("image") as File;

  if (!image || image.size === 0) {
    return {
      success: false,
      message: "No image provided",
      strapiErrors: null,
      zodErrors: { image: ["Image is required"] },
      data: prevState.data,
    };
  }

  const validatedFields = ProfileImageFormSchema.safeParse({ image });

  if (!validatedFields.success) {
    const flattenedErrors = z.flattenError(validatedFields.error);
    console.log("Validation failed:", flattenedErrors.fieldErrors);
    return {
      success: false,
      message: "Validation failed",
      strapiErrors: null,
      zodErrors: flattenedErrors.fieldErrors,
      data: prevState.data,
    };
  }

  console.log("Validation successful:", validatedFields.data);
  console.log(currentImageId);
  console.log(currentImageId);

  // Delete previous image if exists
  if (currentImageId) {
    console.log(currentImageId);
    try {
      await services.file.fileDeleteService(currentImageId);
    } catch (error) {
      console.error("Failed to delete previous image:", error);
      // Continue with upload even if delete fails
    }
  }

  // Upload new image to media library
  const fileUploadResponse = await services.file.fileUploadService(
    validatedFields.data.image
  );

  if (!fileUploadResponse.success || !fileUploadResponse.data) {
    return {
      success: false,
      message: "Failed to upload image",
      strapiErrors: fileUploadResponse.error,
      zodErrors: null,
      data: prevState.data,
    };
  }

  const uploadedImageId = fileUploadResponse.data[0].id;

  // Update user profile with new image
  const updateImageResponse = await services.profile.updateProfileImageService(user.id);
    
  if (!updateImageResponse.success) {
    return {
      success: false,
      message: "Failed to update profile with new image",
      strapiErrors: updateImageResponse.error,
      zodErrors: null,
      data: prevState.data,
    };
  }

  console.log("#############");
  console.log("Profile Image Updated Successfully");
  console.log("#############");

  return {
    success: true,
    message: "Profile image updated successfully",
    strapiErrors: null,
    zodErrors: null,
    data: {
      image: validatedFields.data.image,
    },
  };
}

