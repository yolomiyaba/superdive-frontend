import React, { useState, useEffect } from "react";
import axios from "axios";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

interface Session {
  id: number;
  name: string;
}

const SessionEditSelector: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<number | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      const response = await axios.get(
        "http://superdive-demo-backend-alb-179482814.ap-northeast-1.elb.amazonaws.com/sessions"
      );
      setSessions(response.data);
    };
    fetchSessions();
  }, []);

  return (
    <FormControl fullWidth>
      <InputLabel id="session-select-label">セッションを選択してください</InputLabel>
      <Select
        labelId="session-select-label"
        value={selectedSession ?? ""}
        onChange={(e) => setSelectedSession(Number(e.target.value))}
      >
        {sessions.map((session) => (
          <MenuItem key={session.id} value={session.id}>
            {session.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SessionEditSelector;
