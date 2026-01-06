"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "react-bootstrap";
import { AiOutlineArrowLeft } from "react-icons/ai";
import CustomPinInput from "@/common/components/CustomPinInput";
import { getCookieFromStorage, setCookieToStorage } from "@/util/cookies";
import { useVerifyPasswordResetTokenMutation } from "@/redux/services/auth/authApi";
import { useInitializeResetPasswordMutation } from "@/redux/services/auth/authApi";
import { showErrorToast, showSuccessToast } from "@/util/toast";
import ButtonLoader from "@/common/components/ButtonLoader";
import { Constants, handleError } from "@/util/helper";
import { useSelector } from "react-redux";
import { RootState } from "@/redux";

import styles from "./resetpassword.module.scss";

export default function ResetPassword() {
  const [verificationToken, setVerificationToken] = useState("");
  const router = useRouter();

  const { verifyToken } = useSelector(
    (state: RootState) => state.verifyEmailReducer
  );

  const [verifyPasswordResetToken, { isLoading }] =
    useVerifyPasswordResetTokenMutation();

  const [initialResetPassword] = useInitializeResetPasswordMutation();

  const handlePinChange = (value: string) => {
    setVerificationToken(value);
  };

  const handleResetPassword = () => {
    const payload = {
      email: getCookieFromStorage(Constants.USER_EMAIL) as string,
      token: verificationToken,
    };
    verifyPasswordResetToken(payload)
      .unwrap()
      .then((result) => {
        showSuccessToast(result?.message);
        setCookieToStorage(Constants.TEMP_TOKEN, result?.data?.tempToken as string);
        setTimeout(() => {
          router.push("/setnewpassword");
        }, 2000);
      })
      .catch((error) => {
        const _result = handleError(error);
        showErrorToast(_result);
      });
  };

  const handleResendVerifyEmail = () => {
    initialResetPassword({ email: verifyToken })
      .unwrap()
      .then((result) => {
        showSuccessToast(result?.message);
        setCookieToStorage(Constants.USER_EMAIL, verifyToken);
        router.push("/resetpassword");
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
        <h2>Password Reset</h2>
        <p className={styles.Text}>
          Please enter the 4-digit code that was sent to your email address{" "}
          <span>{getCookieFromStorage(Constants.USER_EMAIL)}</span>
        </p>
      </div>

      <div className={styles.CustomInputContainer}>
        <CustomPinInput onChange={handlePinChange} />
      </div>

      <div className={styles.ActionButtonContainer}>
        <Button
          type="submit"
          className={styles.ActionButton}
          onClick={handleResetPassword}
          disabled={isLoading}
        >
          {isLoading ? <ButtonLoader /> : "Continue"}
        </Button>
      </div>

      <p className={styles.EmailNotReceived}>
        Didn&apos;t receive the email?
        <span onClick={handleResendVerifyEmail}>&nbsp;Click to resend</span>
      </p>

      <p className={styles.BackToSignIn} onClick={() => router.push("/")}>
        <AiOutlineArrowLeft style={backIconStyle} />
        Back to Sign In
      </p>
    </React.Fragment>
  );
}

const backIconStyle = {
  width: "14x",
  height: "17px",
  color: "#5F6D7E",
};
