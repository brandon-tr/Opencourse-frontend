import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export async function csrf() {
  await fetch(`${process.env.NEXT_PUBLIC_API_URL_BASE}/sanctum/csrf-cookie`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
    credentials: "include",
  });
}

export function CreateError(
  message: string,
  errorKeyName: string,
): ErrorInterface {
  return {
    [errorKeyName]: [message],
  };
}
