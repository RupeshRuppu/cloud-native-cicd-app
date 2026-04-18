import { Button, Card, Space, Typography } from 'antd';
import type { Note } from '../types/note';

type NoteCardProps = {
	note: Note;
	onEdit: (note: Note) => void;
	onDelete: (note: Note) => void;
};

export default function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
	return (
		<Card
			hoverable
			title={note.title}
			onClick={() => onEdit(note)}
			extra={
				<Space onClick={event => event.stopPropagation()}>
					<Button size="small" onClick={() => onEdit(note)}>
						Edit
					</Button>
					<Button size="small" danger onClick={() => onDelete(note)}>
						Delete
					</Button>
				</Space>
			}
		>
			<Typography.Paragraph style={{ marginBottom: 0 }}>
				{note.description || 'No description'}
			</Typography.Paragraph>
		</Card>
	);
}
