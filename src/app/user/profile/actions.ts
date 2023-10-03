"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function deleteCookies() {
  cookies()
    .getAll()
    .forEach((cookie) => {
      cookies().delete(cookie.name);
    });
  redirect("/auth/login");
}
