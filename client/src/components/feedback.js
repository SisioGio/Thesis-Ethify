// client/src/App.js

import React, { useEffect } from "react";

import { DispatchFeedbackContexts, ShowFeedbackContexts } from "./../App";

function Feedback() {
  const closeFeedback = () => {
    dispatch({ value: false });
  };
  const feedback = ShowFeedbackContexts();
  const [showElement, setShowElement] = React.useState(true);

  const dispatch = DispatchFeedbackContexts();
  useEffect(() => {
    setShowElement(true);
    setTimeout(() => {
      setShowElement(false);
    }, 7500);
  }, [feedback]);
  return (
    feedback && (
      <div>
        <div
          onClick={closeFeedback}
          id="feedback"
          // className="feedback-visible"
          class={
            feedback.type && showElement
              ? "feedback-visible "
              : "feedback-hidden "
          }
          style={{
            backgroundColor: feedback.type === "Error" ? "#ff2b2b" : "#30c31e",
          }}
        >
          <p>{feedback.message}</p>
        </div>
      </div>
    )
  );
}

export default Feedback;
