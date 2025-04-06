import React from "react";
import { Form, Input, Button, Checkbox, DatePicker, Card } from "antd";
import BriefList from "./Output";

const { TextArea } = Input;

const BriefForm = () => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    if (values.budget) {
      values.budget = parseFloat(values.budget.replace(/\s+/g, ''));
    }
    await fetch("/api/add/brief", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    window.location.reload();
    alert("Бриф успішно надіслано!");
  };

  return (
    <div style={{paddingInline: "10%", margin: "0 auto" }}>
      <Card title="Бриф для замовника" width={600}>
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          initialValues={{
            industry: [],
            features: [],
            hasBrandAssets: false,
          }}
        >
          <Form.Item name="fullName" label="Ім’я та прізвище" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
            <Input />
          </Form.Item>

          <Form.Item name="projectName" label="Назва проєкту">
            <Input />
          </Form.Item>

          <Form.Item label="Сфера діяльності" name="industry">
            <Checkbox.Group>
              <Checkbox value="Освіта">Освіта</Checkbox>
              <Checkbox value="Медицина">Медицина</Checkbox>
              <Checkbox value="Спорт">Спорт</Checkbox>
              <Checkbox value="IT">IT</Checkbox>
              <Checkbox value="Роздрібна торгівля">Роздрібна торгівля</Checkbox>
              <Checkbox value="Інше">Інше</Checkbox>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item name="projectType" label="Тип продукту">
            <Input placeholder="Наприклад: вебсайт, додаток" />
          </Form.Item>

          <Form.Item name="projectGoal" label="Основна мета проєкту">
            <Input />
          </Form.Item>

          <Form.Item label="Необхідні функції" name="features">
            <Checkbox.Group>
              <Checkbox value="Авторизація">Авторизація</Checkbox>
              <Checkbox value="Кошик/оплата">Кошик/оплата</Checkbox>
              <Checkbox value="Пошук">Пошук</Checkbox>
              <Checkbox value="Зворотній зв'язок">Зворотній зв'язок</Checkbox>
              <Checkbox value="Особистий кабінет">Особистий кабінет</Checkbox>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item name="designStyle" label="Бажаний стиль дизайну">
            <Input />
          </Form.Item>

          <Form.Item name="hasBrandAssets" valuePropName="checked">
            <Checkbox>Є брендбук / логотип / приклади</Checkbox>
          </Form.Item>

          <Form.Item name="techStack" label="Бажані технології">
            <Input />
          </Form.Item>

          <Form.Item name="supportNeeded" label="Підтримка після запуску">
            <Input />
          </Form.Item>

          <Form.Item name="deadline" label="Кінцевий термін">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="budget" label="Бюджет">
            <Input />
          </Form.Item>

          <Form.Item name="additionalNotes" label="Додаткові побажання">
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Надіслати бриф
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <div style={{ marginTop: 24 }}>
        <BriefList />
      </div>
    </div>
  );
};

export default BriefForm;
