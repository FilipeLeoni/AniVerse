"use client";

import React from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div>
      <Sidebar collapsed={collapsed}>
        <Menu>
          <SubMenu label="Charts">
            <MenuItem> Pie charts </MenuItem>
            <MenuItem> Line charts </MenuItem>
          </SubMenu>
          <MenuItem> Documentation </MenuItem>
          <MenuItem> Calendar </MenuItem>
        </Menu>
      </Sidebar>
      <div>
        <button className="sb-button" onClick={() => setCollapsed(!collapsed)}>
          Collapse
        </button>
      </div>
    </div>
  );
}
