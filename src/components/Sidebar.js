// Sidebar Component
import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../css/components/sidebar.css";

const Sidebar = () => {
    const location = useLocation();

    // Sidebar 메뉴 데이터
    const menuItems = [
        { name: "실시간 마약 거래 현황", path: "/" },
        { name: "AI 관리", path: "/aichat" },
        { name: "통계", path: "/analyze" },
    ];

    const supportItems = ["가이드", "설정"];

    return (
        <aside className="sidebar">
            <img
                src={`${process.env.PUBLIC_URL}/retriever_logo.png`}
                alt="Retriever 로고"
                className="logo-image"
            />
            <nav className="menu">
                <ul>
                    {menuItems.map((item) => (
                        <li
                            key={item.name}
                            className={location.pathname === item.path ? "active" : ""}
                        >
                            <Link className="menu-item" to={item.path}>
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="spacer"></div> {/* Spacer for moving the support section */}
            <div className="support">
                <ul>
                    {supportItems.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            </div>
            <div className="user-info">
                <img
                    src={`${process.env.PUBLIC_URL}/police.png`}
                    alt="profile image"
                    className="profile-image"
                />
                <div className="user-details">
                    <p className="user-name">관리자</p>
                    <p className="user-email">cho010105@gachon.ac.kr</p>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;