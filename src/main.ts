import { firstValueFrom, map, toArray } from "rxjs";
import { getAcademicNoticeList } from "./crawls.function";

async function main() {
  console.log("String the crawling");
  const list = await firstValueFrom(
    getAcademicNoticeList().pipe(
      toArray(),
      map((notices) => {
        console.log(notices);
        return notices;
      })
    )
  );
}

main();
