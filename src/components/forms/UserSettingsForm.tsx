"use client";

import * as z from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormInput } from "@/components/ui/FormInput";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { useAlertStore } from "@/store/store";
import ApiErrors from "@/components/feedback/api-errors";
import { submitFormRequest, submitMultiFormRequest } from "@/utils/clientFetch";
import StackedList from "@/components/data-display/StackedList";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Loading from "@/components/feedback/Loading";
import classNames from "@/utils/classNames";

const MAX_FILE_SIZE = parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE!);
const ACCEPTED_IMAGE_TYPES =
  process.env.NEXT_PUBLIC_ACCEPTED_IMAGE_TYPES!.split(",");

const personalInformationSchema = z.object({
  first_name: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(255),
  last_name: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(255),
  email: z.string().email("Please enter a valid email address").max(255),
  avatar: z
    .any()
    .refine((files) => {
      return (
        (files &&
          typeof files === "object" &&
          Object.keys(files).length === 0) ||
        typeof files === "string" ||
        typeof files === "undefined" ||
        files === null
      );
    }, "Image is required.")
    .refine((files) => {
      return (
        MAX_FILE_SIZE >= files?.size ||
        typeof files === "string" ||
        typeof files === "undefined" ||
        files === null
      );
    }, `Max file size is 5MB.`)
    .refine((files) => {
      return (
        ACCEPTED_IMAGE_TYPES.includes(files?.type) ||
        typeof files === "string" ||
        typeof files === "undefined" ||
        files === null
      );
    }, ".jpg, .jpeg, .png and .webp files are accepted."),
});

const passwordFormSchema = z
  .object({
    current_password: z
      .string()
      .min(8, "Current password must be at least 8 characters"),
    password: z.string().min(8, "New password must be at least 8 characters"),
    password_confirmation: z
      .string()
      .min(8, "Password Confirmation must be at least 8 characters"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
  });

const logOutOtherSessionsSchema = z.object({
  password: z.string().min(8, "New password must be at least 8 characters"),
});

export default function UserSettingsForm(data: UserProfileInterface) {
  const router = useRouter();
  const [personalInformationErrors, setPersonalInformationErrors] =
    useState<ErrorInterface>();
  const [passwordErrors, setPasswordErrors] = useState<ErrorInterface>();
  const [otherSessionErrors, setOtherSessionErrors] =
    useState<ErrorInterface>();
  const alert = useAlertStore();
  const avatarRef = useRef<HTMLInputElement>(null);
  const form = useForm<z.infer<typeof personalInformationSchema>>({
    resolver: zodResolver(personalInformationSchema),
    defaultValues: {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      avatar: data.avatar,
    },
  });
  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      current_password: "",
      password: "",
      password_confirmation: "",
    },
  });
  const logOutOtherSessionsForm = useForm<
    z.infer<typeof logOutOtherSessionsSchema>
  >({
    resolver: zodResolver(logOutOtherSessionsSchema),
    defaultValues: {
      password: "",
    },
  });

  const personalInformationSubmit: SubmitHandler<any> = async (data) => {
    await submitMultiFormRequest(
      "/user/update/me",
      data,
      form,
      setPersonalInformationErrors,
      alert,
      router,
    );
  };

  const passwordFormSubmit: SubmitHandler<any> = async (data) => {
    await submitFormRequest(
      "/user/update/me",
      data,
      form,
      setPasswordErrors,
      alert,
    );
  };

  const logOutOtherSessionsSubmit: SubmitHandler<any> = async (data) => {
    await submitFormRequest(
      "/user/log_out_other_sessions",
      data,
      form,
      setOtherSessionErrors,
      alert,
      router,
    );
  };

  return (
    <div className="divide-y divide-white/5">
      <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-white">
            Personal Information
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-400">
            Information related to your account.
          </p>
        </div>

        <Form {...form}>
          <form
            className="md:col-span-2"
            onSubmit={form.handleSubmit(personalInformationSubmit)}
          >
            <div className={"relative"}>
              {form.formState.isSubmitting && (
                <div className={"absolute w-full h-full z-10"}>
                  <Loading />
                </div>
              )}
              <div
                className={classNames(
                  form.formState.isSubmitting ? "opacity-20" : "",
                  "grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6",
                )}
              >
                <div className="col-span-full flex items-center gap-x-8">
                  <Image
                    src={
                      form.getValues("avatar") !== data.avatar
                        ? URL.createObjectURL(form.watch("avatar"))
                        : data.avatar
                    }
                    alt=""
                    className="h-24 rounded-full w-24 flex-none bg-gray-800 object-cover"
                    width={134}
                    height={134}
                    quality={85}
                    priority={true}
                  />
                  <div>
                    <button
                      type="button"
                      onClick={() => avatarRef.current?.click()}
                      className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white/20"
                    >
                      Change avatar
                    </button>
                    <FormField
                      control={form.control}
                      name="avatar"
                      render={({ field: { value, onChange, ...field } }) => (
                        <FormItem className={"flex flex-row-reverse"}>
                          <FormControl className={""}>
                            <FormInput
                              type={"file"}
                              accept={"browserImages/*"}
                              className={""}
                              style={{ display: "none" }}
                              onChange={(e) => {
                                if (e && e.target && e.target.files)
                                  onChange(e?.target?.files[0]);
                              }}
                              {...field}
                              ref={avatarRef}
                            />
                          </FormControl>
                          <FormMessage className={"w-full"} />
                        </FormItem>
                      )}
                    />
                    <p className="mt-2 text-xs leading-5 text-gray-400">
                      JPG, GIF or PNG. 1MB max.
                    </p>
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <div className="mt-2">
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <FormInput placeholder="First Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <div className="mt-2">
                    <FormField
                      control={form.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <FormInput placeholder="Last Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="col-span-full">
                  <div className="mt-2">
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
                  </div>
                </div>
              </div>
              <div className={"mt-3"}>
                <ApiErrors messages={personalInformationErrors} />
              </div>
              <div className="mt-8 flex">
                <Button
                  type="submit"
                  size={"sm"}
                  disabled={form.formState.isSubmitting}
                >
                  Save
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>

      <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-white">
            Change password
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-400">
            Update your password associated with your account.
          </p>
        </div>

        <Form {...passwordForm}>
          <form
            className="md:col-span-2"
            onSubmit={passwordForm.handleSubmit(passwordFormSubmit)}
          >
            <div className={"relative"}>
              {passwordForm.formState.isSubmitting && (
                <div className={"absolute w-full h-full z-10"}>
                  <Loading />
                </div>
              )}
              <div
                className={classNames(
                  passwordForm.formState.isSubmitting ? "opacity-20" : "",
                  "grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6",
                )}
              >
                <div className="col-span-full">
                  <div className="mt-2">
                    <FormField
                      control={passwordForm.control}
                      name="current_password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <FormInput
                              type={"password"}
                              placeholder="Current Password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="col-span-full">
                  <div className="mt-2">
                    <FormField
                      control={passwordForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <FormInput
                              type={"password"}
                              placeholder="New Password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="col-span-full">
                  <div className="mt-2">
                    <FormField
                      control={passwordForm.control}
                      name="password_confirmation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <FormInput
                              type={"password"}
                              placeholder="Confirm Password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className={"mt-3"}>
                <ApiErrors messages={passwordErrors} />
              </div>
              <div className="mt-8 flex">
                <Button
                  type="submit"
                  size={"sm"}
                  disabled={passwordForm.formState.isSubmitting}
                >
                  Save
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>

      <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-white">
            Log out other sessions
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-400">
            Please enter your password to confirm you would like to log out of
            your other sessions across all of your devices.
          </p>
        </div>

        <Form {...logOutOtherSessionsForm}>
          <form
            className="md:col-span-2"
            onSubmit={logOutOtherSessionsForm.handleSubmit(
              logOutOtherSessionsSubmit,
            )}
          >
            <div className={"relative"}>
              {logOutOtherSessionsForm.formState.isSubmitting && (
                <div className={"absolute w-full h-full z-10"}>
                  <Loading />
                </div>
              )}
              <div
                className={classNames(
                  logOutOtherSessionsForm.formState.isSubmitting
                    ? "opacity-20"
                    : "",
                  "grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6",
                )}
              >
                <div className="col-span-full">
                  <div className="mt-2">
                    <FormField
                      control={logOutOtherSessionsForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Password</FormLabel>
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
                  </div>
                </div>
                {data?.userAgentInfo?.map((userAgent, index) => (
                  <div className="col-span-full" key={index}>
                    <StackedList
                      items={[
                        {
                          id: index,
                          name:
                            userAgent?.browser?.name +
                            ", " +
                            userAgent?.os?.name,
                          image: userAgent?.browserImage,
                          description: `Browser Version: ${userAgent?.browser?.version}`,
                          date: data?.user_sessions?.[index].last_activity
                            ? new Date(
                                (data?.user_sessions?.[index]
                                  .last_activity as number) * 1000,
                              ).toDateString()
                            : "",
                          alternateText: `Ip Address: ${data?.user_sessions?.[index].ip_address}`,
                        },
                      ]}
                    />
                  </div>
                ))}
              </div>

              <div className={"mt-3"}>
                <ApiErrors messages={otherSessionErrors} />
              </div>
              <div className="mt-8 flex">
                <Button
                  type="submit"
                  size={"sm"}
                  disabled={logOutOtherSessionsForm.formState.isSubmitting}
                >
                  Log out other sessions
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>

      <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-white">
            Delete account
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-400">
            No longer want to use our service? You can delete your account here.
            This action is not reversible. All information related to this
            account will be deleted permanently.
          </p>
        </div>

        <form className="flex items-start md:col-span-2">
          <Button type="submit" size={"sm"} variant={"destructive"}>
            Yes, delete my account
          </Button>
        </form>
      </div>
    </div>
  );
}
