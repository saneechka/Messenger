import React from 'react';
import { useColorModeValue } from '@chakra-ui/react';
import { Box, Heading, Center } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import GotLight from './GotLight.svg'
import GotDark from './GotDark.svg'


function Header() {
  const gotImage = useColorModeValue(GotLight, GotDark);

  return (
    <Box paddingBottom={5}>
      <Center>
        <Link to="/">
          <Heading size="2xl">
            <img src={gotImage} height={'96px'} width={'96px'} alt="Got" /> Got
          </Heading>
        </Link>
      </Center>
    </Box>
  );
}

export default Header;