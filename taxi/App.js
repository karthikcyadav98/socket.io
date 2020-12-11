import React, {useState, useEffect} from 'react';
import {View, Text, SafeAreaView, TextInput, Platform, Dimensions, TouchableOpacity} from 'react-native';
import io from 'socket.io-client';

const SCREEN_WIDTH = Dimensions.get('window').width;
const socket = io('http://192.168.1.35:3000');
let chatArr = [];

const App = () => {
	const [chatMessage, setChatMessage] = useState('');
	const [chatMsgs, setChatMsgs] = useState([]);
	const [msgcount, setMgscount] = useState(10);

	useEffect(() => {
		socket.on('chatmessage', msg => {
			chatArr = [...chatArr, msg];
			setMgscount(msgcount + 1);
		});

		return () => {
			socket.off('chatmessage');
			socket.disconnect();
		};
	}, []);

	useEffect(
		() => {
			setChatMsgs(chatArr);
		},
		[chatArr]
	);

	const sendMessage = () => {
		socket.emit('chatmessage', chatMessage);
		setChatMessage('');
	};

	return (
		<SafeAreaView style={{flex: 1}}>
			<View style={{flexDirection: 'row'}}>
				<View
					style={{
						width: SCREEN_WIDTH * 0.8,
						borderWidth: 1,
						borderColor: '#000',
						borderRadius: 10,
						margin: 10,
						padding: Platform.OS === 'android' ? 0 : 15
					}}
				>
					<TextInput
						value={chatMessage}
						onChangeText={message => {
							setChatMessage(message);
						}}
					/>
				</View>

				<TouchableOpacity
					style={{
						padding: 12,
						margin: 10,
						marginLeft: 0,
						backgroundColor: '#4B4B4B',
						borderRadius: 5,
						justifyContent: 'center',
						alignItems: 'center'
					}}
					onPress={() => sendMessage()}
				>
					<Text style={{color: '#fff'}}>Send</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
};

export default App;
