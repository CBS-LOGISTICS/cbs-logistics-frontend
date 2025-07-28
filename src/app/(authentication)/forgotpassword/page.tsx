"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { Button } from "react-bootstrap";
import { CustomInput } from "@/common/components/CustomInput";
import { useInitializeResetPasswordMutation } from "@/redux/services/auth/authApi";
import { showErrorToast, showSuccessToast } from "@/util/toast";
import ButtonLoader from "@/common/components/ButtonLoader";
import { setCookieToStorage } from "@/util/cookies";
import { Constants, handleError } from "@/util/helper";
import { useDispatch } from "react-redux";
import { handleVerifyToken } from "@/redux/services/verify-email/verifyEmailSlice";

import styles from "./forgotpassword.module.scss";
import { TitleText } from "@/common/components/TitleText";
import Link from "next/link";
import Image from "next/image";

const ForgotPassword = () => {
  const router = useRouter();
  const dispatch = useDispatch()

  const { handleSubmit, control } = useForm({
    defaultValues: {
      email: "",
    },
  });

  const [initialResetPassword, { isLoading }] =
    useInitializeResetPasswordMutation();

  const onHandleSubmit = (value: { email: string }) => {
    initialResetPassword(value)
      .unwrap()
      .then((result) => {
        showSuccessToast(result?.message);
        setCookieToStorage(Constants.USER_EMAIL, value?.email);
        router.push("/resetpassword");
        dispatch(handleVerifyToken(value.email));
      })
      .catch((error) => {
        const _result = handleError(error);
        showErrorToast(_result);
      });
  };
  return (
    <React.Fragment>
      <main className={styles.Main}>
        <Image
          src="https://res.cloudinary.com/dbg2z1svm/image/upload/v1691418208/ibx-website-v2/logo_cz22mb.svg"
          width={57}
          height={38}
          alt=""
          className={styles.Logo}
          onClick={() => router.push("/")}
        />
        <div className={styles.Container}>
          <div className={styles.HeaderContainer}>
            <TitleText title="    Forgot Password?" />
          </div>
          <form className={styles.Form} onSubmit={handleSubmit(onHandleSubmit)}>
            <div className="mb-4">
              <div className={styles.InputContainer}>
                {" "}
                <Controller
                  name="email"
                  control={control}
                  rules={{ required: "*email is required" }}
                  render={({
                    field: { onChange, value },
                    formState: { errors },
                  }) => {
                    const errorMessage = errors.email?.message;
                    return (
                      <CustomInput
                        isShowLabel
                        labelText="Email Address"
                        type="email"
                        placeholder="Type your email"
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
                className={styles.ActionButton}
              >
                {isLoading ? <ButtonLoader /> : "Send Reset Instructions"}
              </Button>
            </div>
          </form>
        </div>

        <Link href={"/"} className={styles.BackToSignIn}>
          Back to sign in
        </Link>
      </main>
    </React.Fragment>
  );
};

export default ForgotPassword;
