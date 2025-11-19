"use client";
import React, { useState } from "react";
import { Form, Button, Input, Alert, Space } from "antd";
import styles from "./Request.module.css";

const SUCCESS_ALERT = <Alert message="If the email exist in our system we sent a link. Please follow this link to reset your password." type="success" />;

export default function ResetPassword() {
  const [succes, setSuccess] = useState(false);
  
  const postRequest = async (values: { email: string; }) => {
    setSuccess(false);

    const res = await fetch('/api/auth/password/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    
    switch (res?.status) {
      case 204:
        setSuccess(true);
        break;
    }
  };

  return (
    <div className={styles.passwordRequestForm}>
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
        <div className={styles.logoutForm}>
          <Space size={12} direction="vertical" style={{ marginBottom: "12px" }}>
            {succes && SUCCESS_ALERT}
            <Space align="center">
              <span>Forgot your password? Please provide your email so we can help you restore access.</span>
            </Space>
          </Space>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please provide your email' }]}
          >
            <Input width={1400} />
          </Form.Item>
          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Reset Password
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
}
