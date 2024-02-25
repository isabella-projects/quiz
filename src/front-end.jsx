import React from 'react';
import ReactDOM from 'react-dom';
import './front-end.scss';

const divsToUpdate = document.querySelectorAll('.quiz-update-me');

divsToUpdate.forEach(function (div) {
    ReactDOM.render(<Quiz />, div);
    console.log(div);
    div.classList.remove('.quiz-update-me');
});

function Quiz() {
    return <div className="quiz-frontend">Hello from React</div>;
}
