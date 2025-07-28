"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "react-bootstrap";
import Link from "next/link";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux";
import { useInitializeVerifyEmailMutation } from "@/redux/services/auth/authApi";
import { showErrorToast, showSuccessToast } from "@/util/toast";
import ButtonLoader from "@/common/components/ButtonLoader";
import { handleError } from "@/util/helper";

import styles from "./verifyemail.module.scss";

export default function VerifyEmail() {
  const router = useRouter();

  const [initializeVerifyEmail, { isLoading }] =
    useInitializeVerifyEmailMutation();

  const { registerReducer } = useAppSelector((state: RootState) => state);

  // registerReducer?.data?.email

  const handleVerifyEmail = () => {
    initializeVerifyEmail({ email: registerReducer?.data?.email })
      .unwrap()
      .then((result) => {
        showSuccessToast(result?.message);
        setTimeout(() => {
          router.push("/emailverification");
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
            width={57}
            height={38}
            alt=""
            className={styles.Image1}
          />
        </div>
        <h2>Verify your Email</h2>
        <p className={styles.Text}>
          Hi there! Use the link below to verify your email and start enjoying
          ibx trading experience.
        </p>
      </div>

      <div className="mt-3">
        <Button
          type="submit"
          disabled={isLoading}
          className={styles.ActionButton}
          onClick={handleVerifyEmail}
        >
          {isLoading ? <ButtonLoader /> : "Verify Email"}
        </Button>
      </div>
      <p className={styles.NoAccountText}>
        Questions ? email us at{" "}
        <Link href="mailto:ibxp2p@gmail.com">ibxp2p@gmail.com</Link>
      </p>
    </React.Fragment>
  );
}
