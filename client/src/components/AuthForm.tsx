import { useState } from 'react';
import { Button, Card, Form, Input, Segmented, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../api/auth';

type AuthMode = 'login' | 'register';
type AuthFormValues = { username: string; password: string };

export default function AuthForm() {
	const [mode, setMode] = useState<AuthMode>('login');
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const onFinish = async (values: AuthFormValues) => {
		try {
			setLoading(true);
			if (mode === 'register') {
				await register(values);
			} else {
				await login(values);
			}
			message.success(
				mode === 'register'
					? 'Registered successfully'
					: 'Logged in successfully',
			);
			navigate('/', { replace: true });
		} catch (error) {
			const text =
				error instanceof Error ? error.message : 'Authentication failed';
			message.error(text);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Card title="Notes App" style={{ width: 360 }}>
			<Segmented<AuthMode>
				block
				value={mode}
				options={[
					{ label: 'Login', value: 'login' },
					{ label: 'Register', value: 'register' },
				]}
				onChange={value => setMode(value)}
				style={{ marginBottom: 16 }}
			/>
			<Form<AuthFormValues> layout="vertical" onFinish={onFinish}>
				<Form.Item
					name="username"
					label="Username"
					rules={[{ required: true }]}
				>
					<Input placeholder="Enter username" />
				</Form.Item>
				<Form.Item
					name="password"
					label="Password"
					rules={[{ required: true }]}
				>
					<Input.Password placeholder="Enter password" />
				</Form.Item>
				<Button type="primary" htmlType="submit" block loading={loading}>
					{mode === 'register' ? 'Register' : 'Login'}
				</Button>
			</Form>
		</Card>
	);
}
