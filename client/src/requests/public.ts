import axios from "axios";
import { BASEURL } from "../helper/constant";

const shareFile = async () => {
  try {
    const response = await axios.post(
      `${BASEURL}/share/file`,
      {
        fileId: "17c7f51b-1214-4c09-a6b9-2d65c616592f",
        key: "02465a15-3203-4004-887c-c28fcbefa131/tushar/Tushar_Shitole_8767699855.pdf",
      },
      { withCredentials: true } // Placed correctly in the Axios config
    );
    console.log(response.data);
  } catch (error: any) {
    console.error("Error sharing file:", error.response?.data || error.message);
  }
};

export { shareFile };
