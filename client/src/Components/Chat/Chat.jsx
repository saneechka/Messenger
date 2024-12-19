import React, { Component } from 'react';
import axios from 'axios';

import SocketConnection from '../../socket-connection';

import {
  Container,
  Flex,
  Textarea,
  Box,
  FormControl,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  Button,
  Input,
} from '@chakra-ui/react';

import ChatHistory from './ChatHistory';
import ContactList from './ContactList';

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socketConn: '',
      username: '',
      message: '',
      to: '',
      isInvalid: false,
      endpoint: 'http://localhost:8080',
      contact: '',
      contacts: [],
      renderContactList: [],
      chats: [],
      chatHistory: [],
      msgs: [],
    };
  }

  componentDidMount = async () => {
    const queryParams = new URLSearchParams(window.location.search);
    const user = queryParams.get('u');
    this.setState({ username: user });
    this.getContacts(user);

    const conn = new SocketConnection();
    await this.setState({ socketConn: conn });
    // conn.connect(msg => console.log('message received'));
    // connect to ws connection
    this.state.socketConn.connect(message => {
      const msg = JSON.parse(message.data);

      // update UI only when message is between from and to
      if (this.state.to === msg.from || this.state.username === msg.from) {
        this.setState(
          {
            chats: [...this.state.chats, msg],
          },
          () => {
            this.renderChatHistory(this.state.username, this.state.chats);
          }
        );
      }
    });

    this.state.socketConn.connected(user);

    console.log('exiting');
  };

  // on change of input, set the value to the message state
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onSubmit = e => {
    if (e.charCode === 0 && e.code === 'Enter') {
      e.preventDefault();
      const msg = {
        type: 'message',
        chat: {
          from: this.state.username,
          to: this.state.to,
          message: this.state.message,
        },
      };

      this.state.socketConn.sendMsg(msg);
      this.setState({ message: '' });
      // on error change isInvalid to true and message
    }
  };

  getContacts = async user => {
    const res = await axios.get(
      `${this.state.endpoint}/contact-list?username=${user}`
    );
    console.log(res.data);
    if (res.data['data'] !== undefined) {
      this.setState({ contacts: res.data.data });
      this.renderContactList(res.data.data);
    }
  };

  fetchChatHistory = async (u1 = 'user1', u2 = 'user2') => {
    const res = await axios.get(
      `http://localhost:8080/chat-history?u1=${u1}&u2=${u2}`
    );

    console.log(res.data, res.data.data.reverse());
    if (res.data.status && res.data['data'] !== undefined) {
      this.setState({ chats: res.data.data.reverse() });
      this.renderChatHistory(u1, res.data.data.reverse());
    } else {
      this.setState({ chatHistory: [] });
    }
  };

  addContact = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(`${this.state.endpoint}/verify-contact`, {
        username: this.state.contact,
      });

      console.log(res.data);
      if (!res.data.status) {
        this.setState({ isInvalid: true });
      } else {
        // reset state on success
        this.setState({ isInvalid: false });

        let contacts = this.state.contacts;
        contacts.unshift({
          username: this.state.contact,
          last_activity: Date.now() / 1000,
        });
        this.renderContactList(contacts);
      }
    } catch (error) {
      console.error(error);
    }
  };

  renderChatHistory = (currentUser, chats) => {
    const history = ChatHistory(currentUser, chats);
    this.setState({ chatHistory: history });
  };

  renderContactList = contacts => {
    const renderContactList = ContactList(contacts, this.sendMessageTo);

    this.setState({ renderContactList });
  };

  sendMessageTo = to => {
    this.setState({ to });
    this.fetchChatHistory(this.state.username, to);
  };

  render() {
    return (
      <Container w="100%" maxWidth={'90%'} >

        <p style={{ textAlign: 'center', paddingBottom: '10px' }}>
          {this.state.username}
        </p>

        <Flex>
        <Box flex="1">
        <Container paddingBottom={2} >
        <Box  >
         
            <FormControl isInvalid={this.state.isInvalid}>
         
              <InputGroup size="md">
              
                <Input
                  variant="flushed"
                  type="text"
                  placeholder="Добавить..."
                  name="contact"
                  value={this.state.contact}
                  onChange={this.onChange}
                
                  width={'50%'}
                />
                <InputRightElement width="8rem">
                  <Button
                    colorScheme={'blue'}
                    h="2rem"
                    size="lg"
                    variant="solid"
                    type="submit"
                    onClick={this.addContact}
                  >
                    Добавить
                  </Button>
                </InputRightElement>
              </InputGroup>
              {!this.state.isContactInvalid ? (
                ''
              ) : (
                <FormErrorMessage>Контакт не существует</FormErrorMessage>
              )}
            </FormControl>
          </Box>
        </Container>
        </Box>
        <Box flex="4"></Box>
    </Flex>

        <Flex>
          <Box
            textAlign={'left'}
            overflowY={'scroll'}
            flex="1"
            h={'32rem'}
            borderWidth={1}
            borderRightWidth={0}
            borderTopRadius={0}
            borderBottomRightRadius={0}
            borderBottomLeftRadius={'xl'}
            borderTopLeftRadius={'xl'}
          >
            {this.state.renderContactList}
          </Box>

          <Box flex="4">
            <Container
              borderWidth={1}
              borderLeftWidth={0}
              borderBottomWidth={0}
              borderTopRightRadius={'xl'}
              textAlign={'right'}
              h={'25rem'}
              padding={2}
              overflowY={'scroll'}
              display="flex"
              flexDirection={'column-reverse'}
              // bgColor={'red'}
              width="100%"
              maxWidth={'100%'}
            >
              {this.state.chatHistory}
            </Container>

            <Box flex="1">
              <FormControl onKeyDown={this.onSubmit} onSubmit={this.onSubmit}>
                <Textarea
                  type="submit"
                  borderWidth={1}
                  borderRightWidth={1}
                  borderTopRadius={0}
                  borderBottomRightRadius={'xl'}
                  minH={'7rem'}
                  placeholder="Отправьте сообщение..."
                  size="lg"
                  resize={'none'}
                  name="message"
                  value={this.state.message}
                  onChange={this.onChange}
                  isDisabled={this.state.to === ''}
                />

              </FormControl>
            </Box>
          </Box>
        </Flex>
      </Container>
    );
  }
}

export default Chat;
