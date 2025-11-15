"use client";
import React, { useState } from "react";
import { Form, Input, Button, Checkbox, Alert } from "antd";
import styles from "./Login.module.css";
import { redirect } from "next/navigation";
import { useAuth } from "@/app/components/server/AuthProvider";

const CREDS_ERROR_ALERT = <Alert message="The provided credentials are not correct. Please try again or try to reset your password." type="error" />;

export default function Login() {
  const { refresh } = useAuth();
  const [credsError, setCredsError] = useState(false);

  const postLogin = async (values: any) => {
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
        wrapperCol={{ span: 12 }}
        style={{ minWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={postLogin}
        onFinishFailed={() => {}}
        autoComplete="off"
      >
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