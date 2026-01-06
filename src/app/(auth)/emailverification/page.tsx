"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "react-bootstrap";
import CustomPinInput from "@/common/components/CustomPinInput";
import { useVerifyEmailMutation } from "@/redux/services/auth/authApi";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux";
import { showErrorToast, showSuccessToast } from "@/util/toast";
import ButtonLoader from "@/common/components/ButtonLoader";
import { handleError } from "@/util/helper";

import styles from "./emailverification.module.scss";

export default function ResetPassword() {
  const [verificationToken, setVerificationToken] = useState("");
  const router = useRouter();

  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();

  const handlePinInputChange = (value: string) => {
    return setVerificationToken(value);
  };

  const { registerReducer } = useAppSelector((state: RootState) => state);

  const handleVerifyCode = () => {
    verifyEmail({
      email: registerReducer?.data?.email,
      token: verificationToken,
    })
      .unwrap()
      .then((result) => {
        showSuccessToast(result?.message);
        setTimeout(() => {
          router.push("/emailverified");
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
        <div className={styles.ImageContainer}>
          <Image
            src="https://res.cloudinary.com/dbg2z1svm/image/upload/v1698088140/ibx-web-application/landing/message_ho79ir.svg"
            width={87}
            height={87}
            alt=""
            className={styles.Image1}
          />
        </div>
        <h2>Email Verification</h2>
        <p className={styles.Text}>
          Please enter the 4-digit code that was sent to your email address{" "}
          <span>{registerReducer?.data?.email}</span>
        </p>
      </div>

      <p className={styles.NoCode}>
        Didn&apos;t receive the code?&nbsp;
        <span>Click to resend</span>
      </p>

      <div className={styles.CustomInputContainer}>
        <CustomPinInput onChange={handlePinInputChange} />
      </div>

      <div className={styles.ActionButtonContainer}>
        <Button
          type="submit"
          className={styles.ActionButton}
          onClick={handleVerifyCode}
          disabled={isLoading}
        >
          {isLoading ? <ButtonLoader /> : "Verify Code"}
        </Button>
      </div>

      <p className={styles.EmailNotReceived}>
        Questions? email us at
        <span>&nbsp;ibxp2p@gmail.com</span>
      </p>
    </React.Fragment>
  );
}
