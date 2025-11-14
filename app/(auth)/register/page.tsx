"use client";
import React from "react";
import { Form, Input, Button } from "antd";
import styles from "./Register.module.css";
import router from "next/router";

export default function Register() {
  const postRegister = async (values: any) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(values),
    });

    const response =  await res.json() as any;
    console.log(response?.state);

    switch (response?.state) {
      case 200:
        router.push("/");
        break;
      case 409:
        // router.push("/");
        console.log(response)
        break;
      default:
        console.log(response)
    }
  };

  return (
    <div className={styles.registerForm}>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
        style={{ minWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={postRegister}
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