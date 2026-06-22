import { api, fallback } from ".";

type FolderTypes = "profiles" | "classes" | "posts" | "groups" | "activities"

export async function getPresignedUploadUrl(data: {
  fileName: string;
  contentType: string;
  folder: FolderTypes;
}): Promise<{
  uploadUrl: string;
  key: string;
  publicUrl: string;
}> {
  try {
    const response = await api.post("/uploads/presigned-url", data);
    return response.data;
  } catch (error) {
    return fallback(null)
  }  
}

export async function uploadImageToR2(
  file: File,
  folder: FolderTypes,
): Promise<string> {
  const { uploadUrl, publicUrl } = await getPresignedUploadUrl({
    fileName: file.name,
    contentType: file.type,
    folder,
  });

  const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!uploadResponse.ok) {
    throw new Error("Failed to upload image");
  }

  if (folder === "profiles") {
    return `${publicUrl}?v=${Date.now()}`;
  }

  return publicUrl;
}