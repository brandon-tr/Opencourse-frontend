"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormInput } from "@/components/ui/FormInput";
import { SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateError, csrf } from "@/utils/utils";
import { getCookie } from "cookies-next";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAlertStore } from "@/store/store";
import ApiErrors from "@/components/feedback/api-errors";

const formSchema = z.object({
  email: z
    .string()
    .email({ message: "invalid email address." })
    .max(255, { message: "email must be less than 255 characters." }),
  password: z
    .string()
    .min(8, { message: "password must be at least 8 characters." })
    .max(50, { message: "password must be less than 50 characters." }),
});

export default function LoginForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [errors, setErrors] = useState<ErrorInterface>();
  const { setTitle, setShow, setMessage, setUsingTimer, setVariant } =
    useAlertStore();
  const onSubmit: SubmitHandler<any> = async (data) => {
    try {
      await csrf();
      let token = getCookie("XSRF-TOKEN");
      if (token) {
        const request = await fetch(
          process.env.NEXT_PUBLIC_API_URL_BASE + "/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Requested-With": "XMLHttpRequest",
              "X-XSRF-TOKEN": token,
            },
            credentials: "include",
            body: JSON.stringify(data),
          },
        );
        const response = await request.json();
        if (response.errors) {
          setErrors(response.errors);
        } else if (request.status === 500) {
          setErrors(
            CreateError(process.env.NEXT_PUBLIC_UNKNOWN_ERROR + "", "unknown"),
          );
        } else {
          router.push("/");
          router.refresh();
          setTitle("Success");
          setMessage(response.success);
          setVariant("success");
          setUsingTimer(true);
          setShow(true);
        }
      }
    } catch (error: any) {
      setErrors(error);
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <FormInput placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <FormInput
                      type={"password"}
                      placeholder="Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="text-sm">
              <a
                href="#"
                className="font-semibold text-white hover:text-indigo-500"
              >
                Forgot Password?
              </a>
            </div>
            <ApiErrors messages={errors} />
            <Button
              type="submit"
              className={"w-full"}
              disabled={form.formState.isSubmitting}
            >
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
