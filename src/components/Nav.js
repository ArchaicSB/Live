import React, { useState } from 'react';
import styled from 'styled-components';

// Styled components and Nav component code here...
const Navbar = styled.div`
  background-color: #F5FEFD;
  padding: 12px;
  display: flex;
  justify-content: space-between;
  position: sticky;
  height: 10vh;
  top: 0;
  z-index: 100;
  border: 2px solid #000;

  @media (max-width: 768px) {
    display: none;
  }
`;
const ButtonContainer = styled.div`
  width: 70%;
  margin: 0 15%;
  display: flex;
  justify-content: space-between;

  @media (max-width: 768px) {
    display: none;
  }
`;
const MenuIcon = styled.div`
  cursor: pointer;
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;
const Dropdown = styled.div`
  display: none;
  flex-direction: column;
  position: absolute;
  top: 50px;
  background-color: #F5FEFD;
  border: 2px solid #000;
  z-index: 100;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Nav = () => {
const [navbar, setNavbar] = useState(false);

const toggleNavbar = () => {
    setNavbar(!navbar);
  }
};

return (
  <s.Screen image={CONFIG.SHOW_BACKGROUND ? "/config/images/bg.png" : true}>
    <Navbar>
      <s.TextTitle onClick={(e) => {window.open("https:www.archaicshellbabies.com");}}
      style={{
        textAlign:"left", 
        cursor: "pointer", 
        fontWeight:"bold", 
        fontSize:"20px"}}
        >
          ArchaicShellBabies
      </s.TextTitle>
        <ButtonContainer>
          <s.TextTitle onClick={() => scrollTo(mint)}
          style={{cursor: "pointer",
          textDecoration: "underline", 
          fontWeight: "bold"}}
          >
            Mint
          </s.TextTitle>
          <s.TextTitle
          style={{cursor: "pointer",textDecoration: "underline", fontWeight: "bold"}} 
          onClick={() => scrollTo(mission)}>
            Mission
          </s.TextTitle>
          <s.TextTitle
          style={{cursor: "pointer",textDecoration: "underline", fontWeight: "bold"}} 
          onClick={() => scrollTo(utility)}>
            Utility
          </s.TextTitle>
          <s.TextTitle
          style={{cursor: "pointer",textDecoration: "underline", fontWeight: "bold"}} 
          onClick={() => scrollTo(club)}>
            Club
          </s.TextTitle>
          <s.TextTitle
          style={{cursor: "pointer",textDecoration: "underline", fontWeight: "bold"}} 
          onClick={() => scrollTo(shop)}>
            Shop
          </s.TextTitle>
          <StyledButton style={{fontSize:"12px"}}
            onClick={(e) => { e.preventDefault();
            dispatch(connect()); getData();}}
            >
              Connect Wallet
          </StyledButton>
        </ButtonContainer>
    </Navbar> 
  </s.Screen>
  );


export default Nav;





