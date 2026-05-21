const genBtn = document.querySelector("#gen");
const aiPara = document.querySelector("#ai-gen");
const input = document.querySelector("#resume");
const scoreBtn = document.querySelector("#score-gen");
const scorePara = document.querySelector("#score-para");
const suggestions = document.querySelector(".suggestions");
const pdfUpload = document.querySelector("#pdf-upload");
const loginBtn = document.querySelector("#login-btn");
const modalOverlay = document.querySelector("#modal-overlay");
const closeBtn = document.querySelector("#close-btn");
const submitBtn = document.querySelector("#submit-btn");
const modal = document.querySelector("#modal");
const emailInput = document.querySelector("#email-input");
const nameInput = document.querySelector("#name-input");
const surnameInput = document.querySelector("#surname-input");
// Using local backend for API calls securely

input.addEventListener("input", () => {
    if(!input.value.includes("EXPERIENCE") || !input.value.includes("SKILLS") || !input.value.includes("EDUCATION")){
        let missPara = document.createElement("p");
        missPara.innerText = "Please add mandatory fields like EXPERIENCE, EDUCATION & SKILLS in your resume.";
        suggestions.appendChild(missPara);
    }
})

genBtn.addEventListener("click", async () => {
    const inputText = input.value.trim(); 
    if(!inputText){
        aiPara.textContent = "Please paste your resume first."
        return;
    }
    genBtn.disabled = true;
    genBtn.textContent = "Analyzing..";
    aiPara.textContent = "Please wait..";

    try{
        const response = await fetch("/api/analyze", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ inputText })
        });

        const data = await response.json();
        const feedback = data.choices[0].message.content;
        aiPara.innerHTML = feedback
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\* /g, "<br/>• ");
    } catch(error) {
        aiPara.textContent = "Error: " + error.message;
    } finally {
        genBtn.disabled = false;
        genBtn.textContent = "Get AI suggestions";
    }
})

scoreBtn.addEventListener("click", async () => {
    let inputText = input.value.trim();
    if(!inputText){
        scorePara.textContent = "Paste resume first..";
        return;
    }
    scoreBtn.disabled = true;
    scoreBtn.textContent = "Getting score..";
    scorePara.textContent = "Analyzing..";

    try{
        const response = await fetch("/api/score", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ inputText })
        });

const data = await response.json();
const feedback = data.choices[0].message.content;

const scoreMatch = feedback.match(/SCORE:\s*(\d+)\/100/);
const score = scoreMatch ? parseInt(scoreMatch[1]) : null;
const reasonMatch = feedback.match(/REASON:\s*(.+)/);
const reason = reasonMatch ? reasonMatch[1] : null;
    if(score !== null){
    if(score >= 80){
        scorePara.innerHTML = `<span style="color: #22c55e; font-size: 3rem; font-weight: 700;">${score}<span style="color: #888; font-size: 1rem;">/100</span></span><p style="color: #302929; font-size: 0.9rem; margin-top: 0.5rem;">${reason}</p>`
    } else if(score >= 50 && score < 80){
        scorePara.innerHTML = `<span style="color: #f59e0b; font-size: 3rem; font-weight: 700;">${score}<span style="color: #888; font-size: 1rem;">/100</span></span><p style="color: #302929; font-size: 0.9rem; margin-top: 0.5rem;">${reason}</p>`
    } else {
        scorePara.innerHTML = `<span style="color: #ef4444; font-size: 3rem; font-weight: 700;">${score}<span style="color: #888; font-size: 1rem;">/100</span></span><p style="color: #302929; font-size: 0.9rem; margin-top: 0.5rem;">${reason}</p>`
    }
}

    }
    catch(error){
        scorePara.textContent = "Error: " + error.message;
    } finally {
        scoreBtn.disabled = false;
        scoreBtn.textContent = "Get Resume Score";
    }
})

async function extractTextFromPDF(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    
    let fullText = "";
    
    for(let i = 1; i <= pdf.numPages; i++){
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map(item => item.str).join(" ");
        fullText += pageText + "\n";
    }
    
    return fullText;
}

pdfUpload.addEventListener("change", async () => {
    const file = pdfUpload.files[0];
    if(!file) return;
    
    input.value = "Extracting text from PDF...";
    
    const text = await extractTextFromPDF(file);
    input.value = text;
});

loginBtn.addEventListener("click", () => {
    modalOverlay.style.display = "flex";
})

closeBtn.addEventListener("click", () => {
    modalOverlay.style.display = "none";
})

modalOverlay.addEventListener("click", (e) => {
    if(e.target === modalOverlay){
        modalOverlay.style.display = "none";
    }
})

submitBtn.addEventListener("click", async () => {
    const nameInput = document.getElementById("name-input");
    const surnameInput = document.getElementById("surname-input");
    const emailInput = document.getElementById("email-input");

    const response = await fetch("/api/submit-user", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: nameInput.value,
            surname: surnameInput.value,
            email: emailInput.value
        })
    });
    const { error } = await response.json();
         
        if(error){
            console.log("Error saving: ", error.message)
        } else{
            console.log("saved successfully")
        }

    // Remove any existing error message
    const existingError = modal.querySelector(".error-message");
    if(existingError) {
        existingError.remove();
    }

    if(nameInput.value === "" && surnameInput.value === "" && emailInput.value === ""){
        let modalPara = document.createElement("p");
        modalPara.className = "error-message";
        modalPara.innerText = "Please fill out every field...";
        modal.appendChild(modalPara);
        modalPara.style.color = "red"
        modalPara.style.fontSize = "20px"
    }

    const submitMsg = modal.querySelector(".submit-message");
    if(submitMsg){
        submitMsg.remove();
    }

    if(nameInput.value !== "" && surnameInput.value !== "" && emailInput.value !== ""){
        let modalPara1 = document.createElement("p");
        modalPara1.className = "submit-message";
        modalPara1.innerText = "Your credentials have been submitted!";
        modalPara1.style.color = "green";
        modalPara1.style.fontSize = "20px";
        modal.appendChild(modalPara1);
    }
})

    const emailMsg = modal.querySelector(".email-msg");
    if(emailMsg){
        emailMsg.remove();
    }

emailInput.addEventListener("input", () => {
    if(!emailInput.value.includes("@")){
        const existingEmailMsg = modal.querySelector(".email-msg");
        if(!existingEmailMsg){
            let modalPara2 = document.createElement("p");
            modalPara2.className = "email-msg";
            modalPara2.innerText = "Invalid Email ID";
            modalPara2.style.color = "red";
            modalPara2.style.fontSize = "20px";
            modal.appendChild(modalPara2);
        }
        submitBtn.disabled = true;
    }

    if(emailInput.value.includes("@")){
        const existingEmailMsg = modal.querySelector(".email-msg");
        if(existingEmailMsg){
            existingEmailMsg.remove();
        }
        submitBtn.disabled = false;
    }
})

closeBtn.addEventListener("click", () => {
    nameInput.value = "";
    surnameInput.value = "";
    emailInput.value = "";
})