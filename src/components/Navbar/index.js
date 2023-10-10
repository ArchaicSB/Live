import React from "react";
import { Nav, NavLink, NavMenu }
    from "./NavbarElements";
 
const Navbar = () => {
    return (
        <>
            <Nav>
                <NavMenu>
                    <NavLink to="/benefits" activeStyle>
                        Benefits
                    </NavLink>
                    <NavLink to="/store" activeStyle>
                        Store
                    </NavLink>
                    <NavLink to="/club" activeStyle>
                        Club
                    </NavLink>
                    <NavLink to="/about" activeStyle>
                        About
                    </NavLink>
                </NavMenu>
            </Nav>
        </>
    );
};
 
export default Navbar;