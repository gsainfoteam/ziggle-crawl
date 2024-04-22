import axios from "axios";
import { PostCrwalNotice } from "./types/PostCrawl.type";

const apiUrl = process.env.API_URL || "http://localhost:3000";
const apiPassword = process.env.API_PASSWORD || "password";

export async function postCrwalNotice({
  title,
  body,
  type,
  authorName,
}: Omit<PostCrwalNotice, "password">): Promise<void> {
  return axios
    .post<void>(`${apiUrl}/crawl`, {
      title,
      body,
      type,
      authorName,
      password: apiPassword,
    })
    .catch((error) => {
      console.error(error);
      throw new Error("Failed to post notice");
    })
    .then(() => {
      console.log(`Posted notice: ${title}`);
      return;
    });
}
