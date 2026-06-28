import Document from '../models/Document.js'
import Flashcard from '../models/Flashcard.js'
import Quiz from '../models/Quiz.js'
import { extractTextFromPDF } from '../utils/pdfParser.js'
import { chuckText } from '../utils/textChunker.js'
import fs from "fs/promises";
import mongoose from "mongoose";

// @desc Upload PDF document
// @route GET/api/document/upload
// @access Private
export const uploadDocument = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: "Please upload a file", statusCode: 400
            });
        }

        const { title } = req.body;

        if (!title) {
            //Delete uploaded file if no file uploaded
            await fs.unlink(req.file.path).catch(() => { });
            return res.status(400).json({
                success: false,
                error: "Please provide  a document title", statusCode: 400
            });
        }

        //Construct the URL for the uploaded file
        const baseUrl = `https://localhost:${process.env.PORT || 8000}`;
        const fileUrl = `${baseUrl}/uploads/documents/${req.file.filename}`;

        //Create document record
        const document = await Document.create({
            userId: req.user._id,
            title,
            fileName: req.file.originalname,
            filePath: fileUrl,
            fileSize: req.file.size,
            status: 'processing'
        })

        //Process pDF in background
        processPDF(document._id, req.file.path).catch(err => {
            console.error('PDF processing error:', err);
        });

        return res.status(201).json({
            success: true,
            data: document,
            message: "Document uploaded successfully. Processing in progress..."
        });
    } catch (error) {
        //Cleanup file on error
        if (req.file) {
            await fs.unlink(req.file.path).catch(() => { });
        }
        next(error);
    }
};

// @desc Get All user documents
// @route GET/api/documents
// @access Private
export const getDocuments = async (req, res, next) => {
    try {

    } catch (error) {
        next(error);
    }
};

// @desc Get single document with chunks
// @route GET/api/documents/:id
// @access Private
export const getDocument = async (req, res, next) => {
    try {

    } catch (error) {
        next(error);
    }
};

// @desc Delete Document
// @route DELETE/api/documents/:id
// @access Private
export const deleteDocument = async (req, res, next) => {
    try {

    } catch (error) {
        next(error);
    }
};

// @desc Update Document Title
// @route PUT/api/documents/:id
// @access Private
export const updateDocument = async (req, res, next) => {
    try {

    } catch (error) {
        next(error);
    }
};