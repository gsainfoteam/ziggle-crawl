import { firstValueFrom, from, map, toArray } from "rxjs";
import { getAcademicNoticeList } from "./crawls.function";
import { getRecentCrwalNotice, postCrwalNotice } from "./http.funtion";

async function main() {
  const list = await firstValueFrom(
    from(getAcademicNoticeList()).pipe(toArray())
  );
  const recentNotice = await getRecentCrwalNotice();
  console.log(recentNotice);
}

main();
