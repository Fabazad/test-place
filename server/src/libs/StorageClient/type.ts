export type StorageClient = {
  generateUploadUrl: (params: {
    fileName: string;
    fileType: string;
  }) => Promise<{ uploadUrl: string; downloadUrl: string }>;
};
