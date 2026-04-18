import { Form, Input, Modal } from 'antd';
import { useEffect } from 'react';
import type { Note } from '../types/note';

type NoteModalProps = {
	open: boolean;
	note: Note | null;
	loading: boolean;
	onCancel: () => void;
	onSubmit: (values: { title: string; description: string }) => void;
};

export default function NoteModal({
	open,
	note,
	loading,
	onCancel,
	onSubmit,
}: NoteModalProps) {
	const [form] = Form.useForm<{ title: string; description: string }>();

	useEffect(() => {
		if (note) {
			form.setFieldsValue({
				title: note.title,
				description: note.description,
			});
		} else {
			form.resetFields();
		}
	}, [form, note]);

	return (
		<Modal
			title="Update Note"
			open={open}
			onCancel={onCancel}
			onOk={() => form.submit()}
			okText="Update"
			confirmLoading={loading}
			destroyOnHidden
		>
			<Form form={form} layout="vertical" onFinish={onSubmit}>
				<Form.Item name="title" label="Title" rules={[{ required: true }]}>
					<Input />
				</Form.Item>
				<Form.Item name="description" label="Description">
					<Input.TextArea rows={4} />
				</Form.Item>
			</Form>
		</Modal>
	);
}
