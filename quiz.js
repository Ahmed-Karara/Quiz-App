let questionArea = document.querySelector('.quiz-area');
let answersArea = document.querySelector('.answers-area');
let questionsCount = document.querySelector('.count span');
let category = document.querySelector('.category span');
let bullets = document.querySelector('.bullets .spans');
let bulletss = document.querySelector('.bullets ');
let submitButton = document.querySelector('.submit-button');
let result = document.querySelector('.results');
let countdown = document.querySelector('.countdown');

let count = 5;

let currentQuestion = 0;
let userAnswer;
let rightAnswer;
let gradeCounter = 0;

function getQuestions() {
	let myobj = new XMLHttpRequest();

	myobj.onreadystatechange = function () {
		if (this.readyState === 4 && this.status === 200) {
			let questionsobj = JSON.parse(this.responseText);
			let questionsObjCount = questionsobj.length;
			if (currentQuestion == 0) {
				alert('click ok to start the quiz');
			}
			getQuestionsCount(questionsObjCount);

			showQuestion(questionsobj[currentQuestion].title);
			for (let i = 1; i < 5; i++) {
				showAnswers(questionsobj[currentQuestion]['answer_' + i], i);
			}

			answersArea.onclick = getAnswer;
			timer(90, questionsObjCount);

			submitButton.onclick = function () {
				rightAnswer = questionsobj[currentQuestion]['right_answer'];
				checkAnswer(rightAnswer, userAnswer);
				count = 5;
				reset(questionsobj);
			};
		}
	};

	myobj.open('GET', 'questions.json', true);
	myobj.send();
}

getQuestions();

// Get Number of Questions in JSON object And create bullets
function getQuestionsCount(num) {
	questionsCount.innerHTML = num;
	category.innerHTML = 'HTML';

	for (let i = 0; i < num; i++) {
		let theBullets = document.createElement('span');
		if (i == currentQuestion) {
			theBullets.className = 'on';
			theBullets.innerText = currentQuestion + 1;
		}
		bullets.appendChild(theBullets);
	}
}

// Create Questions Title
function showQuestion(Q1) {
	let question = document.createElement('div');
	let title = document.createElement('h2');

	title.textContent = Q1;

	question.appendChild(title);
	questionArea.appendChild(question);
}

// Create the Answers
function showAnswers(Ans1, id) {
	let answers = document.createElement('div');
	answers.className = 'answer';

	let answerInp = document.createElement('input');
	answerInp.type = 'Radio';
	answerInp.setAttribute('id', 'answer' + id);
	answerInp.setAttribute('name', 'answer');

	let ansLabel = document.createElement('label');
	ansLabel.setAttribute('for', 'answer' + id);
	ansLabel.innerText = Ans1;

	answers.appendChild(answerInp);
	answers.appendChild(ansLabel);
	answersArea.appendChild(answers);
}

// reset the question feild and add the next question
function reset(obj) {
	currentQuestion++;
	questionArea.innerHTML = '';
	answersArea.innerHTML = '';
	showQuestion(obj[currentQuestion].title);
	for (let i = 1; i < 5; i++) {
		showAnswers(obj[currentQuestion]['answer_' + i], i);
	}
	bulletsHandler(currentQuestion);
}

// Handle bullets with Question Number
function bulletsHandler(num) {
	let bulletsArray = Array.from(bullets.childNodes);
	bulletsArray.forEach(function (e) {
		e.innerText = '';
		e.classList.remove('on');
	});
	bulletsArray[num].className = 'on';
	bulletsArray[num].innerText = num + 1;
}

// Get the checked Answer
function getAnswer() {
	let area = Array.from(answersArea.childNodes);
	area.forEach(function (e) {
		if (e.firstChild.checked) {
			let right = e.firstChild.nextSibling.textContent;
			userAnswer = right;
		}
	});
}

// check If user Answer is Correct And Count Grade
function checkAnswer(right, user) {
	if (right === user) {
		gradeCounter++;
	}
}

// Calculate The Final Grade Of user
function finnalGrade(num, sum) {
	let grade = document.createElement('span');

	if (num <= 4) {
		grade.className = 'bad';
		grade.textContent = '  Your grade is  ' + num + '/' + sum;
	}
	if (num >= 5) {
		grade.className = 'good';
		grade.textContent = '  Your grade is ' + num + '/' + sum;
	}
	if (num >= 9) {
		grade.className = 'perfect';
		grade.textContent = '  Your grade is ' + num + '/' + sum;
	}

	result.appendChild(grade);
}

// set a timer for every question and clear it after last question
function timer(num, obj) {
	count = num;

	let timeLeft = setInterval(() => {
		countdown.textContent = count + ' Seconds';
		if (--count < 0) {
			submitButton.click();
		}
		if (currentQuestion === obj) {
			submitButton.remove();
			clearInterval(timeLeft);
			finnalGrade(gradeCounter, obj);
			countdown.innerHTML = '';
			questionArea.remove();
			answersArea.remove();
			bulletss.remove();
		}
	}, 1000);
}
