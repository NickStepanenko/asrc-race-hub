"use client";
import React, { useState } from "react";
import { Form, Button, Input, Alert, Space } from "antd";
import styles from "./Request.module.css";

const SUCCESS_ALERT = <Alert message="We just sent you a message with a reset password link. Please follow this link to reset your password." type="success" />;

export default function RequestPassword() {
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
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        style={{ width: "40%" }}
        initialValues={{ remember: true }}
        onFinish={postRequest}
        onFinishFailed={() => {}}
        autoComplete="off"
      >
        <div className={styles.passwordRequestForm}>
          <Space size={12} direction="vertical" style={{ marginBottom: "12px" }}>
            {succes && SUCCESS_ALERT}
            <Space align="center" style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}>
              <span>Forgot your password? Provide your email so we can help you restore access.</span>
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
