"use client";

// import { ConstructionOutlined } from "@mui/icons-material";
// import EditableTable from "./components/EditableTable";
// import HeaderComponent from "../components/HeaderComponent";
// import SessionSelectorForEdit from "./components/SessionSelectorForEdit";
// import { useState } from "react";


// export default function EditSession() {
//     const [selectedFile, setSelectedFile] = useState<File | null>(null);
//     const [sessionId, setSessionId] = useState<number | null>(null);
  
//     const handleSessionSelected = (sessionId: number) => {
//       setSessionId(sessionId);
//     };

//     const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         if (event.target.files && event.target.files.length > 0) {
//             setSelectedFile(event.target.files[0]);
//         }
//     };

//     const handleFileUpload = () => {
//         if (selectedFile) {
//             // ファイルアップロード処理を実装
//             console.log("Uploading file:", selectedFile.name);
//         } else {
//             alert("ファイルを選択してください");
//         }
//     };

//     const handleSessionLoadForEdit = (sessionId: number) => {
//         console.log(sessionId);
//     }

//     return (
//         <>
//         <HeaderComponent />
//         <div className="flex justify-center items-start min-h-screen">
//             <div className="w-full max-w-4xl px-4">
//                 <h1 className="text-3xl font-bold mb-4 mt-8">セッションを編集する</h1>
//                 <div className="mb-4">
//                     <SessionSelectorForEdit onSessionSelected={handleSessionSelected}/>
//                 </div>
//                 <div className="mb-4">
//                     {/* ファイルアップロードエリア */}
//                     <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
//                         ファイルをアップロード
//                     </label>
//                     <div className="flex items-center gap-4">
//                         <input
//                             id="file-upload"
//                             type="file"
//                             onChange={handleFileChange}
//                             className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border file:border-gray-300 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
//                         />
//                         <button
//                             onClick={handleFileUpload}
//                             className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded whitespace-nowrap"
//                         >
//                             アップロード
//                         </button>
//                     </div>
//                     {selectedFile && (
//                         <p className="mt-2 text-sm text-gray-600">
//                             選択されたファイル: {selectedFile.name}
//                         </p>
//                     )}
//                 </div>
//                 <div className="w-full">
//                     <div className="w-full max-w-4xl mx-auto">
//                         <EditableTable />
//                     </div>
//                 </div>
//             </div>
//         </div>
//         </>
//     );
// }

// useClient.tsx
import { Button, TextField, Typography, Box, Input, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { ConstructionOutlined } from '@mui/icons-material';
import EditableTable from './components/EditableTable';
import HeaderComponent from '../components/HeaderComponent';
import SessionSelectorForEdit from './components/SessionSelectorForEdit';
import { useState } from 'react';

export default function EditSession() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [sessionId, setSessionId] = useState<number | null>(null);
  
    const handleSessionSelected = (sessionId: number) => {
      setSessionId(sessionId);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleFileUpload = () => {
        if (selectedFile) {
            // Implement file upload logic here
            console.log("Uploading file:", selectedFile.name);
        } else {
            alert("Please select a file to upload.");
        }
    };

    return (
        <>
        <HeaderComponent />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'start', minHeight: '100vh', pt: 4 }}>
            <Box sx={{ width: '100%', maxWidth: 900, p: 2 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Edit Session
                </Typography>
                <SessionSelectorForEdit onSessionSelected={handleSessionSelected} />

                {sessionId && (
                    <>
                    <Box sx={{ mt: 4, mb: 2 }}>
                        <InputLabel htmlFor="file-upload">Upload File</InputLabel>
                        <Input
                            id="file-upload"
                            type="file"
                            onChange={handleFileChange}
                            sx={{ display: 'flex', width: '100%', my: 2 }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleFileUpload}
                            sx={{ ml: 1 }}
                        >
                            Upload
                        </Button>
                        {selectedFile && (
                            <Typography sx={{ mt: 2 }}>
                                Selected file: {selectedFile.name}
                            </Typography>
                        )}
                    </Box>
                    <Box sx={{ width: '100%' }}>
                        <EditableTable />
                    </Box>
                    </>
                )}
            </Box>
        </Box>
        </>
    );
}
