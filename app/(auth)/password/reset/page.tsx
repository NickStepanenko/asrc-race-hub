"use client";
import React, { Suspense, useState } from "react";
import { Form, Button, Input, Alert, Space } from "antd";
import styles from "./Reset.module.css";
import { redirect, useSearchParams } from 'next/navigation';

function ResetPassword() {
  const searchParams = useSearchParams();

  const postRequest = async (values: { password: string; confirm: string; }) => {
    const token = searchParams.get("token") || "";
    const email = searchParams.get("email") || "";

    const res = await fetch('/api/auth/password/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        password: values.password,
        token,
        email,
      }),
    });

    switch (res?.status) {
      case 204:
        redirect("/login");
        break;
    }
  };

  return (
    <Suspense>
      <div className={styles.passwordResetForm}>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 12 }}
          style={{ minWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={postRequest}
          onFinishFailed={() => {}}
          autoComplete="off"
        >
          <div className={styles.passwordResetForm}>
            <Form.Item
              label="New Password"
              name="password"
              rules={[{ required: true, message: 'Please input your new password!' }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              label="Confirm Password"
              name="confirm"
              rules={[{ required: true, message: 'Please input your new password again!' }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item label={null}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </Suspense>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPassword />
    </Suspense>
  );
}
