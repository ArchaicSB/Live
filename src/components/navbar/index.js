import React from "react";
import { Nav, NavLink, NavMenu }
	from "./NavbarElements";

const Navbar = () => {
	return (
		<>
			<Nav>
				<NavMenu>
					<NavLink to="/mint" activeStyle>
						Mint
					</NavLink>
					<NavLink to="/benefits" activeStyle>
						Benefits
					</NavLink>
					<NavLink to="/store" activeStyle>
						Store
					</NavLink>
					<NavLink to="/club" activeStyle>
						The Club 
					</NavLink>
				</NavMenu>
			</Nav>
		</>
	);
};
export default Navbar;
