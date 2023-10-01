"use client";

import { CreateError, csrf } from "@/utils/utils";
import { getCookie } from "cookies-next";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

async function handleJson(
  request: Response,
  setError: (
    value:
      | ((prevState: ErrorInterface | undefined) => ErrorInterface | undefined)
      | ErrorInterface
      | undefined,
  ) => void,
  router: AppRouterInstance | undefined,
  form: any,
  alert: AlertInterface,
) {
  const response = await request.json();
  if (response.errors) {
    setError(response.errors);
  } else if (!request.ok) {
    setError(
      CreateError(process.env.NEXT_PUBLIC_UNKNOWN_ERROR + "", "unknown"),
    );
  } else {
    if (router) {
      router.refresh();
    } else {
      form.reset(response.data);
    }
    alert.setTitle("Success");
    setError(undefined);
    alert.setMessage(response.success);
    alert.setVariant("success");
    alert.setUsingTimer(true);
    alert.setShow(true);
  }
}

export const submitMultiFormRequest = async (
  endpoint: string,
  data: any,
  form: any,
  setError: React.Dispatch<React.SetStateAction<ErrorInterface | undefined>>,
  alert: AlertInterface,
  router?: AppRouterInstance,
) => {
  try {
    await csrf();
    let token = getCookie("XSRF-TOKEN");
    if (token) {
      if (typeof data.avatar !== "object" || !data.avatar) {
        delete data.avatar;
      }
      let formData = new FormData();
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element = data[key];
          formData.append(key, element);
        }
      }
      const request = await fetch(
        process.env.NEXT_PUBLIC_API_URL_BASE + endpoint,
        {
          method: "POST",
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "X-XSRF-TOKEN": token,
          },
          credentials: "include",
          body: formData,
        },
      );
      await handleJson(request, setError, router, form, alert);
    }
    if (process.env.NODE_ENV === "development") console.log(data);
  } catch (error: any) {
    setError(error);
  }
};
export const submitFormRequest = async (
  endpoint: string,
  data: any,
  form: any,
  setError: React.Dispatch<React.SetStateAction<ErrorInterface | undefined>>,
  alert: AlertInterface,
  router?: AppRouterInstance,
) => {
  try {
    await csrf();
    let token = getCookie("XSRF-TOKEN");
    if (token) {
      const request = await fetch(
        process.env.NEXT_PUBLIC_API_URL_BASE + endpoint,
        {
          method: "POST",
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "X-XSRF-TOKEN": token,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(data),
        },
      );
      await handleJson(request, setError, router, form, alert);
    }
    if (process.env.NODE_ENV === "development") console.log(data);
  } catch (error: any) {
    setError(error);
  }
};
