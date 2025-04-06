import React, { useEffect, useState } from "react";
import {
  Table,
  Card,
  Spin,
  Modal,
  Form,
  Input,
  Button,
  Select,
  DatePicker,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import moment from "moment";

const BriefList = () => {
  const [briefs, setBriefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBrief, setEditingBrief] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchBriefs = async () => {
      try {
        const res = await fetch("/api/briefs");
        const data = await res.json();
        setBriefs(data);
      } catch (error) {
        console.error("Помилка при завантаженні брифів:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBriefs();
  }, []);

  const columns = [
    { title: "Ім’я", dataIndex: "fullName", key: "fullName" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Назва проєкту", dataIndex: "projectName", key: "projectName" },
    {
      title: "Сфера",
      dataIndex: "industry",
      key: "industry",
      render: (i) => i.join(", "),
    },
    { title: "Тип продукту", dataIndex: "projectType", key: "projectType" },
    { title: "Мета", dataIndex: "projectGoal", key: "projectGoal" },
    {
      title: "Функції",
      dataIndex: "features",
      key: "features",
      render: (f) => f.join(", "),
    },
    { title: "Бюджет", dataIndex: "budget", key: "budget" },
    { title: "Кінцевий термін", dataIndex: "deadline", key: "deadline" },
    {
      title: "Дії",
      key: "actions",
      render: (_, record) => (
        <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
      ),
    },
  ];

  const handleEdit = (record) => {
    setEditingBrief(record);
    form.setFieldsValue({
      ...record,
      deadline: record.deadline ? moment(record.deadline) : null,
    });
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const updatedBrief = { ...editingBrief, ...values };

      if (updatedBrief.deadline && updatedBrief.deadline.format) {
        updatedBrief.deadline = updatedBrief.deadline.format("YYYY-MM-DD");
      } else {
        updatedBrief.deadline = null;
      }

      if (!editingBrief._id) {
        console.error("ID брифа отсутствует");
        return;
      }

      const res = await fetch(`/api/briefs/${editingBrief._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBrief),
      });

      if (res.ok) {
        const updatedData = await res.json();
        setBriefs(
          briefs.map((brief) =>
            brief._id === editingBrief._id ? updatedData : brief
          )
        );
        setEditingBrief(null);
      } else {
        console.error("Не вдалося зберегти зміни.");
      }
    } catch (error) {
      console.error("Помилка при збереженні брифу:", error);
    }
  };

  return (
    <div style={{ padding: 24, boxSizing: "border-box" }}>
      <Card title="Отримані Брифи" style={{ boxSizing: "border-box" }}>
        {loading ? (
          <Spin size="large" />
        ) : (
          <Table columns={columns} dataSource={briefs} rowKey="id" />
        )}
      </Card>

      <Modal
        title="Редагування брифу"
        visible={editingBrief !== null}
        onCancel={() => setEditingBrief(null)}
        onOk={handleSave}
        okText="Зберегти"
        cancelText="Скасувати"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="fullName"
            label="Ім’я"
            rules={[{ required: true, message: "Будь ласка, введіть ім’я!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Будь ласка, введіть email!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="projectName"
            label="Назва проєкту"
            rules={[
              { required: true, message: "Будь ласка, введіть назву проєкту!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="industry"
            label="Сфера"
            rules={[{ required: true, message: "Будь ласка, виберіть сферу!" }]}
          >
            <Select
              mode="multiple"
              options={[
                { label: "IT", value: "IT" },
                { label: "Медицина", value: "Медицина" },
                { label: "Освіта", value: "Освіта" },
              ]}
            />
          </Form.Item>
          <Form.Item name="projectType" label="Тип продукту">
            <Input />
          </Form.Item>
          <Form.Item name="projectGoal" label="Мета">
            <Input />
          </Form.Item>
          <Form.Item name="features" label="Функції">
            <Input />
          </Form.Item>
          <Form.Item
            name="budget"
            label="Бюджет"
            rules={[{ required: true, message: "Будь ласка, введіть бюджет!" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item name="deadline" label="Кінцевий термін">
            <DatePicker />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BriefList;
