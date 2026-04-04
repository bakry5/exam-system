let questions = [];
let currentIndex = 0;
let userAnswers = {};
let markedQuestions = new Set();
let totalTime = 50;
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || { firstName: "Student", lastName: "" };
let timerInterval;
 let time=totalTime


class Question {
    constructor(id, text, options, correctAnswerIndex) {
        this.id = id;
        this.text = text;
        this.options = options;
        this.correctAnswerIndex = correctAnswerIndex;
    }
}
//1
async function loadQuestions() {
    try {
        const response = await fetch('questions.json');

        
        const data = await response.json();
     
       questions = data.map((e)=> new Question(e.id, e.text, e.options, e.correctAnswerIndex));

       questions.sort(()=> Math.random() - 0.5)

       console.log(questions)

        
        initExam();
    } catch (error) {
        console.error("Error:", error);
        document.getElementById('questionText').innerHTML = "Failed to load questions.";
    }
}

//2
function initExam() {
    displayUser(); //done
    startTimer();//done
    render();
    btnControls();
}
//3
function displayUser() {
    document.getElementById('userFullName').textContent = `${currentUser.firstName} ${currentUser.lastName}`;
} 
//4
function startTimer() {
    const timerDisplay = document.getElementById('timerDisplay');
    timerInterval = setInterval(() => {
        time--;
        console.log(time)
        let mins = Math.floor(time / 60);
        let secs = time % 60;
        if (timerDisplay) timerDisplay.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        let progressWidth = (time / totalTime) * 100;
        const bar = document.getElementById('progressFill');
        bar.classList.add(`${time<(totalTime/2)? "bg-danger":"bg-primary"}`)
      bar.style.width = progressWidth + "%";
        
        if (time <= 0) {
            clearInterval(timerInterval);
            finishExam(true);
        }
    }, 1000);
}

function render() {
        if (questions.length === 0) return;
//  object one
        const q = questions[currentIndex];
        console.log(q)
    
        document.getElementById('questionText').textContent = q.text;
        document.getElementById('currentQuestionNum').textContent = currentIndex + 1;
        document.getElementById('totalQuestions').textContent = questions.length;
        document.getElementById('questionNumberDisplay').textContent = `Question ${currentIndex + 1}`;
    
    //     const progressPercent = ((currentIndex + 1) / questions.length) * 100;
    //     const bar = document.getElementById('progressFill');
    //   bar.style.width = progressPercent + "%";
    //   // let progressWidth = (timeLeft / totalDuration) * 100;
    
        renderOptions(q);///
        renderMarkList();
        updateMarkBtnStyle();
    
    const btnPrev = document.getElementById('btnPrev');
    const next = document.getElementById('nextBtn');

    if (btnPrev) btnPrev.style.visibility = (currentIndex === 0) ? 'hidden' : 'visible';

    if (currentIndex === questions.length - 1) {
            next.textContent = "Finish";
            next.style.backgroundColor = "red";
        } else {
                next.textContent = "Next";
                next.style.backgroundColor = ""; 
            }
        }
//5
        function renderOptions(question) {
                const container = document.getElementById('answersContainer');
                container.innerHTML = '';
            
                question.options.forEach((opt, index) => {
                        const div = document.createElement('div');
                        const isSelected = (userAnswers[currentIndex] === index);
                
                        div.className = `answer-item border rounded p-3 mb-2 shadow-sm ${isSelected ? 'bg-primary text-white selected' : 'bg-white'}`;
                        div.style.cursor = 'pointer';
                        div.innerHTML = ` ${opt}`;
                
                        div.onclick = () => {
                                userAnswers[currentIndex] = index;
                                render();
                                console.log(userAnswers)
        };
        container.appendChild(div);
    });
}
//6 
function toggleMark() {
        if (markedQuestions.has(currentIndex)) {
                markedQuestions.delete(currentIndex);
    } else {
            markedQuestions.add(currentIndex);
        }
    render();
}
//7
function renderMarkList() {
    const list = document.getElementById('markedList');
    list.innerHTML = '';
    
    if (markedQuestions.size === 0) {
        list.innerHTML = '<li class="list-group-item text-secondary">No marked questions yet</li>';
        return;
    }
        console.log(markedQuestions);
    [...markedQuestions].sort((a, b) => a - b).forEach(e => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center bg-light mb-2 border rounded';
            li.innerHTML = `
            <span style="cursor:pointer" onclick="goToQuestion(${e})">Question ${e + 1}</span>
            <span class="text-danger fw-bold" style="cursor:pointer; font-size:1.2rem" onclick="removeMark(${e})">&times;</span>
        `;
        list.appendChild(li);
    });
}

function removeMark(idx) {
    markedQuestions.delete(idx);
    render();
}

function goToQuestion(idx) {
        currentIndex = idx;
        render();
    }

    function updateMarkBtnStyle() {
            const btn = document.getElementById('markBtn');
            if (markedQuestions.has(currentIndex)) {
                    btn.className = 'btn btn-success px-4';
                    btn.innerHTML = '<i class="bi bi-bookmark-check-fill me-2"></i> Marked';
                } else {
                        btn.className = 'btn btn-outline-warning px-4';
                        btn.innerHTML = '<i class="bi bi-bookmark-plus me-2"></i> Mark Question';
                    }
                }
                
                function btnControls() {
                        document.getElementById('nextBtn').onclick = () => {
                                if (currentIndex < questions.length - 1) {
                                        currentIndex++;
                                        render();
                                    } else {
                                            finishExam(false);
                                        }
                                    };
                                
                                    const btnPrev = document.getElementById('btnPrev');
                                    if (btnPrev) {
                                            btnPrev.onclick = () => {
                                                    if (currentIndex > 0) {
                                                            currentIndex--;
                render();
            }
        };
    }

    document.getElementById('markBtn').onclick = toggleMark;
}

function finishExam(isTimeout) {
        clearInterval(timerInterval);
    let score = 0;
    questions.forEach((q, i) => {
            if (userAnswers[i] === q.correctAnswerIndex) score++;
        });
    
        const pageTitle = isTimeout ? "Timeout Page" : "Grades Page";
        const name = `${currentUser.firstName} ${currentUser.lastName}`;
    
    document.body.innerHTML = `
        <div class="container py-5 text-center">
            <div class="card shadow p-5 border-0 rounded-4">
                <h1 class="display-4 ${(isTimeout || score <= 3 ) ? 'text-danger' : 'text-success'} mb-4">${pageTitle}</h1>
                <p class="h3">Student: <strong>${name}</strong></p>
                <div class="alert alert-info mt-4 d-inline-block px-5">
                    <span class="h1">Score: ${score} / ${questions.length}</span>
                </div>
                <div class="mt-4">
                    <button onclick="location.href='home.html'" class="btn btn-primary btn-lg px-5">Back to Home</button>
                </div>
            </div>
        </div>`;
}

// history.pushState(null, null, location.href);
// window.onpopstate = function () {
//         history.go(1);
//     };
    
//     window.onbeforeunload = function() {
//             return "Are you sure you want to leave? Your exam progress will be lost!";
//         };
        
        // function openFullscreen() {
        //       let elem = document.documentElement;
        //       if (elem.requestFullscreen) {
        //             elem.requestFullscreen();
        //           } else if (elem.webkitRequestFullscreen) { /* Safari */
        //             elem.webkitRequestFullscreen();
        //           } else if (elem.msRequestFullscreen) { /* IE11 */
        //             elem.msRequestFullscreen();
        //           }
        //         }
                
             
                loadQuestions()