import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Container, Stack, Text } from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';

function Landing() {
  return (
    <Container maxW="2xl" marginTop="3rem" centerContent>
      <Box padding="5" marginBlockEnd={5}>
        <Text fontSize="3xl" paddingBlockEnd={5}>
          Это простое веб-приложение, написанное на React и Golang.
          Связь осуществляется с помощью вебсокета.
        </Text>
      </Box>
      <Box>
        <Stack direction="column" spacing={7}>
          <Link to="login">
            <Button
              size="lg"
              rightIcon={<ArrowForwardIcon />}
              colorScheme="blue"
              variant="outline"
            >
              Войти
            </Button>
          </Link>
          <Text>
            Нет аккаунта?{' '}
            <Link to="register">
              <Text display="inline" color="blue.500" textDecoration="underline">
                Создайте новый!
              </Text>
            </Link>
          </Text>
        </Stack>
      </Box>
    </Container>
  );
}

export default Landing;
