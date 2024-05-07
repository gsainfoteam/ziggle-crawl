import {
  concatMap,
  firstValueFrom,
  identity,
  map,
  take,
  timeout,
  toArray,
} from "rxjs";
import { getAcademicNotice, getAcademicNoticeList } from "./crawls.function";
import {
  getCrwalNotice,
  postCrwalNotice,
  updateCrwalNotice,
} from "./http.funtion";

async function main() {
  console.log("Crawling academic notices");
  const list = await firstValueFrom(
    getAcademicNoticeList().pipe(
      take(100),
      timeout(60e3),
      concatMap((meta) =>
        getAcademicNotice(meta.link).pipe(map((notice) => ({ notice, meta })))
      ),
      map(async (notice) => {
        const prev = await getCrwalNotice(notice.meta.link);
        return { prev, notice };
      }),
      concatMap(identity),
      toArray()
    )
  );
  console.log("Crawled academic notices");
  const updateNotice = list.filter(({ prev }) => {
    return prev !== undefined;
  });
  const newNotice = list.filter(({ prev }) => {
    return prev === undefined;
  });
  console.log("new notices", newNotice.length);
  console.log("updated notices", updateNotice.length);
  await Promise.all(
    newNotice.map(async ({ notice }) => {
      await postCrwalNotice({
        title: notice.meta.title,
        body: notice.notice.content ?? "",
        type: "ACADEMIC",
        authorName: notice.meta.author,
        url: notice.meta.link,
      });
    })
  );
  await Promise.all(
    updateNotice.map(async ({ notice, prev }) => {
      if (notice.notice.content === undefined) {
        return;
      }
      if (prev?.title === notice.meta.title) {
        return;
      }
      await updateCrwalNotice({
        title: notice.meta.title,
        body: notice.notice.content ?? "",
        type: "ACADEMIC",
        authorName: notice.meta.author,
        url: notice.meta.link,
      });
    })
  );
}

main();
