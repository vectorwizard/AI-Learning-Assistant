import Quiz from '../models/Quiz.js'

// @desc Get All flashcards for a document
// @route GET/api/quizzes/:documentId
// @access Private
export const getQuizzes = async (req, res, next) => {
    try {
        const quizzes = await Quiz.find({
            userId: req.user._id,
            documentId: req.params.documentId
        })
            .populate('documentId', 'title filename')
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: quizzes.length,
            data: quizzes
        });
    } catch (error) {
        next(error);
    }
};


// @desc    Get a single quiz by ID
// @route   GET /api/quizzes/quiz/:id
// @access  Private
export const getQuizById = async (req, res, next) => {
    try {
        const quiz = await Quiz.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!quiz) {
            return res.status(404).json({
                success: false,
                error: "Quiz Not found", statusCode: 404
            });
        }

        res.status(200).json({
            success: true,
            data: quiz
        });
    } catch (error) {
        next(error);
    }
};

// @desc Submit Quiz Answers
// @route POST /api/quizzes/:id/submit
// @access Private
export const submitQuiz = async (req, res, next) => {
    try {
        const { answers } = req.body;

        if (!Array.isArray(answers)) {
            return res.status(400).json({
                success: false,
                error: "Please provide answer array",
                statusCode: 400
            });
        }

        const quiz = await Quiz.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!quiz) {
            return res.status(404).json({
                success: false,
                error: "Quiz Not found",
                statusCode: 404
            });
        }

        if (quiz.completedAt) {
            return res.status(400).json({
                success: false,
                error: "Quiz already completed",
                statusCode: 400
            });
        }

        let correctcnt = 0;
        const userAnswers = [];

        answers.forEach(answer => {
            const { questionIndex, selectedAnswer } = answer;

            let isCorrect = false;

            if (questionIndex >= 0 && questionIndex < quiz.questions.length) {
                const question = quiz.questions[questionIndex];

                // Example: ["O3"] -> "O3" -> 2
                const optionIndex =
                    Number(question.correctAnswer[0].replace("O", "")) - 1;

                const correctAnswer = question.options[optionIndex];

                isCorrect = selectedAnswer === correctAnswer;

                if (isCorrect) {
                    correctcnt++;
                }
            }

            userAnswers.push({
                questionIndex,
                selectedAnswer,
                isCorrect,
                answeredAt: new Date()
            });
        });

        const score = Math.round(
            (correctcnt / quiz.totalQuestions) * 100
        );

        quiz.userAnswers = userAnswers;
        quiz.score = score;
        quiz.completedAt = new Date();

        await quiz.save();

        res.status(200).json({
            success: true,
            message: "Quiz submitted successfully",
            data: {
                quizId: quiz._id,
                score,
                correctcnt,
                totalQuestions: quiz.totalQuestions,
                percentage: score,
                userAnswers
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc Get quiz results
// @route GET/api/quizzes/:id/results
// @access Private
export const getQuizResults = async (req, res, next) => {
    try {
        const quiz = await Quiz.findOne({
            _id: req.params.id,
            userId: req.user._id,
        }).populate('documentId', 'title');

        if (!quiz) {
            return res.status(404).json({
                success: false,
                error: "Quiz Not found",
                statusCode: 404
            });
        }

        if (!quiz.completedAt) {
            return res.status(400).json({
                success: false,
                error: "Quiz not completed yet",
                statusCode: 400
            });
        }

        //Build detailed results
        const detailedResults = quiz.questions.map((question, index) => {
            const userAnswer = quiz.userAnswers.find(a => a.questionIndex === index);

            return {
                questionIndex: index,
                question: question.question,
                options: question.options,
                correctAnswer: question.correctAnswer,
                selectedAnswer: userAnswer?.selectedAnswer || null,
                isCorrect: userAnswer?.isCorrect || false,
                explanation: question.explanation
            };
        });

        res.status(200).json({
            success: true,
            data: {
                id: quiz._id,
                title: quiz.title,
                document: quiz.documentId,
                score: quiz.score,
                totalQuestions: quiz.totalQuestions,
                completedAt: quiz.completedAt
            },
            results: detailedResults
        });
    } catch (error) {
        next(error);
    }
};

// @desc Delete Quiz
// @route DELETE/api/quizzes/:id
// @access Private
export const deleteQuiz = async (req, res, next) => {
    try {
        const quiz = await Quiz.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!quiz) {
            return res.status(404).json({
                success: false,
                error: "Quiz Not found",
                statusCode: 404
            });
        }

        await quiz.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Quiz deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

