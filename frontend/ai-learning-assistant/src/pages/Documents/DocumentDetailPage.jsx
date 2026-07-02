import React, { useState, useEffect } from "react";
import { ArrowLeft, FileText, Clock, HardDrive } from "lucide-react";
import toast from "react-hot-toast";
import documentService from "../../services/documentService";
import Spinner from "../../components/common/Spinner";
import { useParams, Link } from 'react-router-dom'
import PageHeader from "../../components/common/PageHeader";
import Tabs from '../../components/common/Tabs';
import ChatInterface from "../../components/chat/ChatInterface";
import AIActions from "../../components/ai/AIActions";
import FlashcardManager from "../../components/flashcards/FlashcardManager";
import QuizManager from "../../components/quizzes/QuizManager";
import moment from "moment";

const DocumentDetailPage = () => {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Content');

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        setLoading(true);
        const data = await documentService.getDocumentById(id);
        setDocument(data);
      } catch (error) {
        toast.error("Failed to fetch document.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentDetails();
  }, [id]);

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const renderContent = () => {
    if (loading) return <Spinner />;

    const doc = document?.data;

    if (!doc?.extractedText) {
      return (
        <div className="flex flex-col items-center justify-center py-16 bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-xl">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-100 mb-4">
            <FileText className="w-7 h-7 text-slate-400" strokeWidth={2} />
          </div>
          <p className="text-slate-500 text-sm">
            {doc?.status === 'processing'
              ? 'Document is still being processed...'
              : 'No content available for this document.'}
          </p>
        </div>
      );
    }

    return (
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden">

        {/* Document Meta Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-linear-to-br from-emerald-500 to-teal-500">
              <FileText className="w-4 h-4 text-white" strokeWidth={2} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{doc.fileName}</p>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <HardDrive className="w-3 h-3" strokeWidth={2} />
                  {formatFileSize(doc.fileSize)}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <Clock className="w-3 h-3" strokeWidth={2} />
                  Uploaded {moment(doc.uploadDate).fromNow()}
                </span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                  doc.status === 'ready'
                    ? 'bg-emerald-100 text-emerald-700'
                    : doc.status === 'processing'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {doc.status}
                </span>
              </div>
            </div>
          </div>
          <div className="text-xs text-slate-400 font-medium">
            {doc.extractedText.split(/\s+/).length.toLocaleString()} words
          </div>
        </div>

        {/* Extracted Text */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="prose prose-slate max-w-none">
            {doc.extractedText
              .split('\n')
              .filter(line => line.trim())
              .map((paragraph, index) => (
                <p
                  key={index}
                  className="text-sm text-slate-700 leading-relaxed mb-3 last:mb-0"
                >
                  {paragraph.trim()}
                </p>
              ))}
          </div>
        </div>

      </div>
    );
  };

  const renderChat = () => <ChatInterface />;
  const renderAIActions = () => <AIActions />;
  const renderFlashcardsTab = () => <FlashcardManager documentId={id} />;
  const renderQuizzesTab = () => <QuizManager documentId={id} />;

  const tabs = [
    { name: 'Content', label: 'Content', content: renderContent() },
    { name: 'Chat', label: 'Chat', content: renderChat() },
    { name: 'AI Actions', label: 'AI Actions', content: renderAIActions() },
    { name: 'Flashcards', label: 'Flashcards', content: renderFlashcardsTab() },
    { name: 'Quizzes', label: 'Quizzes', content: renderQuizzesTab() },
  ];

  if (loading) return <Spinner />;

  if (!document) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-slate-600">Document not found.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <Link
          to="/documents"
          className="group inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform duration-200"
          />
          Back to Documents
        </Link>
      </div>

      <PageHeader title={document.data.title} />

      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default DocumentDetailPage;