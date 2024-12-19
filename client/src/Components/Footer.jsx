import React from 'react';
import { Box, Heading, Center } from '@chakra-ui/react';

function Footer() {
  return (
    <Box padding={8}>
      <Center>
        <Heading size="sm">Сделано с помощью Golang, React и Redis</Heading>
      </Center>
      <Center>
        <Heading size="sm" paddingTop={2}>
          Сделано студентами БГУИР
        </Heading>
      </Center>
    </Box>
  );
}

export default Footer;