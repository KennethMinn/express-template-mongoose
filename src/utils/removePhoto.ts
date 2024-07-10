import fs from "fs";

export const removePhotoIfExists = async (path: string) => {
  let fileExists;
  const fsPromise = fs.promises;

  try {
    await fsPromise.access(path); // Check if the file exists and is accessible
    fileExists = true;
  } catch {
    fileExists = false;
  }

  if (fileExists) {
    await fsPromise.unlink(path); //Delete the file if it exists
  }
};
