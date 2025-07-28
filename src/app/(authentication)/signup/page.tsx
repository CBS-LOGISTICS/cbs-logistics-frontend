"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import Image from "next/image";
import { Button } from "react-bootstrap";
import { CustomInput } from "@/common/components/CustomInput";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useRegisterMutation } from "@/redux/services/auth/authApi";
import { showErrorToast, showSuccessToast } from "@/util/toast";
import { CustomPhoneInput } from "@/common/components/CustomPhoneInput";
import ButtonLoader from "@/common/components/ButtonLoader";
import { handleError } from "@/util/helper";

import styles from "./signup.module.scss";
import { TitleText } from "@/common/components/TitleText";
import { useAppDispatch } from "@/redux/hooks";
import { registerSuccess } from "@/redux/services/auth/authSlice/registerSlice";

const SignUp = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const router = useRouter();
  const dispatch = useAppDispatch();
  const [register, { isLoading }] = useRegisterMutation();

  const { handleSubmit, control } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      referralCode: "",
    },
  });

  const handleTogglePasswordVisibility = () => {
    return setIsShowPassword((prev) => !prev);
  };

  const onHandleSubmit = (value: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    referralCode: string;
  }) => {
    let payload: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      phone: string;
      referralCode?: string;
    } = {
      firstName: value?.firstName,
      lastName: value?.lastName,
      email: value?.email,
      password: value?.password,
      phone: value?.phone,
    };
    if (value?.referralCode) {
      payload.referralCode = value?.referralCode;
    }

    register(payload)
      .unwrap()
      .then((result) => {
        showSuccessToast(result?.message);
        dispatch(registerSuccess(result));
        setTimeout(() => {
          router.push("/verifyemail");
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
        <TitleText title="Create an Account" />
        <p className={styles.Text}>
          It only takes a minute to create your account
        </p>
      </div>

      <form className={styles.Form} onSubmit={handleSubmit(onHandleSubmit)}>
        <div className="mb-4">
          <div className={styles.InputContainer}>
            {" "}
            <Controller
              name="firstName"
              control={control}
              rules={{ required: "*First Name is required" }}
              render={({
                field: { onChange, value },
                formState: { errors },
              }) => {
                const errorMessage = errors.firstName?.message;
                return (
                  <CustomInput
                    isShowLabel
                    labelText="First Name"
                    type="text"
                    placeholder="Enter First Name"
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
              name="lastName"
              control={control}
              rules={{ required: "*Last Name is required" }}
              render={({
                field: { onChange, value },
                formState: { errors },
              }) => {
                const errorMessage = errors.lastName?.message;
                return (
                  <CustomInput
                    isShowLabel
                    labelText="Last Name"
                    type="text"
                    placeholder="Enter Last Name"
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
                    placeholder="Enter your email"
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
              name="phone"
              control={control}
              rules={{ required: "*phone is required" }}
              render={({
                field: { onChange, value },
                formState: { errors },
              }) => {
                const errorMessage = errors.phone?.message;
                return (
                  <CustomPhoneInput
                    isShowLabel
                    labelText="Phone Number"
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
              name="password"
              control={control}
              rules={{ required: "*password is required" }}
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
                    placeholder="Enter Password"
                    isShowIcon
                    ImageIcon={
                      isShowPassword ? (
                        <div className={styles.passwordIconStyle}>
                          <FaEyeSlash
                            onClick={() => handleTogglePasswordVisibility()}
                          />
                        </div>
                      ) : (
                        <div className={styles.passwordIconStyle}>
                          <FaEye
                            onClick={() => handleTogglePasswordVisibility()}
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
              name="referralCode"
              control={control}
              render={({
                field: { onChange, value },
                formState: { errors },
              }) => {
                const errorMessage = errors.referralCode?.message;
                return (
                  <CustomInput
                    isShowLabel
                    labelText="Referral Code (optional)"
                    type="text"
                    placeholder="Enter Referral Code"
                    isShowIcon
                    {...{ value, onChange, errors: [errorMessage] }}
                  />
                );
              }}
            />
          </div>
        </div>

        <div className={styles.SubActionContainer}>
          <span>
            By continuing, you agree our{" "}
            <a
              href="https://www.ibxp2p.com/terms"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Terms of Services</span>
            </a>{" "}
            and{" "}
            <a
              href="https://www.ibxp2p.com/policy"
              target="_blank"
              rel="noopener noreferrer"
            >
              {" "}
              <span>Privacy Policy</span>
            </a>
          </span>
        </div>

        <div className="mt-3">
          <Button
            type="submit"
            disabled={isLoading}
            className={styles.ActionButton}
          >
            {isLoading ? <ButtonLoader /> : "Sign Up"}
          </Button>
        </div>
      </form>

      <p className={styles.ExistingAccount}>
        Already have an account?{" "}
        <span onClick={() => router.push("/")}>Sign In</span>
      </p>
    </React.Fragment>
  );
};

export default SignUp;

const passwordIconStyle = {
  position: "absolute",
  right: "1rem",
  bottom: "1rem",
  color: "#7E87A1",
  cursor: "pointer",
};
