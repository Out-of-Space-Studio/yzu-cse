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
        body.style.backgroundColor = "#F5F5F5";
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

window.todo = async function () {
    check_form();
    // closeIframe();
};

// datas to set
window.check_form = async function () {
    const form = document.getElementById("FORM");

    const fields = {
        SID: "學號",
        NAME: "姓名",
        GENDER: "性別",
        DIET: "飲食習慣",
        ALLERGY: "過敏食物",
        IDNumber: "身分證字號",
        BIRTH: "生日",
        phoneNumber: "電話",
        // CLOTHINGSIZE: "衣服尺寸",
        ICEName: "緊急聯絡人姓名",
        ICERelationship: "與緊急聯絡人關係",
        ICEPhoneNumber: "緊急聯絡人電話",
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

    if (!verifyId(form.IDNumber.value)) {
        alert(`身份證字號錯誤!`);
        setTimeout(() => {
            IDNumber.style.borderColor = "red";
            IDNumber.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
            IDNumber.focus();
        }, 0);
        return;
    } else {
        IDNumber.style.borderColor = "";
    }

    const student = new Stu({
        sid: form.SID.value,
        name: form.NAME.value,
        gender: form.GENDER.value,
        diet: form.DIET.value,
        allergy: form.ALLERGY.value,
        idnumber: form.IDNumber.value,
        birth: form.BIRTH.value,
        phoneNumber: form.phoneNumber.value,
        // clothingSize: form.CLOTHINGSIZE.value,
        emgName: form.ICEName.value,
        emgRelation: form.ICERelationship.value,
        emgPhoneNumber: form.ICEPhoneNumber.value,
    });
    await student.confirmInfo();
};

// db stuff
class Stu {
    constructor(studentData) {
        this.sid = studentData.sid;
        this.name = studentData.name;
        this.gender = studentData.gender;
        this.diet = studentData.diet;
        this.allergy = studentData.allergy;
        this.idnumber = studentData.idnumber;
        this.birth = studentData.birth;
        this.phoneNumber = studentData.phoneNumber;
        // this.clothingSize = studentData.clothingSize;
        this.emgName = studentData.emgName;
        this.emgRelation = studentData.emgRelation;
        this.emgPhoneNumber = studentData.emgPhoneNumber;
    }

    async confirmInfo() {
        const isConfirm = window.confirm(
            "請確認以下資訊是否正確\n 學號：" +
                this.sid +
                "\n 姓名：" +
                this.name +
                "\n 性別：" +
                GENDER2TXT[this.gender] +
                "\n 葷素：" +
                DIET2TXT[this.diet] +
                "\n 身分證字號：" +
                this.idnumber +
                "\n 生日：" +
                this.birth +
                "\n 聯絡電話：" +
                this.phoneNumber +
                // "\n 衣服尺寸：" +
                // this.clothingSize +
                "\n 緊急聯絡人姓名：" +
                this.emgName +
                "\n 與學員之關係：" +
                RELATION2TXT[this.emgRelation] +
                "\n 緊急聯絡人電話：" +
                this.emgPhoneNumber
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
    apiKey: "AIzaSyCPh9Hg4qFMyrP_7nchVGTvM-qQKSUa6JE",
    authDomain: "ic-im-in-cse-2024-48f2b.firebaseapp.com",
    databaseURL:
        "https://ic-im-in-cse-2024-48f2b-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "ic-im-in-cse-2024-48f2b",
    storageBucket: "ic-im-in-cse-2024-48f2b.appspot.com",
    messagingSenderId: "259899984268",
    appId: "1:259899984268:web:888b208395c19ffdd3aea9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(
        "6LcUXgcqAAAAANUEME6erIMev4sWICtHskv78kWA"
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
        GENDER: stu.gender,
        DIET: stu.diet,
        ALLERGY: stu.allergy,
        IDNUMBER: stu.idnumber,
        BIRTH: stu.birth,
        PHONE: stu.phoneNumber,
        // SIZE: stu.clothingSize,
        EMGNAME: stu.emgName,
        EMGPHONE: stu.emgPhoneNumber,
        EMGRELATIONS: stu.emgRelation,
        TIMESTAMP: dt,
    })
        .then(function () {
            console.log("Data written successfully");
            alert("報名成功");
            closeIframe();
            window.location.href = "../index.html";
        })
        .catch(function (error) {
            console.error("Error writing data: ", error);
            alert("伺服器發生錯誤，請稍後再試\n錯誤訊息: " + error.message);
        });
}

// ID Verfication
function verifyId(id) {
    id = id.trim();
    const verification = id.match("^[A-Z][12]\\d{8}$");
    if (!verification) {
        return false;
    }

    let conver = "ABCDEFGHJKLMNPQRSTUVXYWZIO";
    let weights = [1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1];

    id = String(conver.indexOf(id[0]) + 10) + id.slice(1);

    let checkSum = 0;
    for (let i = 0; i < id.length; i++) {
        const c = parseInt(id[i]);
        const w = weights[i];
        checkSum += c * w;
    }

    return checkSum % 10 == 0;
}

// close iframe
function closeIframe() {
    const tag = top.document.getElementById("sign-up");
    if (tag) {
        tag.style.display = "none";
        console.log("iframe closed");
    }
}
