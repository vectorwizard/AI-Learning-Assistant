import React, { useState, useEffect } from "react";
import { Plus, Upload, Trash2, FileText, X } from "lucide-react";
import toast from "react-hot-toast";

import documentService from "../../services/documentService";
import Spinner from "../../components/common/Spinner";
import Button from "../../components/common/Button";
import DocumentCard from "../../components/documents/DocumentCard";

const DocumentListPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for upload modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploading, setUploading] = useState(false);

  // State for delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const fetchDocuments = async () => {
    try {
      const data = await documentService.getDocuments();
      setDocuments(data);
    } catch (error) {
      toast.error("Failed to fetch documents.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file);
      setUploadTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile || !uploadTitle) {
      toast.error("Please provide a title and select a file.");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("title", uploadTitle);

    try {
      await documentService.uploadDocument(formData);
      toast.success("Document uploaded successfully!");
      setIsUploadModalOpen(false);
      setUploadFile(null);
      setUploadTitle("");
      setLoading(true);
      fetchDocuments();
    } catch (error) {
      toast.error(error.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteRequest = (doc) => {
    setSelectedDoc(doc);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedDoc) return;
    setDeleting(true);
    try {
      await documentService.deleteDocument(selectedDoc._id);
      toast.success(`'${selectedDoc.title}' deleted.`);
      setIsDeleteModalOpen(false);
      setSelectedDoc(null);
      setDocuments(documents.filter((d) => d._id !== selectedDoc._id));
    } catch (error) {
      toast.error(error.message || "Failed to delete document.");
    } finally {
      setDeleting(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <Spinner />;
    }

    if (documents.length === 0) {
      return (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 mb-4">
            <FileText className="w-8 h-8 text-slate-400" strokeWidth={2} />
          </div>
          <p className="text-sm text-slate-600">No documents yet.</p>
          <p className="text-xs text-slate-500 mt-1">Upload your first document to get started.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => (
          <DocumentCard key={doc._id} document={doc} onDelete={handleDeleteRequest} />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen">

      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] opacity-60 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-medium text-slate-900 tracking-tight mb-2">
              My Documents
            </h1>
            <p className="text-slate-500 text-sm">
              Manage and organize your learning materials
            </p>
          </div>

          <Button onClick={() => setIsUploadModalOpen(true)}>
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            Upload Document
          </Button>
        </div>

        {/* Document Grid / Empty State / Spinner */}
        {renderContent()}
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
            <button
              onClick={() => {
                setIsUploadModalOpen(false);
                setUploadFile(null);
                setUploadTitle("");
              }}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" strokeWidth={2} />
            </button>

            <h2 className="text-xl font-semibold text-slate-900 tracking-tight mb-1">
              Upload New Document
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Add a PDF document to your library
            </p>

            <form onSubmit={handleUpload} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-widest">
                  Document Title
                </label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g., React Interview Prep"
                  className="w-full h-11 px-4 border-2 border-slate-200 rounded-xl bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-widest">
                  PDF File
                </label>
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-slate-200 rounded-xl py-10 cursor-pointer hover:border-emerald-300 hover:bg-emerald-50/30 transition-colors duration-200"
                >
                  <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <Upload className="w-5 h-5 text-emerald-600" strokeWidth={2} />
                  </div>
                  <p className="text-sm text-slate-600">
                    <span className="font-semibold text-emerald-600">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-slate-400">PDF up to 10MB</p>
                  <input
                    id="file-upload"
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                {uploadFile && (
                  <p className="text-xs text-slate-500 pl-1">Selected: {uploadFile.name}</p>
                )}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setIsUploadModalOpen(false);
                    setUploadFile(null);
                    setUploadTitle("");
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={uploading}>
                  {uploading ? "Uploading..." : "Upload"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-50 mb-4">
              <Trash2 className="w-7 h-7 text-red-500" strokeWidth={2} />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 tracking-tight mb-2">
              Delete document?
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              This will permanently delete "{selectedDoc?.title}" and all associated flashcards and quizzes.
            </p>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedDoc(null);
                }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-red-500! hover:bg-red-600! text-white"
                onClick={handleConfirmDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentListPage;