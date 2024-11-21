"use client";

import React, { useState } from "react";
import { Box, TextField, IconButton, Button, Paper } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import "@fontsource/inter";

type RowData = {
  id: string;
  script: string;
  timeLimit: number | "";
  audio: string;
  child?: RowData; // 子行（1つだけ持てる）
};

const EditableTable: React.FC = () => {
  const [rows, setRows] = useState<RowData[]>([
    {
      id: "1",
      script: "",
      timeLimit: "",
      audio: "",
      child: undefined,
    },
  ]);

  const handleAddRow = () => {
    const newRow: RowData = {
      id: `${Math.random().toString(36).substr(2, 9)}`,
      script: "",
      timeLimit: "",
      audio: "",
      child: undefined,
    };
    setRows((prevRows) => [...prevRows, newRow]);
  };

  const handleAddChildRow = (parentId: string) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === parentId && !row.child
          ? { ...row, child: { id: `${parentId}-child`, script: "", timeLimit: "", audio: "" } }
          : row
      )
    );
  };

  const handleChange = (
    id: string,
    field: keyof RowData,
    value: any,
    rows: RowData[]
  ): RowData[] => {
    return rows.map((row) =>
      row.id === id
        ? { ...row, [field]: value }
        : {
            ...row,
            child: row.child
              ? {
                  ...row.child,
                  ...(row.child.id === id ? { [field]: value } : {}),
                }
              : undefined,
          }
    );
  };

  const handleDeleteRow = (id: string, rows: RowData[]): RowData[] => {
    return rows
      .filter((row) => row.id !== id)
      .map((row) => ({
        ...row,
        child: row.child?.id === id ? undefined : row.child,
      }));
  };

  const renderRows = (rows: RowData[]) =>
    rows.map((row, index) => (
      <Paper
        key={row.id}
        sx={{
          marginBottom: "16px",
          padding: "16px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          backgroundColor: "#fff",
        }}
      >
        {/* 大枠：固定スクリプト */}
        <Box
          sx={{
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            fontWeight: "bold",
          }}
        >
          固定スクリプト
          <Box
            sx={{
              marginLeft: "8px",
              fontWeight: "normal",
              color: "#6b7280", // 灰色
              fontSize: "0.875rem", // 小さめの文字サイズ
            }}
          >
            #{index + 1}
          </Box>
        </Box>
        <Box sx={{ marginBottom: "16px" }}>
          <TextField
            value={row.script}
            onChange={(e) =>
              setRows((prevRows) =>
                handleChange(row.id, "script", e.target.value, prevRows)
              )
            }
            placeholder="スクリプト"
            fullWidth
            multiline
            minRows={3}
            sx={{ marginBottom: "8px" }}
          />
          <Box sx={{ display: "flex", gap: "16px" }}>
            <TextField
              type="number"
              value={row.timeLimit}
              onChange={(e) =>
                setRows((prevRows) =>
                  handleChange(
                    row.id,
                    "timeLimit",
                    e.target.value === "" ? "" : Number(e.target.value),
                    prevRows
                  )
                )
              }
              placeholder="秒数"
              fullWidth
            />
            <TextField
              value={row.audio}
              onChange={(e) =>
                setRows((prevRows) =>
                  handleChange(row.id, "audio", e.target.value, prevRows)
                )
              }
              placeholder="BGM"
              fullWidth
            />
          </Box>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <IconButton
            color="error"
            onClick={() =>
              setRows((prevRows) => handleDeleteRow(row.id, prevRows))
            }
          >
            <DeleteIcon />
          </IconButton>
          {!row.child && (
            <Button
              variant="contained"
              onClick={() => handleAddChildRow(row.id)}
              sx={{ backgroundColor: "#3b82f6" }}
            >
              生成スクリプトを追加
            </Button>
          )}
        </Box>
  
        {/* 子行：生成スクリプト */}
        {row.child && (
          <Box
            sx={{
              padding: "16px",
              marginTop: "16px",
              border: "1px dashed #ccc",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <Box sx={{ fontWeight: "bold", marginBottom: "8px" }}>
              生成スクリプト
            </Box>
            <TextField
              value={row.child.script}
              onChange={(e) =>
                setRows((prevRows) =>
                  handleChange(
                    row.child!.id,
                    "script",
                    e.target.value,
                    prevRows
                  )
                )
              }
              placeholder="スクリプト"
              fullWidth
              multiline
              minRows={3}
              sx={{ marginBottom: "8px" }}
            />
            <Box sx={{ marginTop: "16px", textAlign: "right" }}>
              <IconButton
                color="error"
                onClick={() =>
                  setRows((prevRows) =>
                    prevRows.map((r) =>
                      r.id === row.id ? { ...r, child: undefined } : r
                    )
                  )
                }
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        )}
      </Paper>
    ));
  

  return (
    <Box
      sx={{
        fontFamily: "Inter, sans-serif",
        backgroundColor: "#f6f6f6",
      }}
    >
      {renderRows(rows)}
      <Button
        variant="contained"
        startIcon={<AddCircleOutlineIcon />}
        onClick={handleAddRow}
        sx={{ marginTop: "16px", backgroundColor: "#3b82f6" }}
      >
        固定スクリプトを追加
      </Button>
    </Box>
  );
};

export default EditableTable;
