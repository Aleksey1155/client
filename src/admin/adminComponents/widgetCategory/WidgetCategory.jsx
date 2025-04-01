import "./widgetCategory.scss";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import FolderSharedOutlinedIcon from "@mui/icons-material/FolderSharedOutlined";
import { useNavigate } from "react-router-dom";

const widgetConfig = {
  user: {
    title: "USERS",
    isMoney: false,
    link: "See all users",
    icon: <PersonOutlinedIcon className="icon" style={{ color: "crimson", backgroundColor: "rgba(255, 0, 0, 0.2)" }} />,
  },
  project: {
    title: "PROJECTS",
    isMoney: false,
    link: "View all projects",
    icon: <FolderSharedOutlinedIcon className="icon" style={{ backgroundColor: "rgba(218, 165, 32, 0.2)", color: "goldenrod" }} />,
  },
  expense: {
    title: "EXPENSES",
    isMoney: true,
    link: "View expenses",
    icon: <MonetizationOnOutlinedIcon className="icon" style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green" }} />,
  },
  balance: {
    title: "BALANCE",
    isMoney: true,
    link: "See details",
    icon: <AccountBalanceWalletOutlinedIcon className="icon" style={{ backgroundColor: "rgba(128, 0, 128, 0.2)", color: "purple" }} />,
  },
};

const WidgetCategory = ({ type }) => {
  const navigate = useNavigate();
  const data = widgetConfig[type] || {};

  return (
    <div className="widget" onClick={() => navigate(`/admin/statistics/${type}`)}>
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">{data.isMoney && "$"} 100</span>
        <span className="link">{data.link}</span>
      </div>
      <div className="right">
        <div className="percentage positive">
          <KeyboardArrowUpIcon />
          20%
        </div>
        {data.icon}
      </div>
    </div>
  );
};

export default WidgetCategory;
