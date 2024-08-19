const PLAN2TXT = {
    "A-0": "方案A",
    "A-1": "方案A + ɑ組合包",
    "A-2": "方案A + β組合包",
    "A-3": "方案A + ɑ組合包 + β組合包",
    B: "方案B",
};

const COST2TXT = {
    "A-0": 500,
    "A-1": 1800,
    "A-2": 1800,
    "A-3": 3100,
    B: 3000,
};

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
        if (!field.value) {
            emptyFields.push(label);
            field.style.borderColor = "red";
            if (!firstEmptyField) {
                firstEmptyField = field;
            }
        } else {
            field.style.borderColor = "";
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
        isStudy: form.STUDY_YES.value,
        isMail: form.MAIL_YES.value,
        party: form.PARTY.value,
        train: form.TRAIN.value,
        basketball: form.BASKETBALL.value,
        volleyball: form.VOLLEYBALL.value,
        badminton: form.BADMINTON.value,
        line: form.LINE.value,
        instagram: form.INSTAGRAM.value,
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
