import React from "react";

const FilePreview = () => {
  const fileUrl =
    "http://localhost:3000/transfer/file/02465a15-3203-4004-887c-c28fcbefa131/02465a15-3203-4004-887c-c28fcbefa131/tushar/Tushar_Shitole_8767699855.pdf";
  return (
    <div>
      <h2>File Preview</h2>
      <iframe
        src={fileUrl}
        title="file-preview"
        width="100%"
        height="500px"
        style={{ border: "none" }}
      />
      <a href={fileUrl} download>
        <button>Download File</button>
      </a>
    </div>
  );
};

export default FilePreview;
