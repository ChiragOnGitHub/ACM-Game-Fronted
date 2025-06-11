// client/src/components/Admin/QuestionForm.js
import React, { useState } from 'react';
import { addRiddle } from '../../api/admin';

function QuestionForm({ riddles, onRiddleAdded }) {
    const [question, setQuestion] = useState('');
    const [image, setImage] = useState(''); // For image URL
    const [answer, setAnswer] = useState('');
    const [answerCaseSensitive, setAnswerCaseSensitive] = useState(false);
    const [nextRiddle, setNextRiddle] = useState(''); // ID of next riddle for nesting
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const newRiddle = {
                question,
                image,
                answer,
                answerCaseSensitive,
                nextRiddle: nextRiddle || null, // Send null if not selected
            };
            const response = await addRiddle(newRiddle);
            setMessage(response.message);
            onRiddleAdded(); // Notify parent to refresh
            // Clear form
            setQuestion('');
            setImage('');
            setAnswer('');
            setAnswerCaseSensitive(false);
            setNextRiddle('');
        } catch (err) {
            console.error('Error adding riddle:', err);
            setError(err.response?.data?.message || 'Failed to add riddle.');
        }
    };

    return (
        <div className="admin-form-card">
            <h3>Add New Riddle/Question</h3>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Question:</label>
                    <textarea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div>
                    <label>Image URL (Optional):</label>
                    <input
                        type="text"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                    />
                </div>
                <div>
                    <label>Correct Answer:</label>
                    <input
                        type="text"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={answerCaseSensitive}
                            onChange={(e) => setAnswerCaseSensitive(e.target.checked)}
                        />
                        Answer is case-sensitive
                    </label>
                </div>
                <div>
                    <label>Next Riddle (for nesting, optional):</label>
                    <select
                        value={nextRiddle}
                        onChange={(e) => setNextRiddle(e.target.value)}
                    >
                        <option value="">-- Select a riddle --</option>
                        {riddles.map(r => (
                            <option key={r._id} value={r._id}>{r.question.substring(0, 50)}...</option>
                        ))}
                    </select>
                </div>
                <button type="submit">Add Riddle</button>
            </form>
        </div>
    );
}

export default QuestionForm;