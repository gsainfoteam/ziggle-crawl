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
  const updateNotice = list.filter(({ prev }) => {
    return prev !== undefined;
  });
  const newNotice = list.filter(({ prev }) => {
    return prev === undefined;
  });
  console.log("list", list);
  console.log("updateNotice", updateNotice);
  console.log("newNotice", newNotice);
}

main();
