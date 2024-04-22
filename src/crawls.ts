import {
  Observable,
  catchError,
  concatMap,
  from,
  map,
  throwError,
  timeout,
  toArray,
} from "rxjs";
import { CrawledNotice } from "./types/CrawledNotice.type";
import axios from "axios";
import { load } from "cheerio";

const baseUrl = "https://www.gist.ac.kr/kr/html/sub05/050209.html";

export function getAcademicNoticeList(): Observable<CrawledNotice> {
  return from(axios.get(baseUrl)).pipe(
    timeout(10000),
    catchError(throwError),
    map((res) => load(res.data)),
    map(($) => $("table > tbody > tr")),
    concatMap(($) => $.toArray().map((value) => load(value))),
    map(($): Omit<CrawledNotice, "id"> => {
      return {
        title: $("td").eq(2).text().trim(),
        link: `${baseUrl}${$("td").eq(2).find("a").attr("href")}`,
        author: $("td").eq(3).text().trim(),
        category: $("td").eq(1).text().trim(),
        createdAt: $("td").eq(5).text().trim(),
      };
    }),
    map((meta) => ({
      id: Number.parseInt(meta.link.split("no=")[1].split("&")[0]),
      ...meta,
    })),
    toArray(),
    concatMap((metas): CrawledNotice[] => metas.sort((a, b) => b.id - a.id))
  );
}

export function getAcademicNotice(link: string) {
  return from(axios.get(link)).pipe(
    timeout(10000),
    map((res) => load(res.data)),
    catchError(throwError),
    map(($) => {
      return {
        content: $(".bd_detail_content").html()?.trim(),
        files: $(".bd_detail_file > ul > li > a")
          .toArray()
          .map((value) => ({
            href: `${baseUrl}${$(value).attr("href")}`,
            name: $(value).text().trim(),
            type: $(value).attr("class") as
              | "doc"
              | "hwp"
              | "pdf"
              | "imgs"
              | "xls"
              | "etc",
          })),
      };
    })
  );
}
