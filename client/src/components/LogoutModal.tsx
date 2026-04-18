import { Modal } from 'antd';

type LogoutModalProps = {
	open: boolean;
	onCancel: () => void;
	onConfirm: () => void;
};

export default function LogoutModal({
	open,
	onCancel,
	onConfirm,
}: LogoutModalProps) {
	return (
		<Modal
			title="Logout"
			open={open}
			onCancel={onCancel}
			onOk={onConfirm}
			okText="Logout"
			okButtonProps={{ danger: true }}
		>
			Are you sure you want to logout?
		</Modal>
	);
}
