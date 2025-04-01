import { ReactNode } from "react";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Declaring props types for CompleStatisticsCard
interface Props {
  color?: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark";
  title: string;
  count?: string | number;
  percentage?: {
    color: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "dark" | "white";
    amount: string | number;
    label: string;
  };
  icon: ReactNode;
  [key: string]: any;
}

function ComplexStatisticsCard({
  color,
  title,
  count = null,
  percentage,
  icon,
}: Props): JSX.Element {
  return (
    <Card>
      <MDBox
        display="flex"
        justifyContent="space-between"
        pt={1}
        pb={!percentage.amount ? 1 : 0}
        px={2}
      >
        <MDBox
          variant="gradient"
          bgColor={color}
          color={color === "light" ? "dark" : "white"}
          coloredShadow={color}
          borderRadius="xl"
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="4rem"
          height="4rem"
          mt={-3}
        >
          <Icon fontSize="medium" color="inherit">
            {icon}
          </Icon>
        </MDBox>
        <MDBox textAlign="right" lineHeight={1.25}>
          <MDTypography variant="button" fontWeight="light" color="text">
            {title}
          </MDTypography>
          {count != null ? (
            <MDTypography variant="h4">{count}</MDTypography>
          ) : (
            <MDBox pb={4.2}></MDBox>
          )}
        </MDBox>
      </MDBox>
      {percentage.amount && (
        <MDBox pb={2} px={2}>
          <Divider />
          <MDTypography component="p" variant="button" color="text" display="flex">
            <MDTypography
              component="span"
              variant="button"
              fontWeight="bold"
              color={percentage.color}
            >
              {percentage.amount}
            </MDTypography>
            &nbsp;{percentage.label}
          </MDTypography>
        </MDBox>
      )}
    </Card>
  );
}

// Declaring defualt props for ComplexStatisticsCard
ComplexStatisticsCard.defaultProps = {
  color: "info",
  percentage: {
    color: "success",
    text: "",
    label: "",
  },
};

export default ComplexStatisticsCard;
