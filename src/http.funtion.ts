import axios from "axios";
import { PostCrwalNotice } from "./types/PostCrawl.type";
import dotenv from "dotenv";
import {
  GeneralNoticeDto,
  GetNoticeReturn,
} from "./types/GetNoticeReturn.type";
dotenv.config();

const apiUrl = process.env.API_URL || "http://localhost:3000";
const apiPassword = process.env.CRAWL_PASSWORD || "password";

export async function postCrwalNotice({
  title,
  body,
  type,
  url,
  authorName,
}: Omit<PostCrwalNotice, "password">): Promise<void> {
  return axios
    .post<void>(`${apiUrl}/crawl`, {
      title,
      body,
      type,
      url,
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

export async function getRecentCrwalNotice(): Promise<GeneralNoticeDto> {
  return axios
    .get<GetNoticeReturn>(`${apiUrl}/notice`, {
      params: {
        offset: 0,
        limit: 1,
        category: "ACADEMIC",
      },
    })
    .catch((error) => {
      console.error(error);
      throw new Error("Failed to get recent notice");
    })
    .then((response) => {
      return response.data.list[0];
    });
}
