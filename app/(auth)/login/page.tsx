"use client";
import React, { useState } from "react";
import { Form, Input, Button, Checkbox, Alert } from "antd";
import styles from "./Login.module.css";
import router from "next/router";

export default function Login() {
  const [emailClaimedError, setEmailClaimedError] = useState<Boolean>(false);
  const [invalidCredsError, setInvalidCredsError] = useState<Boolean>(false);

  const postLogin = async (values: any) => {
    setEmailClaimedError(false);
    setInvalidCredsError(false);

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(values),
    });

    const response =  await res.json() as any;
    console.log(response);

    switch (response?.state) {
      case 200:
        router.push("/");
        break;
      case 401:
        setInvalidCredsError(true);
        break;
      case 409:
        setEmailClaimedError(true);
        break;
      default:
        console.log(response);
    }
  };

  return (
    <div className={styles.loginForm}>
      {emailClaimedError && <Alert message="The specified email address is already in use. Try again with another email or use it to log in." type="error" />}
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
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