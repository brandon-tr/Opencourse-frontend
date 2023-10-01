import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function serverSideFetch(ep: string, cache?: RequestCache) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_BASE}${ep}`, {
      method: "GET",
      cache: cache ? cache : "no-cache",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        Cookie: cookies().toString(),
      },
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) {
      if (data.message.toLowerCase().includes("unauthenticated")) {
        redirect("/auth/login");
      } else if (
        data.message.toLowerCase().includes("unauthorized") ||
        data.message.toLowerCase().includes("forbidden") ||
        data.message.toLowerCase().includes("account level is to low")
      ) {
        return {
          error: true,
          message: data.message,
        };
      } else {
        redirect("/");
      }
    }
    if (res.ok) {
      return data;
    }
  } catch (err) {
    console.log(err);
  }
}
