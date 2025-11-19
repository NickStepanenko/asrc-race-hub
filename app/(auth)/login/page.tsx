"use client";
import React, { useState } from "react";
import { Form, Input, Button, Checkbox, Alert, Space } from "antd";
import styles from "./Login.module.css";
import { redirect } from "next/navigation";
import { useAuth } from "@/app/components/server/AuthProvider";
import Link from "next/link";

const CREDS_ERROR_ALERT = <Alert message="The provided credentials are not correct. Please try again or try to reset your password." type="error" />;

type LoginProps = {
  "username": string,
  "password": string,
  "remember": boolean,
};

export default function Login() {
  const { refresh } = useAuth();
  const [credsError, setCredsError] = useState(false);

  const postLogin = async (values: LoginProps) => {
    setCredsError(false);

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(values),
    });

    switch (res?.status) {
      case 200:
        await refresh();
        redirect("/");
        break;
      case 401:
        setCredsError(true);
        break;
      default:
    }
  };

  return (
    <div className={styles.loginForm}>
      {credsError && CREDS_ERROR_ALERT}
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ width: "40%" }}
        initialValues={{ remember: true }}
        onFinish={postLogin}
        onFinishFailed={() => {}}
        autoComplete="on"
      >
        <Space style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            margin: "1rem 0"
          }}>
          <Link href="/password/request">Forgot password?</Link>
        </Space>
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item name="remember" valuePropName="checked" label={null}>
          <Checkbox>Remember me</Checkbox>
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