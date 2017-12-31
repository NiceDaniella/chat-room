import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {CardActions} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardHeader} from 'material-ui/Card';
import avatars from './helperFiles/avatars';
import botDictionary from './helperFiles/botDictionary';
import classnames from 'classnames';
import axios from 'axios';
const botIcon = "https://png.icons8.com/bot/color/50/000000";

class ChatRoom extends Component {
	constructor(props) {
		super(props);
		this.state = {
			messages: [],
			socket: window.io('http://localhost:3001'),
			bot: {},
			userMsg: undefined,
			icon: undefined
		}
	}

	componentDidMount() {
		axios.get('http://localhost:3001').then(results => {
			this.setState({
				messages: results.data,
			})
		});
		let icon = avatars[Math.floor(Math.random() * avatars.length)];
		this.setState({icon: icon});
		this.state.socket.on("receive-message", (msg) => {
			let messages = this.state.messages;
			messages.push(msg);
			this.setState({messages: messages});
		})
	}

	submitMessage(userMsg) {
		const {userName} = this.props;
		const {icon, socket} = this.state;
		let message = {
			body: userMsg,
			user: userName || "Guest",
			icon: icon,
		};
		socket.emit("new-message", message);
		this.botMsg(userMsg);
		this.setState({userMsg: ''});
		this.scrollToHeight();
	}

	scrollToHeight(){
		let heightToScroll = document.getElementsByClassName('chat-messages');
		window.scrollTo(0, heightToScroll[0].clientHeight)
	}

	botMsg(userMsg){
		const {socket} = this.state;
		if (!!botDictionary[userMsg]) {
			let botMessages = {
				body: botDictionary[userMsg],
				user: "Bot",
				icon: botIcon
			};
			setTimeout(() => {
				socket.emit("new-message", botMessages);

			}, 1000);
		}
	}

	changeUserInput(msg) {
		this.setState({
			userMsg: msg
		})
	}

	render() {
		const {messages, userMsg} = this.state;
		const {userName} = this.props;
		return (
			<div className="app-main-wrapper">
				<MuiThemeProvider>
					<div>
						<div className="message-wrapper">
							<div className="chat-messages">
								{messages.map((msg, i) => {
									return (
										<Card key={i}
										      className={classnames((msg.user === userName && 'my-user'),'card-style')}>
											<CardHeader
												title={msg.user}
												subtitle={msg.body}
												avatar={msg.icon}
											/>
										</Card>
									)
								})}
							</div>
						</div>
						<div className="input-wrapper">
						<textarea rows="2"
						          placeholder="write a message"
						          value={userMsg}
						          onChange={(e) => this.changeUserInput(e.target.value)}>
						</textarea>
							<CardActions className="msg-button">
								<RaisedButton primary={true}
								              onClick={() => this.submitMessage(userMsg)} label="send"/>
							</CardActions>
						</div>
					</div>
				</MuiThemeProvider>
			</div>
		);
	}
}

export default ChatRoom;
