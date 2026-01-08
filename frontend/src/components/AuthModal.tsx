import React, { useState, useEffect } from "react";
import { Form, Input, Button } from "antd";
import { useSelector } from "react-redux";
import type { RootState } from "@/src/store";

interface AuthModalProps {
  onClose: () => void;
  loading: boolean;
  form: Form;
  onLogin: () => void;
  onRegistration: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({
  form,
  onClose,
  loading,
  onLogin,
  onRegistration,
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const authError = useSelector((state: RootState) => state.auth.error);

  useEffect(() => {
    if (authError?.errors) {
      const fieldErrors = Object.entries(authError.errors).map(
        ([field, messages]) => ({
          name: field,
          errors: Array.isArray(messages) ? messages : [String(messages)],
        }),
      );
      form.setFields(fieldErrors);
    }
  }, [authError, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (isRegister) {
        await onRegistration(
          values.email,
          values.name,
          values.password,
          values.confirmPassword,
        );
      } else {
        await onLogin(values.email, values.password);
      }
    } catch (err) {
      console.log("Error:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {isRegister ? "Create Account" : "Welcome Back"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <i className="fa-solid fa-xmark text-gray-500"></i>
            </button>
          </div>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="space-y-4"
          >
            {isRegister && (
              <Form.Item
                label="Full Name"
                name="name"
                rules={[
                  { required: true, message: "Please enter your full name" },
                ]}
              >
                <Input placeholder="John Doe" />
              </Form.Item>
            )}

            <Form.Item
              label="Email Address"
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Enter a valid email address" },
              ]}
            >
              <Input placeholder="name@example.com" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              hasFeedback
              rules={[
                { required: true, message: "Please enter your password" },
                { min: 6, message: "Password must be at least 6 characters" },
              ]}
            >
              <Input.Password placeholder="••••••••" />
            </Form.Item>

            {isRegister && (
              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  { required: true, message: "Please confirm your password" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Passwords do not match!"),
                      );
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="••••••••" />
              </Form.Item>
            )}

            <Button
              htmlType="submit"
              type="primary"
              block
              loading={loading}
              className="rounded-xl"
            >
              {isRegister ? "Create Account" : "Sign In"}
            </Button>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              {isRegister
                ? "Already have an account?"
                : "Don't have an account?"}
              <button
                onClick={() => setIsRegister(!isRegister)}
                className="ml-1 text-blue-600 font-bold hover:underline"
              >
                {isRegister ? "Sign In" : "Create One"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
