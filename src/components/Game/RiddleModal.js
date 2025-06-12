import React, { useState } from 'react';
import './RiddleModal.css';

function RiddleModal({
  riddle,
  onClose,
  onSubmitAnswer,
  folderId,
  lastAttemptStatus,
  showFinalSuccess,
  submittingAnswer
}) {
  const [answer, setAnswer] = useState('');
  const [inputError, setInputError] = useState('');
  const [attemptFeedback, setAttemptFeedback] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!answer.trim()) {
      setInputError('Answer cannot be empty.');
      return;
    }

    setInputError('');
    setAttemptFeedback('');
    const result = await onSubmitAnswer(answer.trim().toLowerCase());

    if (result === 'folder-unlocked') {
    // nothing to show; modal will auto-close
    } else if (result === 'nested-correct') {
    setAttemptFeedback('Correct! But more to solve...');
    } else if (result === 'incorrect') {
    setAttemptFeedback('Wrong Answer. Try again!');
    }



    setAnswer('');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-button" onClick={onClose}>
          &times;
        </button>

        {showFinalSuccess ? (
          <div className="popup-success">🎉 Folder Unlocked!</div>
        ) : (
          <>
            <h2>Riddle: {riddle.question}</h2>
            {riddle.image && (
              <img src={riddle.image} alt="Riddle Hint" className="riddle-image" />
            )}
            {inputError && <p className="input-error-message">{inputError}</p>}
            {attemptFeedback && (
              <p className={`attempt-feedback ${lastAttemptStatus}`}>
                {attemptFeedback}
              </p>
            )}

            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="riddle-answer">Your Answer:</label>
                <input
                  type="text"
                  id="riddle-answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  autoFocus
                  required
                />
              </div>
              <button type="submit" disabled={submittingAnswer}>
                    {submittingAnswer ? 'Submitting...' : 'Submit Answer'}
                </button>
            </form>

            {riddle.hints && riddle.hints.length > 0 && (
              <div className="riddle-hints">
                <h4>Hints:</h4>
                <ul>
                  {riddle.hints.map((hint, index) => (
                    <li key={index}>{hint}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default RiddleModal;
