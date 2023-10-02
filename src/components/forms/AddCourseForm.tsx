"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import * as z from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Loading from "@/components/feedback/Loading";
import classNames from "@/utils/classNames";
import Image from "next/image";
import { FormInput } from "@/components/ui/FormInput";
import { useEffect, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useAlertStore } from "@/store/store";
import { submitMultiFormRequest } from "@/utils/clientFetch";
import ApiErrors from "@/components/feedback/api-errors";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MAX_FILE_SIZE = parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE!);
const ACCEPTED_IMAGE_TYPES =
  process.env.NEXT_PUBLIC_ACCEPTED_IMAGE_TYPES!.split(",");

const generalInformation = z.object({
  title: z.string().max(100),
  description: z.string().max(255),
  slug: z.string().max(100),
  user_id: z.number(),
  image: z
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

export default function AddCourseForm({ selectOptions }: any) {
  console.log(selectOptions);
  const alert = useAlertStore();
  const [generalErrors, setGeneralErrors] = useState<ErrorInterface>();
  const [selectedUser, setSelectedUser] = useState<any>();
  const form = useForm<z.infer<typeof generalInformation>>({
    resolver: zodResolver(generalInformation),
    defaultValues: {
      title: "",
      description: "",
      slug: "",
      user_id: selectOptions.default,
    },
  });
  const imageRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    form.setValue(
      "slug",
      form.getValues("title").toLowerCase().replace(/ /g, "-"),
    );
  }, [form.watch("title")]);

  useEffect(() => {
    setSelectedUser(
      selectOptions.users.find(
        (user: { id: number }) => user.id === form.getValues("user_id"),
      ),
    );
    if (typeof form.watch("user_id") === "string") {
      form.setValue("user_id", parseInt(String(form.watch("user_id"))));
    }
  }, [form.watch("user_id")]);

  const onSubmitGeneral: SubmitHandler<any> = async (data) => {
    await submitMultiFormRequest(
      "/admin/add_course",
      data,
      form,
      setGeneralErrors,
      alert,
    );
    console.log(data);
  };

  return (
    <div className="divide-y divide-white/5">
      <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-white">
            Course Information
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-400">
            Add new course information to create a new course.
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitGeneral)}>
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
                {/*STARTIMAGE*/}
                <div className="col-span-full flex items-center gap-x-8">
                  <div className={"h-52 w-3/4 relative"}>
                    <Image
                      src={
                        form.getValues("image")
                          ? URL.createObjectURL(form.watch("image"))
                          : "/placeholder/placeholder.png"
                      }
                      alt=""
                      className="pointer-events-none object-cover w-full"
                      fill={true}
                      quality={85}
                      priority={true}
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => imageRef.current?.click()}
                      className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white/20"
                    >
                      Change image
                    </button>
                    <FormField
                      control={form.control}
                      name="image"
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
                              ref={imageRef}
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
                {/*END IMAGE*/}

                <div className="col-span-full mt-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <FormInput placeholder="Title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-full mt-2">
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <div className={"opacity-40"}>
                            <FormInput
                              placeholder="Slug"
                              disabled={true}
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-full mt-2">
                  <FormField
                    control={form.control}
                    name="user_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Author</FormLabel>
                        <Select onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              {selectedUser && (
                                <div className="flex items-center text-white">
                                  <Image
                                    src={selectedUser.avatar}
                                    alt="User Avatar"
                                    className="h-5 w-5 flex-shrink-0 rounded-full"
                                    width={30}
                                    height={30}
                                  />
                                  <span className="ml-3 block truncate">
                                    {selectedUser.name}
                                  </span>
                                </div>
                              )}
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className={"bg-gray-700"}>
                            {selectOptions.users.map((user: any) => (
                              <SelectItem
                                key={user.id}
                                value={parseInt(user.id)}
                                className={classNames(
                                  user.id === selectedUser?.id
                                    ? "p-2 border-2 border-blue-500 bg-accent"
                                    : "",
                                  "",
                                )}
                              >
                                <div className="flex items-center text-white">
                                  <Image
                                    src={user.avatar}
                                    alt="User Avatar"
                                    className={classNames(
                                      user.id === selectedUser?.id
                                        ? "h-8 w-8"
                                        : "h-5 w-5",
                                      "flex-shrink-0 rounded-full",
                                    )}
                                    width={30}
                                    height={30}
                                  />
                                  <span className="ml-3 block truncate">
                                    {user.name}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-full mt-2">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Description"
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className={"mt-3"}>
                <ApiErrors messages={generalErrors} />
              </div>
              <div className="mt-8 flex">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  Save
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
