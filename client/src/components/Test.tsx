import { useEffect, useState } from "react";
import { BASEURL } from "../helper/constant";

const Test = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [folders, setFolders] = useState<any[]>([]);

  useEffect(() => {
    // Fetch data from backend
    fetch(`${BASEURL}/images`)
      .then((response) => response.json())
      .then((data) => {
        setFiles(data.images); // Assuming all files are in 'images' (adjust this if necessary)
        setFolders(data.folders);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const renderFile = (file: any) => {
    const fileExtension = file.key.split(".").pop()?.toLowerCase();

    // Check file extension to decide which element to render
    if (
      fileExtension === "jpg" ||
      fileExtension === "png" ||
      fileExtension === "jpeg"
    ) {
      // Render image
      return (
        <img
          src={file.preview} // Use the base64 encoded preview to load the image
          alt={file.key}
          width={200}
          height={200}
        />
      );
    }

    if (fileExtension === "pdf") {
      // Render PDF
      return (
        <embed
          src={file.preview} // Use the base64 encoded preview for the PDF
          type="application/pdf"
          width="600"
          height="400"
        />
      );
    }

    if (
      fileExtension === "mp4" ||
      fileExtension === "webm" ||
      fileExtension === "ogg"
    ) {
      // Render video (though the base64 may not work for large videos)
      return (
        <video controls width="600" height="400">
          <source src={file.preview} type={`video/${fileExtension}`} />
          Your browser does not support the video tag.
        </video>
      );
    }

    // Default case for unknown file types
    return <p>File type not supported for preview</p>;
  };

  return (
    <div>
      <h2>Files</h2>
      <div>
        {files.length > 0 ? (
          files.map((file) => (
            <div key={file.key}>
              <h3>{file.key}</h3>
              {renderFile(file)}{" "}
              {/* Render the appropriate file based on type */}
            </div>
          ))
        ) : (
          <p>No files found</p>
        )}
      </div>

      <h2>Folders</h2>
      <div>
        {folders.length > 0 ? (
          folders.map((folder) => (
            <div key={folder.Key}>
              <a
                href={`/folder/${folder.Key}`}
                style={{ textDecoration: "none" }}
              >
                <button>Open Folder: {folder.Key}</button>
              </a>
            </div>
          ))
        ) : (
          <p>No folders found</p>
        )}
      </div>
    </div>
  );
};

export default Test;
