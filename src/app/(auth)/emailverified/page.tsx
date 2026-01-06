"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "react-bootstrap";
import Link from "next/link";

import styles from "./emailverified.module.scss";

export default function EmailVerified() {
  const router = useRouter();

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
            onClick={() => router.push("/")}
          />
        </div>
        <h2>Email Verified!</h2>
        <p className={styles.Text}>Your email has been verified successfully</p>
        <div className={styles.ImageContainer}>
          <Image
            src="https://res.cloudinary.com/dbg2z1svm/image/upload/v1698091286/ibx-web-application/landing/hurray_jrabzl.svg"
            width={57}
            height={38}
            alt=""
            className={styles.Image2}
            onClick={() => router.push("/")}
          />
        </div>
      </div>

      <div className="mt-3">
        <Button
          type="submit"
          className={styles.ActionButton}
          onClick={() => router.push("/")}
        >
          Sign In
        </Button>
      </div>
      <p className={styles.NoAccountText}>
        Questions ? email us at{" "}
        <Link href="mailto:ibxp2p@gmail.com">ibxp2p@gmail.com</Link>
      </p>
    </React.Fragment>
  );
}
