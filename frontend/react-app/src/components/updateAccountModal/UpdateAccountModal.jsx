import { Modal, Form, Input } from 'antd';
import { useModalForm } from 'sunflower-antd';

export const UpdateAccountModal = ({
    visible, 
    handleOk, 
    handleCancel, 
    confirmLoading,
    name,
    surname,
    login,
    password,
}) => {
    const [form] = Form.useForm();
    const {
        modalProps,
        formProps,
    } = useModalForm({
        defaultVisible: false,
        autoSubmitClose: true,
        autoResetForm: true,
        form,
        submit(data) {
            handleOk(data);
        },
    });

    return (
        <Modal
            {...modalProps}
            title="Edytuj profil"
            visible={visible}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            okText='Potwierdź'
        >
            <Form
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                {...formProps}
                initialValues={{
                    name,
                    surname,
                    login,
                    password,
                }}
            >
                <Form.Item
                    label="Imię"
                    name="name"
                    rules={[{ required: true, message: 'Imię nie może być puste!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Nazwisko"
                    name="surname"
                    rules={[{ required: true, message: 'Nazwisko nie może być puste!' }]}
                >
                    <Input value={surname}/>
                </Form.Item>

                <Form.Item
                    label="Login"
                    name="login"
                    rules={[{ required: true, message: 'Login nie może być puste!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Hasło"
                    name="password"
                    rules={[{ required: true, message: 'Hasło nie może być puste!' }]}
                >
                    <Input.Password />
                </Form.Item>
            </Form>
        </Modal>
    );
};
