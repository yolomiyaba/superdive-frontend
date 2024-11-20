"use client";

import EditableTable from "../components/EditableTable";
import HeaderComponent from "../components/HeaderComponent";
import SessionEditSelector from "../components/SessionEditSelector";
import { useState } from "react";

export default function editSession() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleFileUpload = () => {
        if (selectedFile) {
            // ファイルアップロード処理を実装
            console.log("Uploading file:", selectedFile.name);
        } else {
            alert("ファイルを選択してください");
        }
    };

    return (
        <>
        <HeaderComponent />
        <div className="flex justify-center items-start min-h-screen">
            <div className="w-full max-w-4xl px-4">
                <h1 className="text-3xl font-bold mb-4 mt-8">セッションを編集する</h1>
                <div className="mb-4">
                    <SessionEditSelector />
                </div>
                <div className="mb-4">
                    {/* ファイルアップロードエリア */}
                    <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
                        ファイルをアップロード
                    </label>
                    <div className="flex items-center gap-4">
                        <input
                            id="file-upload"
                            type="file"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border file:border-gray-300 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                        />
                        <button
                            onClick={handleFileUpload}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded whitespace-nowrap"
                        >
                            アップロード
                        </button>
                    </div>
                    {selectedFile && (
                        <p className="mt-2 text-sm text-gray-600">
                            選択されたファイル: {selectedFile.name}
                        </p>
                    )}
                </div>
                <div className="w-full">
                    <div className="w-full max-w-4xl mx-auto">
                        <EditableTable />
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}
