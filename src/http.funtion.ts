import axios, { AxiosError } from "axios";
import { PostCrwalNotice } from "./types/PostCrawl.type";
import dotenv from "dotenv";
import { Crawl } from "./types/Crawl.typ";
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
    .catch((error: AxiosError) => {
      console.error(error.response?.data);
      throw new Error("Failed to post notice");
    })
    .then(() => {
      console.log(`Posted notice: ${title}`);
      return;
    });
}

export async function updateCrwalNotice({
  title,
  body,
  type,
  url,
  authorName,
}: Omit<PostCrwalNotice, "password">): Promise<void> {
  return axios
    .patch<void>(`${apiUrl}/crawl`, {
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
      console.log(`Updated notice: ${title}`);
      return;
    });
}

export async function getCrwalNotice(url: string): Promise<Crawl | undefined> {
  return axios
    .get<Crawl>(`${apiUrl}/crawl`, {
      params: {
        url,
        password: apiPassword,
      },
    })
    .catch((error: AxiosError) => {
      if (error.response?.status === 404) {
        return undefined;
      }
      console.error(error);
    })
    .then((response) => {
      return response?.data;
    });
}
