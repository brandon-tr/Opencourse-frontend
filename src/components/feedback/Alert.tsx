"use client";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/20/solid";
import { useAlertStore } from "@/store/store";
import { Fragment, useEffect } from "react";
import { Transition } from "@headlessui/react";

export default function Alert() {
  const { title, message, onDismiss, variant, show, timer, usingTimer } =
    useAlertStore((state) => state);
  useEffect(() => {
    //Countdown from 5 to 0 and auto dismiss the alert
    if (usingTimer && timer && timer > 0) {
      setTimeout(() => {
        useAlertStore.setState({ timer: timer - 1 });
      }, 1000);
    } else {
      if (usingTimer && timer === 0) {
        onDismiss();
      }
    }
  }, [onDismiss, timer, usingTimer]);
  return (
    <>
      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6"
      >
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
          <Transition
            show={show}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-accent shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {variant === "danger" ? (
                      <ExclamationCircleIcon
                        className="h-6 w-6 text-red-400"
                        aria-hidden="true"
                      />
                    ) : variant === "warning" ? (
                      <ExclamationTriangleIcon
                        className="h-6 w-6 text-yellow-400"
                        aria-hidden="true"
                      />
                    ) : variant === "info" ? (
                      <InformationCircleIcon
                        className="h-6 w-6 text-blue-400"
                        aria-hidden="true"
                      />
                    ) : (
                      <CheckCircleIcon
                        className="h-6 w-6 text-green-400"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-lg font-bold text-gray-300">{title}</p>
                    <p className="mt-1 text-sm text-gray-200">{message}</p>
                  </div>
                  <div className="ml-4 flex flex-shrink-0"></div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </>
  );
}
