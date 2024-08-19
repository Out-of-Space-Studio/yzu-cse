window.todo = async function () {
    check_form();
};

// datas to set
window.check_form = async function () {
    const form = document.getElementById("FORM");

    const fields = {
        SID: "學號",
        isStudy: "就讀",
        isMail: "新生包",
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

    for (let [id, label] of Object.entries(fields)) {
        const field = form[id];
        if (field) {
            if (!field.value) {
                emptyFields.push(label);
                field.style.borderColor = "red";
                if (!firstEmptyField) {
                    firstEmptyField = field;
                }
            } else {
                if (field.style) {
                    field.style.borderColor = "";
                }
            }
        } else {
            console.warn(`Field with id "${id}" not found in the form.`);
        }
    }

    if (emptyFields.length > 0) {
        alert(`還有這些沒問到：\n${emptyFields.join("\n")}`);
        setTimeout(() => {
            if (firstEmptyField) {
                firstEmptyField.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
                firstEmptyField.focus();
            }
        }, 0);
        return;
    }

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
    });
    await student.confirmInfo();
};

// db stuff
class Stu {
    constructor(studentData) {
        this.sid = studentData.sid;
        this.isStudy = studentData.isStudy;
        this.isMail = studentData.isMail;
        this.party = studentData.party;
        this.train = studentData.train;
        this.basketball = studentData.basketball;
        this.volleyball = studentData.volleyball;
        this.badminton = studentData.badminton;
        this.line = studentData.line;
        this.instagram = studentData.instagram;
    }

    async confirmInfo() {
        // const isConfirm = window.confirm(
        //     "請確認以下資訊是否正確\n 學號：" +
        //         this.sid +
        //         "\n 姓名：" +
        //         this.name +
        //         "\n 系費方案：" +
        //         PLAN2TXT[this.plan]
        // );
        // if (isConfirm) {
        //     await writeUserData(this);
        // } else {
        //     alert("你已取消送出報名表單!");
        // }
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
        SID: stu.sid,
        isStudy: stu.isStudy,
        isMail: stu.isMail,
        PARTY: stu.party,
        TRAIN: stu.train,
        BASKETBALL: stu.basketball,
        VOLLEYBALL: stu.volleyball,
        BADMINTON: stu.badminton,
        LINE: stu.line,
        INSTAGRAM: stu.instagram,
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
