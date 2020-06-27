import React from 'react';
import { Container, Link2 } from './styles';

import Logo from '../../assets/logo.svg';

interface HeaderProps {
  size?: 'small' | 'large';
}

const Header: React.FC<HeaderProps> = ({ size = 'large' }: HeaderProps) => {
  return (
    <Container size={size}>
      <header>
        <img src={Logo} alt="GoFinances" />
        <nav>
          <Link2 exact to="/">
            Listagem
          </Link2>
          <Link2 exact to="/import">
            Importar
          </Link2>
        </nav>
      </header>
    </Container>
  );
};

export default Header;
