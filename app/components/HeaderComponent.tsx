"use client";

import React from "react";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";

const HeaderComponent: React.FC = () => {
  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "#f6f6f6", // グレーっぽい色
        color: "#333", // テキストを濃いグレーに設定
        boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)", // 軽いシャドウで立体感
      }}
    >
      <Toolbar>
        {/* 左上のタイトル */}
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontWeight: "bold", fontFamily: "Inter, sans-serif" }}
        >
          SuperDive.ai DEMO Tool
        </Typography>
        {/* 右上のメニュー */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            color="inherit"
            sx={{
              fontWeight: "bold",
              textTransform: "none",
              color: "#333", // ボタンテキストの色
              "&:hover": { color: "#007bff" }, // ホバー時のアクセント色
            }}
            href="/session" // 適切なリンクを設定
          >
            セッション
          </Button>
          <Button
            color="inherit"
            sx={{
              fontWeight: "bold",
              textTransform: "none",
              color: "#333", // ボタンテキストの色
              "&:hover": { color: "#007bff" }, // ホバー時のアクセント色
            }}
            href="/edit-session" // 適切なリンクを設定
          >
            セッション編集
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderComponent;
