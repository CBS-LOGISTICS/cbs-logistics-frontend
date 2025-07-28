"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import Image from "next/image";
import { Button } from "react-bootstrap";
import { CustomInput } from "@/common/components/CustomInput";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useResetPasswordMutation } from "@/redux/services/auth/authApi";
import { getCookieFromStorage } from "@/util/cookies";
import { showErrorToast, showSuccessToast } from "@/util/toast";
import ButtonLoader from "@/common/components/ButtonLoader";

import styles from "./setnewpassword.module.scss";
import { Constants, handleError } from "@/util/helper";

export default function SetNewPassword() {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);

  const router = useRouter();

  const { handleSubmit, control, watch } = useForm({
    defaultValues: {
      password: "",
      confirmpassword: "",
    },
  });

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleTogglePasswordVisibility = (
    value: "password" | "confirmPassword"
  ) => {
    if (value === "password") {
      return setIsShowPassword((prev) => !prev);
    }

    return setIsShowConfirmPassword((prev) => !prev);
  };

  const onHandleSubmit = (value: {
    password: string;
    confirmpassword: string;
  }) => {
    const payload = {
      email: getCookieFromStorage(Constants.USER_EMAIL) as string,
      password: value?.password,
      tempToken: getCookieFromStorage(Constants.TEMP_TOKEN) as string,
    };

    resetPassword(payload)
      .unwrap()
      .then((result) => {
        showSuccessToast(result?.message);
        setTimeout(() => {
          router.push("/");
        }, 2000);
      })
      .catch((error) => {
        const _result = handleError(error);
        showErrorToast(_result);
      });
  };
  return (
    <React.Fragment>
      <div className={styles.HeaderContainer}>
        <Image
          src="https://res.cloudinary.com/dbg2z1svm/image/upload/v1691418208/ibx-website-v2/logo_cz22mb.svg"
          width={57}
          height={38}
          alt=""
          className={styles.Logo}
          onClick={() => router.push("/")}
        />
        <h2>Set New Password</h2>
        <p className={styles.Text}>Must be at least 8 characters.</p>
      </div>

      <form className={styles.Form} onSubmit={handleSubmit(onHandleSubmit)}>
        <div className="mb-4">
          <div className={styles.InputContainer}>
            {" "}
            <Controller
              name="password"
              control={control}
              rules={{ required: "*password is required", min: "8" }}
              render={({
                field: { onChange, value },
                formState: { errors },
              }) => {
                const errorMessage = errors.password?.message;
                return (
                  <CustomInput
                    isShowLabel
                    labelText="Password"
                    type={isShowPassword ? "text" : "password"}
                    placeholder="Password"
                    isShowIcon
                    ImageIcon={
                      isShowPassword ? (
                        <div className={styles.passwordIconStyle}>
                          <FaEyeSlash
                            onClick={() =>
                              handleTogglePasswordVisibility("password")
                            }
                          />
                        </div>
                      ) : (
                        <div className={styles.backIconStyle}>
                          <FaEye
                            onClick={() =>
                              handleTogglePasswordVisibility("password")
                            }
                          />
                        </div>
                      )
                    }
                    {...{ value, onChange, errors: [errorMessage] }}
                  />
                );
              }}
            />
          </div>
        </div>
        <div className="mb-4">
          <div className={styles.InputContainer}>
            {" "}
            <Controller
              name="confirmpassword"
              control={control}
              rules={{
                required: "*password is required",
                min: "8",
                validate: (val: string) => {
                  if (watch("password") != val) {
                    return "passwords do not match";
                  }
                },
              }}
              render={({
                field: { onChange, value },
                formState: { errors },
              }) => {
                const errorMessage = errors.confirmpassword?.message;
                return (
                  <CustomInput
                    isShowLabel
                    labelText="Confirm Password"
                    type={isShowConfirmPassword ? "text" : "password"}
                    placeholder="Password"
                    isShowIcon
                    ImageIcon={
                      isShowPassword ? (
                        <div className={styles.passwordIconStyle}>
                          <FaEyeSlash
                            onClick={() =>
                              handleTogglePasswordVisibility("password")
                            }
                          />
                        </div>
                      ) : (
                        <div className={styles.backIconStyle}>
                          <FaEye
                            onClick={() =>
                              handleTogglePasswordVisibility("password")
                            }
                          />
                        </div>
                      )
                    }
                    {...{ value, onChange, errors: [errorMessage] }}
                  />
                );
              }}
            />
          </div>
        </div>

        <div className="mt-3">
          <Button
            type="submit"
            disabled={isLoading}
            className={styles.ActionButton}>
            {isLoading ? <ButtonLoader /> : "Reset Password"}
          </Button>
        </div>
      </form>

      <span onClick={() => router.push("/signup")} className={styles.BackButon}>
        <AiOutlineArrowLeft style={backIconStyle} />
        <p>Back to Sign In</p>
      </span>
    </React.Fragment>
  );
}

const passwordIconStyle = {
  position: "absolute",
  right: "1rem",
  bottom: "1rem",
  color: "#7E87A1",
  cursor: "pointer",
};
const backIconStyle = {
  width: "14x",
  height: "17px",
  fill: "var(--gray-700)",
};
