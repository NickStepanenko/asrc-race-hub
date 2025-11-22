"use client";
import React, { useState } from "react";
import { Form, Input, Button, Alert } from "antd";
import styles from "./Register.module.css";
import { useRouter } from "next/navigation";

const EMAIL_ERROR = "Email taken";
const NAME_ERROR = "Name taken";
const EMAIL_ERROR_ALERT = <Alert message="The specified email address is already in use. Try again with another email or use it to log in." type="error" />;
const NAME_ERROR_ALERT = <Alert message="The specified name is already in use. Try again with another name." type="error" />;

type RegisterProps = {
  "name": string,
  "email": string,
  "password": string,
};
type ResponseProps = {
  error: string | undefined;
};

export default function Register() {
  const [emailClaimedError, setEmailClaimedError] = useState(false);
  const [nameClaimedError, setNameClaimedError] = useState(false);
  const router = useRouter();

  const postRegister = async (values: RegisterProps) => {
    setEmailClaimedError(false);
    setNameClaimedError(false);

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(values),
    });

    const response =  await res.json() as ResponseProps;

    switch (res?.status) {
      case 200:
        router.push("/");
        break;
      case 409:
        switch (response.error) {
          case EMAIL_ERROR:
            setEmailClaimedError(true);
            break;
          case NAME_ERROR:
            setNameClaimedError(true);
            break;
        }
        break;
      default:
    }
  };

  return (
    <div className={styles.registerForm}>
      {emailClaimedError && EMAIL_ERROR_ALERT}
      {nameClaimedError && NAME_ERROR_ALERT}
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 12 }}
        style={{ minWidth: "60%" }}
        initialValues={{ remember: true }}
        onFinish={async (values) => {
          await postRegister(values);
        }}
        onFinishFailed={() => {}}
        autoComplete="off"
      >
        <Form.Item
          label="Username"
          name="name"
          rules={[{ required: true, message: 'Please input your username' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please input your email' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}