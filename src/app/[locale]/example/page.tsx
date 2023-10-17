"use client";

import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input";
import React from "react";
import { useForm } from "react-hook-form";

export default function Example() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
    setValue,
  } = useForm<any>();

  async function onSubmit(data: any) {
    console.log(data);
    const res = await fetch("http://localhost:8000/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(res);
    const json = await res.json();
    console.log(json);
  }

  return (
    <div className="h-screen w-full flex justify-center items-center flex-col gap-8">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input label="Email" {...register("email")} />
        <Input label="Name" {...register("name")} />

        <Button primary type="submit">
          Save
        </Button>
      </form>
    </div>
  );
}
