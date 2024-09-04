// close footer and header if iframe
document.addEventListener("DOMContentLoaded", function () {
    const isEmbedded = top.document.body.dataset.root == "true";
    console.log(isEmbedded);

    // const tag = window.parent.document.getElementById("sign-up");
    if (isEmbedded) {
        const header = document.getElementById("header");
        const footer = document.getElementById("footer");
        const body = document.body;
        // const body = document.getElementById("container");

        if (header) header.style.display = "none";
        if (footer) footer.style.display = "none";
        body.style.backgroundColor = "#f3f3f3";
    }
});
window.showImage = function (src) {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    modal.style.display = "block";
    modalImg.src = src;
    console.log("Clothing size list showed");
};

window.closeImage = function (event) {
    const modal = document.getElementById("imageModal");
    if (event.target === modal || event.target.className === "close") {
        modal.style.display = "none";
    }
    console.log("Clothing size list closed");
};

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

const PAYMENT2TXT = {
    ATM: "轉帳",
    OFFICE: "至系辦繳納",
};

window.todo = async function () {
    check_form();
};

// datas to set
window.check_form = async function () {
    const form = document.getElementById("FORM");

    const fields = {
        SID: "學號",
        NAME: "姓名",
        PLAN: "方案",
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
        alert(`請填寫以下必填欄位：\n${emptyFields.join("\n")}`);
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
        name: form.NAME.value,
        plan: form.PLAN.value,
    });
    await student.confirmInfo();
};

// db stuff
class Stu {
    constructor(studentData) {
        this.sid = studentData.sid;
        this.name = studentData.name;
        this.plan = studentData.plan;
        if (this.sid[0].toLowerCase() === "s") {
            this.sid = this.sid.slice(1);
        }
    }

    async confirmInfo() {
        const isConfirm = window.confirm(
            "請確認以下資訊是否正確\n 學號：" +
                this.sid +
                "\n 姓名：" +
                this.name +
                "\n 系費方案：" +
                PLAN2TXT[this.plan]
        );
        if (isConfirm) {
            await writeUserData(this);
        } else {
            alert("你已取消送出報名表單!");
        }
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
    set(ref(db, `/students/${stu.sid}`), {
        NAME: stu.name,
        PLAN: stu.plan,
    })
        .then(function () {
            console.log("Data written successfully");
            alert(
                "您所要繳納的費用為：" +
                    COST2TXT[stu.plan] +
                    "\n請至系辦(R1303B)繳納"
            );
            const isEmbedded = top.document.body.dataset.root == "true";
            if (isEmbedded) {
                const section = document.getElementById("dept-fees");
                section.src = "https://yzu-cse-2024.pages.dev/payments/";
            } else {
                window.location.href = "../payments/index.html";
            }
        })
        .catch(function (error) {
            console.error("Error writing data: ", error);
            alert("伺服器發生錯誤，請稍後再試\n錯誤訊息: " + error.message);
        });
}
