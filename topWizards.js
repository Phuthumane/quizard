const topWizardsList = document.getElementById("topWizardsList");
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

topWizardsList.innerHTML = highScores
  .map(score => {
    return `<li class="high-score">${score.name} - ${score.score}</li>`;
  })
  .join("");