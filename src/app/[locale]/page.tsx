import { redirect } from "next-intl/server";
import Image from "next/image";

export default function Home() {
  return redirect("/anime");
}
