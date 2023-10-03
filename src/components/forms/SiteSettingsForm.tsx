"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { useAlertStore, useWebsiteStore } from "@/store/store";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormInput } from "@/components/ui/FormInput";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import ApiErrors from "@/components/feedback/api-errors";
import Toggle from "@/components/inputs/Toggle";
import { useRouter } from "next/navigation";
import { submitFormRequest, submitMultiFormRequest } from "@/utils/clientFetch";
import Loading from "@/components/feedback/Loading";
import classNames from "@/utils/classNames";

const MAX_FILE_SIZE = parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE!);
const ACCEPTED_IMAGE_TYPES =
  process.env.NEXT_PUBLIC_ACCEPTED_IMAGE_TYPES!.split(",");
const generalInformation = z.object({
  site_name: z
    .string()
    .nonempty({ message: "Site Name is required." })
    .max(255, { message: "Site Name must be less than 255 characters." }),
  site_description: z.string().max(255, {
    message: "Site Description must be less than 255 characters.",
  }),
  site_author: z.string().max(255, {
    message: "Site Author must be less than 255 characters.",
  }),
  site_email: z
    .string()
    .email({ message: "Site Email must be a valid email." })
    .optional()
    .or(z.literal("")),
  site_logo: z
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
const siteFunctionalitySchema = z.object({
  is_maintenance_mode: z.boolean(),
  is_registration_enabled: z.boolean(),
  is_email_confirmation_required: z.boolean(),
  is_google_login_enabled: z.boolean(),
  text_over_logo: z.boolean(),
  google_api_key: z.string().optional().or(z.literal("")),
});

export default function SiteSettingsForm(siteSettings: SiteInformation) {
  const router = useRouter();
  const { image, setImage } = useWebsiteStore();
  const avatarRef = useRef<HTMLInputElement>(null);
  const form = useForm<z.infer<typeof generalInformation>>({
    resolver: zodResolver(generalInformation),
    defaultValues: {
      site_name: siteSettings.site_name,
      site_description: siteSettings.site_description,
      site_logo: siteSettings.site_logo,
      site_author: siteSettings.site_author,
      site_email: siteSettings.site_email || "",
    },
  });
  const siteFunctionality = useForm<z.infer<typeof siteFunctionalitySchema>>({
    resolver: zodResolver(siteFunctionalitySchema),
    defaultValues: {
      is_maintenance_mode: siteSettings.is_maintenance_mode,
      is_registration_enabled: siteSettings.is_registration_enabled,
      is_email_confirmation_required:
        siteSettings.is_email_confirmation_required,
      is_google_login_enabled: siteSettings.is_google_login_enabled,
      text_over_logo: siteSettings.text_over_logo,
      google_api_key: siteSettings.google_api_key || "",
    },
  });
  const [generalErrors, setGeneralErrors] = useState<ErrorInterface>();
  const [siteFuncErrors, setSiteFuncErrors] = useState<ErrorInterface>();
  const alert = useAlertStore();
  const onSubmitGeneral: SubmitHandler<any> = async (data) => {
    await submitMultiFormRequest(
      "/admin/update_site_settings",
      data,
      form,
      setGeneralErrors,
      alert,
      router,
    );
  };
  const onSubmitFunctional: SubmitHandler<any> = async (data) => {
    await submitFormRequest(
      "/admin/update_site_settings",
      data,
      siteFunctionality,
      setSiteFuncErrors,
      alert,
      router,
    );
  };
  return (
    <div className="divide-y divide-white/5">
      <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-white">
            General Site Information
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-400">
            Update your site&apos;s name, description, and other details.
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitGeneral)}
            className="md:col-span-2"
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
                  <div className={"relative h-24 w-24"}>
                    <Image
                      src={
                        !image
                          ? form.getValues("site_logo")
                            ? typeof form.getValues("site_logo") === "string"
                              ? form.getValues("site_logo")
                              : URL.createObjectURL(form.watch("site_logo"))
                            : "https://images.unsplash.com/photo-1554469384-e58fac16e23a?ixlib=rb-4.0.3" +
                              "&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YnVpbGRpbmd8ZW58MHx8MHx8fDA%3D" +
                              "&auto=format&fit=crop&w=400&q=60"
                          : image
                      }
                      alt=""
                      priority={true}
                      layout="fill"
                      className="flex-none rounded-lg object-contain"
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white/20"
                      onClick={() => avatarRef.current?.click()}
                    >
                      Change Site Logo
                    </button>
                    <FormField
                      control={form.control}
                      name="site_logo"
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
                      JPG, GIF, PNG, WEBP, AVIF formats. 5MB max.
                    </p>
                  </div>
                </div>

                <div className="sm:col-span-full">
                  <FormField
                    control={form.control}
                    name="site_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Name</FormLabel>
                        <FormControl>
                          <FormInput placeholder="Site Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="sm:col-span-full">
                  <FormField
                    control={form.control}
                    name="site_author"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Author</FormLabel>
                        <FormControl>
                          <FormInput placeholder="Site Author" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="sm:col-span-full">
                  <FormField
                    control={form.control}
                    name="site_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Email</FormLabel>
                        <FormControl>
                          <FormInput placeholder="Site Email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-full">
                  <FormField
                    control={form.control}
                    name="site_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Description</FormLabel>
                        <FormControl>
                          <Textarea rows={4} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-full"></div>
              </div>
              <ApiErrors messages={generalErrors} />
              <div className="mt-8 flex">
                <Button type="submit" disabled={form.formState.isSubmitting}>
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
            Site Functionality
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-400">
            Enable or Disable several functionalities throughout the site
          </p>
        </div>
        <Form {...siteFunctionality}>
          <form
            className="md:col-span-2"
            onSubmit={siteFunctionality.handleSubmit(onSubmitFunctional)}
          >
            <div className={"relative"}>
              {siteFunctionality.formState.isSubmitting && (
                <div className={"absolute w-full h-full z-10"}>
                  <Loading />
                </div>
              )}
              <div
                className={classNames(
                  siteFunctionality.formState.isSubmitting ? "opacity-20" : "",
                  "grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6",
                )}
              >
                <div className="col-span-full">
                  <FormField
                    control={siteFunctionality.control}
                    name="is_registration_enabled"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={"mr-24 pr-1"}>
                          Registration Enabled
                        </FormLabel>
                        <FormControl>
                          <Toggle {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-full">
                  <FormField
                    control={siteFunctionality.control}
                    name="is_email_confirmation_required"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={"mr-16 pr-1"}>
                          Email Verification Enabled
                        </FormLabel>
                        <FormControl>
                          <Toggle {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-full">
                  <FormField
                    control={siteFunctionality.control}
                    name="is_google_login_enabled"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={"mr-20 pr-3"}>
                          Google Login Enabled
                        </FormLabel>
                        <FormControl>
                          <Toggle {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {siteFunctionality.watch("is_google_login_enabled") && (
                  <div className="col-span-full">
                    <FormField
                      control={siteFunctionality.control}
                      name="google_api_key"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Google Api Key</FormLabel>
                          <FormControl>
                            <FormInput
                              placeholder="Google Api Key"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
                <div className="col-span-full">
                  <FormField
                    control={siteFunctionality.control}
                    name="is_maintenance_mode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={"mr-14"}>
                          Maintenance Mode Enabled
                        </FormLabel>
                        <FormControl>
                          <Toggle {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-full">
                  <FormField
                    control={siteFunctionality.control}
                    name="text_over_logo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={"mr-4"}>
                          Use text instead of picture for logo
                        </FormLabel>
                        <FormControl>
                          <Toggle {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className={"col-span-full"}>
                  <ApiErrors messages={siteFuncErrors} />
                </div>
                <div className="mt-8 flex">
                  <Button
                    type="submit"
                    disabled={siteFunctionality.formState.isSubmitting}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
