import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import {CardActions} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import ChatRoom from './ChatRoom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class PickUserName extends Component {
	constructor(props) {
		super(props);
		this.state = {
			displayChatRoom: false,
			userName: undefined,
		}
	}

	pickUser() {
		this.setState({displayChatRoom: true})
	}

	changeUserInput(userName) {
		this.setState({
			userName: userName
		}, ()=> this.state.userName !== userName);
	}

	render() {
		const {displayChatRoom, userName} = this.state;
		return (
			<div className="user-name">
				<MuiThemeProvider>
					<div>
						{!displayChatRoom &&
						<div>
							<TextField className="msg-input"
							           type="text"
							           hintText="Pick a user name"
							           onChange={(e) => this.changeUserInput(e.target.value)}
							/>
							<CardActions className="msg-button">
								<RaisedButton primary={true}
								              onClick={() => this.pickUser(userName)}
								              label="start"/>
							</CardActions>
						</div>}
						{displayChatRoom && <ChatRoom userName={userName}/>}
					</div>
				</MuiThemeProvider>
			</div>
		);
	}
}

export default PickUserName;
