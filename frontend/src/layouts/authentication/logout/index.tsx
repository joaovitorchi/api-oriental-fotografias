import { useContext } from "react";
import MenuItem from "@mui/material/MenuItem";
import Link from "@mui/material/Link";
import { Icon } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { AuthContext } from "context";

const Logout = () => {
  const authContext = useContext(AuthContext);

  const logout = () => {
    authContext.logout();
  };

  return (
    <MenuItem>
      <MDBox
        component={Link}
        py={0.5}
        display="flex"
        alignItems="center"
        lineHeight={1}
        onClick={logout}
      >
        <MDTypography variant="body1" color="secondary" lineHeight={0.75}>
          <Icon>logout</Icon>
        </MDTypography>
        <MDTypography variant="button" fontWeight="regular" sx={{ ml: 1 }}>
          Sair
        </MDTypography>
      </MDBox>
    </MenuItem>
  );
};

export default Logout;
