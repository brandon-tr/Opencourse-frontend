import RegisterForm from "@/components/forms/Register";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
  description: "Register for an account.",
};

export default function Register() {
  return <RegisterForm />;
}
