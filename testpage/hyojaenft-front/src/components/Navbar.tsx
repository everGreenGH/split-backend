import React from "react";
import { Link } from "react-router-dom";
import { Mypage } from "../pages/Mypage";
import { Home } from "../pages/Home";
import { styled } from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: space-around;
`;

const StyledLink = styled(Link)`
  margin: 10px;
  background-color: #ffa500;
  color: maroon;
  padding: 15px 25px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  border: 1px solid #000000;
`;

export const Navbar = () => {
  return (
    <Container>
      <StyledLink to={"/"}>Home</StyledLink>
      <StyledLink to={"/mypage"}>Mypage</StyledLink>
    </Container>
  );
};
