import React, {useState} from 'react';

var Answer = (props) => {

  var answerObjList = Object.keys(props.answers);

  const [answerIndex, setAnswerIndex] = useState(2);

  var renderedAnswers = answerObjList.slice(0, answerIndex);

  var loadAnswers = () => {
    setAnswerIndex(answerObjList.length + 1);
  }
  return (
  <div>
    {renderedAnswers.map(answerKey => {
      // console.log(answerKey);
      var currentAnswer = props.answers[answerKey];
      // console.log(currentAnswer)
      var answerDate = new Date(currentAnswer.date).toDateString();
      // const [isHelpful, setIsHelpful] = useState(false);

      // var toggleHelpfulness = () => {
      //   setIsHelpful(!isHelpful);
      // }
      return (
        <div>
          <p>A: {currentAnswer.body}</p>
          <p> by {currentAnswer.answerer_name}, {answerDate}  |  Helpful? <a>Yes({currentAnswer.helpfulness})</a></p>
        </div>
      );
    })}

    <b onClick={loadAnswers}>LOAD MORE ANSWERS</b>
  </div>
  );
};

export default Answer;