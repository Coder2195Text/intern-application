import Image from "next/image";
import { FC, RefObject, useRef, useState } from "react";
import { Button, input } from "@material-tailwind/react";
import { BiCake, BiLinkExternal, BiPencil, BiSave } from "react-icons/bi";
import { FiMail } from "react-icons/fi";
import Error from "./Errors";

type Mode = "edit" | "view";

interface ProfileCardData {
  name: string;
  email: string;
  dob: Date;
}

const emailRegex =
  /^[\p{L}!#-'*+\-/\d=?^-~]+(.[\p{L}!#-'*+\-/\d=?^-~])*@[^@\s]{2,}$/u;

const DEFAULT_DATA: ProfileCardData = {
  name: "John Doe",
  email: "john.doe@example.com",
  dob: new Date("2000-01-01"),
};

type ProfileCardRefs = {
  [key in keyof ProfileCardData]: RefObject<HTMLInputElement>;
};

type ProfileCardErrors = {
  [key in keyof ProfileCardData]: string | undefined;
};

const ProfileCard: FC = () => {
  const [mode, setMode] = useState<Mode>("view");
  const [data, setData] = useState<ProfileCardData>(DEFAULT_DATA);
  const [errors, setErrors] = useState<ProfileCardErrors>(
    Object.fromEntries(
      Object.entries(DEFAULT_DATA).map(([key]) => [key, undefined])
    ) as ProfileCardErrors
  );
  const refs: ProfileCardRefs = {
    name: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    dob: useRef<HTMLInputElement>(null),
  };
  return (
    <div className="flex relative flex-col justify-center items-center bg-gray-200 rounded-xl w-[672px] min-w-[24rem]">
      <div
        className="flex justify-center items-center p-5 w-full rounded-xl"
        style={{
          background: "linear-gradient(0deg, #e5e7eb 25%, #5ac8fa 0%)",
        }}
      >
        <Image
          width={200}
          height={200}
          className="mt-10 w-1/2 rounded-full"
          src="https://picsum.photos/200/200"
          alt=""
        />
      </div>

      <span className="absolute top-1 right-1">
        <Button
          className="flex flex-row items-center p-3 bg-orange-300 rounded-full"
          onClick={() => {
            if (mode == "view") {
              setMode("edit");
            } else {
              if (Object.values(errors).some((error) => error)) {
                return;
              }
              const newData: ProfileCardData = {
                name: refs.name.current?.value || data.name,
                email: refs.email.current?.value || data.email,
                dob: refs.dob.current?.valueAsDate || data.dob,
              };

              setData(newData);
              setMode("view");
            }
          }}
          ripple
        >
          {mode == "view" ? (
            <>
              <BiPencil className="inline-block mr-2 w-6 h-6" />
              Edit
            </>
          ) : (
            <>
              <BiSave className="inline-block mr-2 w-6 h-6" />
              Save
            </>
          )}
        </Button>
      </span>
      <div className="p-3 px-5 w-full text-3xl font-bold text-gray-900 break-all">
        {mode == "view" ? (
          <span className="text-5xl">{data.name}</span>
        ) : (
          <input
            ref={refs.name}
            className="px-4 w-full text-3xl font-bold text-gray-900 rounded-xl"
            defaultValue={data.name}
            placeholder="Name"
            maxLength={100}
          />
        )}
      </div>

      <div className="relative p-3 px-5 w-full text-3xl font-bold text-gray-900 break-all">
        <FiMail className="inline-block mr-2 w-6 h-6" />

        {mode == "view" ? (
          <>
            {data.email}
            <span className="absolute right-8">
              <Button
                onClick={() => {
                  open(`mailto:${data.email}`);
                }}
              >
                <BiLinkExternal className="inline-block w-6 h-6" />
              </Button>
            </span>
          </>
        ) : (
          <input
            ref={refs.email}
            type="email"
            onBlur={(e) => {
              if (!emailRegex.test(e.target.value)) {
                setErrors((errors) => ({
                  ...errors,
                  email: "Invalid email",
                }));
              }
            }}
            onChange={() => {
              setErrors((errors) => ({
                ...errors,
                email: undefined,
              }));
            }}
            className="px-4 text-3xl font-bold text-gray-900 rounded-xl"
            defaultValue={data.email}
          />
        )}
        {errors.email && (
          <>
            <br />
            <Error>{errors.email}</Error>
          </>
        )}
      </div>
      <div className="p-3 px-5 w-full text-3xl font-bold text-gray-900 break-all">
        <BiCake className="inline-block mr-2 w-6 h-6" />

        {mode == "view" ? (
          <>{data.dob.toISOString().split("T")[0]}</>
        ) : (
          <input
            ref={refs.dob}
            type="date"
            className="px-4 text-3xl font-bold text-gray-900 rounded-xl"
            defaultValue={data.dob.toISOString().split("T")[0]}
            onChange={(e) => {
              const date = e.target.valueAsDate;
              if (!date) return;
              if (date.getTime() >= Date.now()) {
                setErrors({
                  ...errors,
                  dob: "Invalid date of birth",
                });
              } else {
                setErrors({
                  ...errors,
                  dob: undefined,
                });
              }
            }}
          />
        )}
        {errors.dob && (
          <>
            <br />
            <Error>{errors.dob}</Error>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
