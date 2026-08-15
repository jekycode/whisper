import HomePage from "@/app/(public)/home/page";
import { unstable_noStore as noStore } from "next/cache";

export default function Page() {
  noStore();
  return(
      <HomePage/>
  ) ;
}