import React, { useState, useEffect } from "react";
// import { ActionCableConsumer } from "react-actioncable-provider";
import { ActionCableConsumer } from "@thrash-industries/react-actioncable-provider";
import { API_ROOT } from "../constants";
import NewConversationForm from "./NewConversationForm";
import MessagesArea from "./MessagesArea";
import Cable from "./Cable";
import axios from "axios";
import { useOutlet, useOutletContext } from "react-router-dom";
import ConversationsList from "./Chat/ConversationsList";
import ConversationsArea from "./Chat/ConversationsArea";
import "./Chat.scss";

const findActiveConversation = (conversations, activeConversation) => {
	return conversations.find(
		conversation => conversation.id === activeConversation
	);
};

const mapConversations = (conversations, handleClick) => {
	return conversations.map(conversation => {
		return (
			<li key={conversation.id} onClick={() => handleClick(conversation.id)}>
				{conversation.friend_id}
			</li>
		);
	});
};

export default function Chat(props) {
	const { logged_in_user, isLoggedIn } = useOutletContext();

	const [state, setState] = useState({
		conversations: [],
		activeConversation: null,
		friends: {},
	});

	useEffect(() => {
		fetch(`${API_ROOT}/conversations`, { credentials: "include" })
			.then(res => res.json())
			.then(conversations =>
				setState(prev => {
					return { ...prev, conversations };
				})
			);

		axios
			.get("http://localhost:3000/friends", {
				withCredentials: true,
			})
			.then(response => {
				setState(prev => {
					return { ...prev, friends: response.data };
				});
			})
			.catch(error => console.log("api errors:", error));
	}, [logged_in_user]);

	const handleClick = id => {
		setState(prev => {
			return { ...prev, activeConversation: id };
		});
	};

	const handleReceivedConversation = response => {
		const { conversation } = response;
		const friend_id =
			conversation.requester_id === logged_in_user.id
				? conversation.accepter_id
				: conversation.requester_id;
		const newConversation = {
			id: conversation.id,
			friend_id,
			friend_first_name:
				friend_id === conversation.accepter_id
					? conversation.accepter.first_name
					: conversation.requester.first_name,
			friend_last_name:
				friend_id === conversation.accepter_id
					? conversation.accepter.last_name
					: conversation.requester.last_name,

			messages: conversation.messages,
		};
		setState(prev => {
			return {
				...prev,
				conversations: [...prev.conversations, newConversation],
			};
		});
	};

	const handleReceivedMessage = response => {
		const { message } = response;
		const conversations = [...state.conversations];
		const conversation = conversations.find(
			conversation => conversation.id === message.conversation_id
		);
		conversation.messages = [...conversation.messages, message];
		setState(prev => {
			return { ...prev, conversations };
		});
	};

	const { conversations, activeConversation } = state;

	return (
		<div className="chat">
			{isLoggedIn && (
				<ActionCableConsumer
					channel={{ channel: "ConversationsChannel" }}
					onReceived={handleReceivedConversation}
					onConnected={() => {
						alert("connected");
					}}
				/>
			)}
			{state.conversations.length ? (
				<Cable
					conversations={conversations}
					handleReceivedMessage={handleReceivedMessage}
				/>
			) : null}
			<div className="chat-display">
				<ConversationsArea
					conversations={conversations}
					handleClick={handleClick}
					logged_in_user={logged_in_user}
				></ConversationsArea>
				{activeConversation ? (
					<MessagesArea
						conversation={findActiveConversation(
							conversations,
							activeConversation
						)}
						logged_in_user={logged_in_user}
					/>
				) : null}
			</div>
		</div>
	);
}
