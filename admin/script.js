const GENDER2TXT = {
    BOY: "男",
    GIRL: "女",
    NONBIN: "非二元性別",
};

const DIET2TXT = {
    NORMAL: "葷",
    VEGAN: "全素",
    VEGETARIAN: "蛋奶素",
    "OVO-VEGAN": "蛋素",
    "LACTO-VEGAN": "奶素",
    "NO-MEAT": "五辛素",
};

const RELATION2TXT = {
    FATHER: "父",
    MOTHER: "母",
    GRANDFATHER: "爺爺/外公",
    GRANDMOTHER: "奶奶/外婆",
    OTHERS: "其他",
};

// datas to get
window.query = async function () {
    const form = document.getElementById("FORM");

    const fields = {
        ACCOUNT: "帳號",
        PWD: "密碼",
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

    const user = new User({
        account: form.ACCOUNT.value,
        pwd: form.PWD.value,
    });

    await user.verify();
};
class User {
    constructor(userData) {
        this.account = userData.account;
        this.pwd = userData.pwd;
    }
    async verify() {
        checkAdminData(this);
    }
}
// db stuff
class Stu {
    constructor(studentData) {
        this.sid = studentData.sid;
        this.name = studentData.name;
        this.plan = studentData.plan;
    }

    async confirmInfo() {
        const isConfirm = window.confirm(
            "請確認以下資訊是否正確\n 學號：" +
                this.sid +
                "\n 身分證字號：" +
                this.idnumber
        );
        if (isConfirm) {
            await readUserData(this);
        } else {
            alert("你已取消查詢報名資料!");
        }
    }
}

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getDatabase,
    ref,
    set,
    get,
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

async function getUserData() {
    const dbref = ref(getDatabase());
    get(child(dbref, `students`))
        .then((snapshot) => {
            let students = [];
            let count = 0;
            snapshot.forEach((childSnapshot) => {
                students.push(childSnapshot.val());
                console.log(childSnapshot);
                add2Table(
                    count + 1,
                    Object.keys(snapshot.val())[count],
                    childSnapshot.val()
                );
                count++;
            });
        })
        .catch((error) => {
            console.error("Error reading data: ", error);
            alert("伺服器發生錯誤，請稍後再試\n錯誤訊息: " + error.message);
        });
}

async function checkAdminData(user) {
    const dbref = ref(getDatabase());
    get(child(dbref, `admins/${user.account}`))
        .then((snapshot) => {
            if (snapshot.exists()) {
                const correctData = snapshot.val();
                console.log("Query Success");
                console.log(correctData);
                console.log(snapshot);
                if (user.pwd === correctData.PWD) {
                    console.log("Login corrected.");
                    alert("登入成功");
                    getUserData();
                    // window.location.href = "../index.html";
                } else {
                    console.log("Data wrong.");
                    alert("帳號或密碼錯誤");
                }
            } else {
                console.log("No data available");
                alert("找不到該帳號的資料");
            }
        })
        .catch((error) => {
            console.error("Error reading data: ", error);
            alert("伺服器發生錯誤，請稍後再試\n錯誤訊息: " + error.message);
        });
}

async function readUserData(stu) {
    const dbref = ref(getDatabase());
    get(child(dbref, `students/${stu.sid}`))
        .then((snapshot) => {
            if (snapshot.exists()) {
                const correctData = snapshot.val();
                console.log("Query Success");
                console.log(correctData);
                console.log(snapshot);
                if (stu.idnumber === correctData.IDNUMBER) {
                    console.log("Data correct.");
                    alert(
                        "以下資訊為您的報名資料\n 學號：" +
                            stu.sid +
                            "\n 姓名：" +
                            correctData.NAME +
                            "\n 方案：" +
                            correctData.PLAN
                    );
                    window.location.href = "../index.html";
                } else {
                    console.log("Data wrong.");
                    alert("學號或身分證字號錯誤");
                }
            } else {
                console.log("No data available");
                alert("找不到該學號的資料");
            }
        })
        .catch((error) => {
            console.error("Error reading data: ", error);
            alert("伺服器發生錯誤，請稍後再試\n錯誤訊息: " + error.message);
        });
}

function add2Table(index, sid, studentData) {
    const tableBody = document.getElementById("studentTableBody");
    const row = tableBody.insertRow();

    const cellData = [index, sid, studentData.NAME, studentData.PLAN];

    cellData.forEach((data) => {
        const cell = row.insertCell();
        cell.textContent = data;
    });
}
