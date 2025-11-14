"use client";
import React from "react";
import { Form, Button } from "antd";
import styles from "./Logout.module.css";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const postLogout = async (values: any) => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(values),
    });

    router.push("/login");
  };

  return (
    <div className={styles.logoutForm}>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 12 }}
        style={{ minWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={postLogout}
        onFinishFailed={() => {}}
        autoComplete="off"
      >
        <div className={styles.logoutForm}>
          <span>Are you sure you want to Log Out?</span>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Log Out
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
}
