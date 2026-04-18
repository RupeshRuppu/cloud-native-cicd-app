import { useEffect, useState } from 'react';
import {
	Button,
	Col,
	Empty,
	Form,
	Input,
	Row,
	Typography,
	message,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { logout } from '../api/auth';
import { createNote, deleteNote, getNotes, updateNote } from '../api/notes';
import NoteCard from '../components/NoteCard';
import LogoutModal from '../components/LogoutModal';
import NoteModal from '../components/NoteModal';
import type { Note } from '../types/note';

type NoteFormValues = {
	title: string;
	description: string;
};

export default function HomePage() {
	const [notes, setNotes] = useState<Note[]>([]);
	const [createLoading, setCreateLoading] = useState(false);
	const [editLoading, setEditLoading] = useState(false);
	const [selectedNote, setSelectedNote] = useState<Note | null>(null);
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [logoutModalOpen, setLogoutModalOpen] = useState(false);
	const [form] = Form.useForm<NoteFormValues>();
	const navigate = useNavigate();

	const loadNotes = async () => {
		try {
			const data = await getNotes();
			setNotes(data);
		} catch (error) {
			const text =
				error instanceof Error ? error.message : 'Failed to load notes';
			message.error(text);
		}
	};

	useEffect(() => {
		void loadNotes();
	}, []);

	const handleCreate = async (values: NoteFormValues) => {
		try {
			setCreateLoading(true);
			await createNote(values);
			form.resetFields();
			await loadNotes();
			message.success('Note created');
		} catch (error) {
			const text =
				error instanceof Error ? error.message : 'Failed to create note';
			message.error(text);
		} finally {
			setCreateLoading(false);
		}
	};

	const handleDelete = async (note: Note) => {
		try {
			await deleteNote(note.id);
			await loadNotes();
			message.success('Note deleted');
		} catch (error) {
			const text =
				error instanceof Error ? error.message : 'Failed to delete note';
			message.error(text);
		}
	};

	const handleEditOpen = (note: Note) => {
		setSelectedNote(note);
		setEditModalOpen(true);
	};

	const handleEditClose = () => {
		setEditModalOpen(false);
		setSelectedNote(null);
	};

	const handleUpdate = async (values: NoteFormValues) => {
		if (!selectedNote) return;
		try {
			setEditLoading(true);
			await updateNote(selectedNote.id, values);
			handleEditClose();
			await loadNotes();
			message.success('Note updated');
		} catch (error) {
			const text =
				error instanceof Error ? error.message : 'Failed to update note';
			message.error(text);
		} finally {
			setEditLoading(false);
		}
	};

	const handleLogout = () => {
		logout();
		setLogoutModalOpen(false);
		navigate('/auth', { replace: true });
	};

	return (
		<div className="page">
			<div className="topbar">
				<Typography.Title level={3} style={{ margin: 0 }}>
					My Notes
				</Typography.Title>
				<Button onClick={() => setLogoutModalOpen(true)}>Logout</Button>
			</div>

			<div className="create-box">
				<Form form={form} layout="vertical" onFinish={handleCreate}>
					<Form.Item name="title" label="Title" rules={[{ required: true }]}>
						<Input placeholder="Enter note title" />
					</Form.Item>
					<Form.Item name="description" label="Description">
						<Input.TextArea rows={3} placeholder="Write note details" />
					</Form.Item>
					<Button type="primary" htmlType="submit" loading={createLoading}>
						Add Note
					</Button>
				</Form>
			</div>

			{notes.length === 0 ? (
				<Empty description="No notes yet" />
			) : (
				<Row gutter={[16, 16]}>
					{notes.map(note => (
						<Col xs={24} md={12} lg={8} key={note.id}>
							<NoteCard
								note={note}
								onEdit={handleEditOpen}
								onDelete={handleDelete}
							/>
						</Col>
					))}
				</Row>
			)}

			<NoteModal
				open={editModalOpen}
				note={selectedNote}
				loading={editLoading}
				onCancel={handleEditClose}
				onSubmit={handleUpdate}
			/>

			<LogoutModal
				open={logoutModalOpen}
				onCancel={() => setLogoutModalOpen(false)}
				onConfirm={handleLogout}
			/>
		</div>
	);
}
