import "./styles/EditingForm.scss";
import { useState } from "react";
import useMeasure from "react-use-measure";
import axios from "axios";

export default function EditingForm(props) {
	const { oldText, handleClose, message } = props;

	const [newText, setNewText] = useState(oldText);
	const [ref, bounds] = useMeasure();

	const handleChange = e => {
		setNewText(e.target.value);
	};

	const handleSave = e => {
		e.preventDefault();
		const { text, conversation_id, sender_id, receiver_id } = message;
		axios
			.put(
				`http://localhost:3000/messages/${message.id}`,
				{
					new_text: newText,
					conversation_id,
					text,
					sender_id: receiver_id,
					receiver_id: sender_id,
				},
				{
					withCredentials: true,
				}
			)
			.then(response => {
				console.log(`message ${message.id} was successfully edited`);
				setNewText("");
			})
			.catch(error => {
				console.log("api errors:", error);
			});
	};

	const width = bounds.width;
	let inputHeight;

	inputHeight = Math.max(1, Math.ceil(newText.length / width / 0.141));

	return (
		<div className="editing-form">
			<textarea
				className="new-text"
				value={newText}
				style={{ height: inputHeight * 20 }}
				onChange={handleChange}
				ref={ref}
			></textarea>
			<div className="editing-form-buttons">
				<i
					class="fa-solid fa-circle-check fa-stack edit-accept-button"
					onClick={handleSave}
				></i>
				<i
					class="fa-solid fa-circle-xmark fa-stack edit-cancel-button"
					onClick={handleClose}
				></i>
			</div>
		</div>
	);
}
