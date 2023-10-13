import Reac from 'react';
import styled from "styled-components";
import * as s from "./styles/globalStyles";


const Navbar = () => {
    return (
        <s.Container width="device-width"
        height="40px"
        background="linear-gradient(to left bottom, #2E3192, #1BFFFF)"
        style={{border: "4px solid #000"}}
        >
            <TextTitle style={{textAlign: "left", padding:"4px 4px", color: "#fff"}}>
                Archaic Shell Babies
            </TextTitle>
        </s.Container>
    )
}

export default Navbar