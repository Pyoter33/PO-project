import { Modal, Form, Input } from 'antd';
import { useModalForm } from 'sunflower-antd';

export const RejectCommentModal = ({
    visible, 
    handleOk, 
    handleCancel, 
    confirmLoading,
}) => {
    const [form] = Form.useForm();
    const {
        modalProps,
        formProps,
    } = useModalForm({
        form,
        submit(data) {
            handleOk(data);
        },
    })

    return (
        <Modal
            {...modalProps}
            title="Podaj powód odrzucenia wniosku"
            visible={visible}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            okText='Potwierdź'
        >
            <Form
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                {...formProps}
            >
                <Form.Item
                    label="Twój komentarz"
                    name="comment"
                    rules={[
                        {
                            required: true, 
                            message: 'Komentarz jest wymagany!'
                        }, 
                        {
                            max: 1000, 
                            message: 'Komentarz jest za długi!'
                        }
                    ]}
                >
                    <Input.TextArea placeholder='Odrzucam wniosek, ponieważ...' maxLength='1000' showCount />
                </Form.Item>
            </Form>
        </Modal>
    );
};
