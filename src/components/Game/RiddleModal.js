import React, { useState, useEffect } from 'react';
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
  const [toastMessage, setToastMessage] = useState(null);

  // Auto-scroll to modal when it opens or riddle updates
  useEffect(() => {
    if (riddle) {
      // Small delay to ensure modal is fully rendered
      const timer = setTimeout(() => {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth'
        });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [riddle]);

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      onClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!answer.trim()) {
      setToastMessage({ text: 'Answer cannot be empty.', type: 'error' });
      return;
    }

    const result = await onSubmitAnswer(answer.trim().toLowerCase());

    // Show appropriate feedback based on result
    if (result === 'folder-unlocked') {
      setToastMessage({ text: '🎉 Correct! Folder Unlocked!', type: 'success' });
      setAnswer(''); // Clear input
    } else if (result === 'nested-correct') {
      setToastMessage({ text: 'Correct! But more to solve...', type: 'success' });
      setAnswer(''); // Clear input for next riddle
    } else if (result === 'incorrect') {
      setToastMessage({ text: 'Wrong Answer. Try again!', type: 'error' });
      setAnswer(''); // Clear input for retry
    }
  };

  // Auto hide toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Hide modal when submitting answer - loading screen will be visible instead
  if (submittingAnswer) {
    return null;
  }

  return (
    <>
      <div className="modal-overlay" onClick={handleOverlayClick}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close-button" onClick={onClose}>
            &times;
          </button>

          <h2>Riddle: {riddle.question}</h2>
          {riddle.image && (
            <img
              src={`/${riddle.image}`}
              alt="Riddle Hint"
              className="riddle-image"
            />
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
            <button type="submit">
              Submit Answer
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
        </div>
      </div>

      {toastMessage && (
        <div className={`toast ${toastMessage.type}`}>
          {toastMessage.text}
        </div>
      )}
    </>
  );
}

export default RiddleModal;