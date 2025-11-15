"use client";
import React from "react";
import { Form, Button } from "antd";
import styles from "./Logout.module.css";
import { redirect } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";

export default function Login() {
  const { refresh } = useAuth();
  
  const postLogout = async (values: any) => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(values),
    });

    await refresh();
    redirect("/login");
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
