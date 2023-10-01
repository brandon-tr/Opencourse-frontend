"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export const userColumns: ColumnDef<UserListInterface>[] = [
  {
    accessorKey: "avatar",
    header: "Avatar",
    cell: ({ cell }) => {
      return (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 relative">
            <Image
              className="rounded-full"
              src={cell.getValue() + ""}
              alt=""
              fill={true}
            />
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorFn: (row) => {
      return `${row.first_name} ${row.last_name}`;
    },
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "level",
    header: "Level",
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ cell }) => {
      return (
        <div className="flex items-center gap-3">
          <Button
            size={"sm"}
            className={"px-5"}
            onClick={() => {
              console.log(cell.getValue());
            }}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size={"sm"}
            className={"px-5"}
            onClick={() => {
              console.log(cell.getValue());
            }}
          >
            Delete
          </Button>
        </div>
      );
    },
  },
];
