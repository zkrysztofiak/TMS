import React from "react";
import { Form, Input, Button } from "antd";

export const FormClient = ({ id, NIP, name, handleOnFinish }) => {
    return (
        <div className="">
            <Form
                layout="vertical"
                initialValues={{
                    id: 11,
                    NIP: 255,
                    name: "Janko z Bogdańca",
                }}
                onFinish={handleOnFinish}
            >
                <Form.Item label="id" name="id">
                    <Input />
                </Form.Item>
                <Form.Item label="NIP" name="NIP">
                    <Input />
                </Form.Item>{" "}
                <Form.Item label="Name:" name="name">
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" size="large" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};
