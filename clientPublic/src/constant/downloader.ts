import axios from "axios";

export const handleDownload = async ({
  url,
  name,
}: {
  url: string;
  name: string;
}) => {
  try {
    // Make the request using axios
    const response = await axios.get(url, {
      responseType: "blob", // Handle response as a binary blob
      withCredentials: true, // Send credentials (cookies, etc.)
    });

    // Ensure the response is successful
    if (response.status !== 200) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    // Create a blob from the response data
    const blob = response.data;
    const blobUrl = URL.createObjectURL(blob);

    // Create a link element to trigger the download
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = name || "download.pdf"; // Set default name as .pdf if no name is provided
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the object URL after download
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Download failed:", error);
    alert("Failed to download file. Please try again.");
  }
};
