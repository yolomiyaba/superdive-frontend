"use client";

import React, { useState } from "react";
import {
  Box,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Button,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import "@fontsource/inter"; // フォントをインポート

type RowData = {
  id: string;
  type: "固定" | "生成";
  script: string;
  prompt: string;
  timeLimit: number | "";
  audio: string;
};

const EditableTable: React.FC = () => {
  const [rows, setRows] = useState<RowData[]>([
    { id: "1", type: "固定", script: "", prompt: "", timeLimit: "", audio: "" },
    { id: "2", type: "生成", script: "", prompt: "", timeLimit: "", audio: "" },
  ]);

  const handleAddRow = () => {
    const newRow: RowData = {
      id: (rows.length + 1).toString(),
      type: "固定",
      script: "",
      prompt: "",
      timeLimit: "",
      audio: "",
    };
    setRows((prevRows) => [...prevRows, newRow]);
  };

  const handleChange = (index: number, field: keyof RowData, value: any) => {
    setRows((prevRows) =>
      prevRows.map((row, i) =>
        i === index ? { ...row, [field]: value } : row
      )
    );
  };

  const handleDeleteRow = (index: number) => {
    setRows((prevRows) => prevRows.filter((_, i) => i !== index));
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const reorderedRows = Array.from(rows);
    const [movedRow] = reorderedRows.splice(result.source.index, 1);
    reorderedRows.splice(result.destination.index, 0, movedRow);
    setRows(reorderedRows);
  };

  return (
    <Box
      sx={{
        fontFamily: "Inter, sans-serif",
        backgroundColor: "#f6f6f6",
      }}
    >
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="table">
          {(provided) => (
            <Box
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{
                backgroundColor: "white",
                borderRadius: "8px",
                boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
              }}
            >
              {rows.map((row, index) => (
                <Draggable key={row.id} draggableId={row.id} index={index}>
                  {(provided) => (
                    <Paper
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        padding: "8px 16px",
                        borderBottom: "1px solid #e0e0e0",
                        "&:last-child": { borderBottom: "none" },
                      }}
                    >
                      {/* 行番号の列 */}
                      <Box
                        sx={{
                          width: "40px",
                          textAlign: "center",
                          marginRight: "8px",
                          fontWeight: "bold",
                        }}
                      >
                        {index + 1}
                      </Box>
                      <Select
                        value={row.type}
                        onChange={(e) =>
                          handleChange(index, "type", e.target.value as "固定" | "生成")
                        }
                        fullWidth
                        sx={{ marginRight: "8px", maxWidth: "120px" }}
                      >
                        <MenuItem value="固定">固定</MenuItem>
                        <MenuItem value="生成">生成</MenuItem>
                      </Select>
                      <TextField
                        value={row.script}
                        onChange={(e) =>
                          handleChange(index, "script", e.target.value)
                        }
                        placeholder="スクリプト"
                        fullWidth
                        sx={{ marginRight: "8px" }}
                      />
                      <TextField
                        type="number"
                        value={row.timeLimit}
                        // onChange={(e) =>
                        //   handleChange(index, "timeLimit", e.target.valueAsNumber || "")
                        // }
                        placeholder="秒数"
                        fullWidth
                        sx={{ marginRight: "8px", maxWidth: "100px" }}
                      />
                      <TextField
                        value={row.audio}
                        onChange={(e) =>
                          handleChange(index, "audio", e.target.value)
                        }
                        placeholder="BGM"
                        fullWidth
                        sx={{ marginRight: "8px" }}
                      />
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteRow(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Paper>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "16px",
        }}
      >
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleAddRow}
          sx={{ backgroundColor: "#3b82f6" }}
        >
          行を追加
        </Button>
        <Button
          variant="contained"
          // startIcon={<SaveIcon />}
          // onClick={handleSave}
          sx={{ backgroundColor: "#10b981" }}
        >
          保存
        </Button>
      </Box>
    </Box>
  );  
  
};

export default EditableTable;
