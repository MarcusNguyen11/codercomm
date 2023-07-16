import React, { useState } from "react";
import { Container, Tab, Box, Tabs, Typography } from "@mui/material";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import SendIcon from '@mui/icons-material/Send';
import { capitalCase } from "change-case";
import FriendRequests from "./FriendRequests";
import RequestsSend from "./RequestsSend";

function Requests() {
    const [currentTab, setCurrentTab] = useState("friend_request");
  
    const REQUEST_TABS = [
      {
        value: "friend_request",
        icon: <AccountBoxIcon sx={{ fontSize: 30 }} />,
        component: <FriendRequests />,
      },
      {
        value: "request_send",
        icon: <SendIcon sx={{ fontSize: 30 }} />,
        component: <RequestsSend />,
      },
    ];
    return (
        <Container>
          <Typography variant="h5" gutterBottom>
            Requests
          </Typography>
          <Tabs
            value={currentTab}
            scrollButtons="auto"
            varirat="scrollable"
            allowScrollButtonsMobile
            onChange={(e, value) => setCurrentTab(value)}
          >
            {REQUEST_TABS.map((tab) => (
              <Tab
                disableRipple
                key={tab.value}
                label={capitalCase(tab.value)}
                icon={tab.icon}
                value={tab.value}
              />
            ))}
          </Tabs>
          <Box sx={{ mb: 5 }} />
          {REQUEST_TABS.map((tab) => {
            const isMatched = tab.value === currentTab;
            return isMatched && <Box key={tab.value}>{tab.component}</Box>;
          })}
        </Container>
      );
    }
    
    export default Requests;