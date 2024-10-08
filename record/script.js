window.todo = async function () {
    check_form();
};

// datas to set
window.check_form = async function () {
    const form = document.getElementById("FORM");

    const fields = {
        SID: "學號",
        isStudy: "就讀?",
        isMail: "新生包?",
        PARTY: "新生茶會",
        TRAIN: "新生訓練",
        BASKETBALL: "系籃",
        VOLLEYBALL: "系排",
        BADMINTON: "系羽",
        LINE: "加入Line群",
        INSTAGRAM: "追蹤Instagram",
    };

    let emptyFields = [];
    let firstEmptyField = null;

    // Check all fields including radio buttons
    for (let [id, label] of Object.entries(fields)) {
        const field = form[id];
        if (field) {
            if (field.type === "radio") {
                const checkedRadio = form.querySelector(
                    `input[name="${id}"]:checked`
                );
                const radioLabels = form.querySelectorAll(
                    `input[name="${id}"] + label`
                );
                if (!checkedRadio) {
                    emptyFields.push(label);
                    radioLabels.forEach((label) => (label.style.color = "red"));
                    if (!firstEmptyField) {
                        firstEmptyField = field;
                    }
                } else {
                    radioLabels.forEach((label) => (label.style.color = ""));
                }
            } else if (field.type === "checkbox") {
                const checkboxLabel = field.nextElementSibling;
                if (!field.checked) {
                    emptyFields.push(label);
                    if (checkboxLabel && checkboxLabel.tagName === "LABEL") {
                        checkboxLabel.style.color = "red";
                    }
                    if (!firstEmptyField) {
                        firstEmptyField = field;
                    }
                } else {
                    if (checkboxLabel && checkboxLabel.tagName === "LABEL") {
                        checkboxLabel.style.color = "";
                    }
                }
            } else if (!field.value) {
                emptyFields.push(label);
                if (field.style) {
                    field.style.color = "red";
                }
                if (!firstEmptyField) {
                    firstEmptyField = field;
                }
            } else {
                if (field.style) {
                    field.style.color = "";
                }
            }
        } else {
            console.warn(`Field with id "${id}" not found in the form.`);
        }
    }

    if (emptyFields.length > 0) {
        alert(`還有這些沒問到：\n${emptyFields.join("\n")}`);
        if (firstEmptyField) {
            firstEmptyField.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
            firstEmptyField.focus();
        }
        return;
    }

    // If all checks pass, create the Stu object and proceed
    const student = new Stu({
        sid: form.SID.value,
        isStudy: form.STUDY_YES.checked,
        isMail: form.MAIL_YES.checked,
        party: form.PARTY.checked,
        train: form.TRAIN.checked,
        basketball: form.BASKETBALL.checked,
        volleyball: form.VOLLEYBALL.checked,
        badminton: form.BADMINTON.checked,
        line: form.LINE.checked,
        instagram: form.INSTAGRAM.checked,
        question: form.QUESTION.value,
        coomment: form.COMMENT.value,
    });
    await student.confirmInfo();
};

// db stuff
class Stu {
    constructor(studentData) {
        this.sid = studentData.sid || "";
        this.isStudy = studentData.isStudy || false;
        this.isMail = studentData.isMail || false;
        this.party = studentData.party || false;
        this.train = studentData.train || false;
        this.basketball = studentData.basketball || false;
        this.volleyball = studentData.volleyball || false;
        this.badminton = studentData.badminton || false;
        this.line = studentData.line || false;
        this.instagram = studentData.instagram || false;
        this.question = studentData.question || "";
        this.comment = studentData.comment || "";
    }

    async confirmInfo() {
        await writeUserData(this);
    }
}

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getDatabase,
    ref,
    set,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

import {
    initializeAppCheck,
    ReCaptchaV3Provider,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-check.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD6pq3yYHT1L0wmTDDKk--tiaWXLRzxCI0",
    authDomain: "yzu-cse-2024-1bd46.firebaseapp.com",
    databaseURL:
        "https://yzu-cse-2024-1bd46-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "yzu-cse-2024-1bd46",
    storageBucket: "yzu-cse-2024-1bd46.appspot.com",
    messagingSenderId: "96110561831",
    appId: "1:96110561831:web:bc97bff8fa40705f321c02",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(
        "6LeB6ygqAAAAANYj4WhDvaufI9htgm67wx8fW6VS"
    ),

    // Optional argument. If true, the SDK automatically refreshes App Check
    // tokens as needed.
    isTokenAutoRefreshEnabled: true,
});

async function writeUserData(stu) {
    const db = getDatabase();
    const dt = new Date().toString();
    set(ref(db, `/checked/${stu.sid}`), {
        isStudy: stu.isStudy,
        isMail: stu.isMail,
        PARTY: stu.party,
        TRAIN: stu.train,
        BASKETBALL: stu.basketball,
        VOLLEYBALL: stu.volleyball,
        BADMINTON: stu.badminton,
        LINE: stu.line,
        INSTAGRAM: stu.instagram,
        QUESTION: stu.question,
        COMMENT: stu.comment,
    })
        .then(function () {
            console.log("Data written successfully");
            window.location.href = "./index.html";
        })
        .catch(function (error) {
            console.error("Error writing data: ", error);
            alert("伺服器發生錯誤，請稍後再試\n錯誤訊息: " + error.message);
        });
}
