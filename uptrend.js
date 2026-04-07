// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDZd2hlnP7U75O0JcbmENhcKKEaFXgCDgI",
    authDomain: "uptrend-535c8.firebaseapp.com",
    projectId: "uptrend-535c8",
    storageBucket: "uptrend-535c8.firebasestorage.app",
    messagingSenderId: "83016153974",
    appId: "1:83016153974:web:ff4dacfa65ed4ca616d857",
    measurementId: "G-JZ5BLWDEC1"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.firestore();

function showPopup(message) {
    let popup = document.createElement('div');
    popup.className = 'uptrend-popup';
    popup.textContent = message;
    document.body.appendChild(popup);
    setTimeout(() => {
        popup.remove();
    }, 2000);
}

// -----  SIGNUP FUNCTION --- 
function signupUser() {
    const name = document.getElementById("signup_name").value;
    const email = document.getElementById("signup_email").value;
    const password = document.getElementById("signup_password").value;
    const phone = document.getElementById("signup_phone").value;

    auth.createUserWithEmailAndPassword(email, password)
        .then(userCred => {
            const user = userCred.user;
            const uid = user.uid;

            // Save phone number for future use
            database.collection("users").doc(uid).set({
                name: name,
                email: email,
                phone: phone,

            });

            // SEND EMAIL VERIFICATION
            user.sendEmailVerification()
                .then(() => {
                    alert("Account created! A verification email has been sent. Please verify before login.");
                    display("section_login_page");
                })
                .catch(err => alert("Verification email error: " + err.message));
        })
        .catch(err => alert(err.message));
}


// ----- LOGIN FUNCTION --- 
function loginUser() {
    const email = document.getElementById("login_email").value;
    const password = document.getElementById("login_password").value;

    auth.signInWithEmailAndPassword(email, password)
        .then(userCred => {
            const user = userCred.user;

            // BLOCK LOGIN IF EMAIL NOT VERIFIED
            if (!user.emailVerified) {
                alert("Please verify your email first! Check your inbox/spam.");
                auth.signOut();
                return;
            }

            showPopup("Login Successful!");
            display("section_dashboard_page");
        })
        .catch(err => alert(err.message));
}

function logoutUser() {
    auth.signOut()
        .then(() => {
            showPopup("Logged out successfully!");
            display("section_home_page");
        })
        .catch(err => alert(err.message));
}

// ----- FORGOT PASSWORD FUNCTION ---
function forgotPassword() {
    const email = document.getElementById("login_email").value;

    if (!email) return alert("Enter your email first!");

    auth.sendPasswordResetEmail(email)
        .then(() => alert("Password reset email sent!"))
        .catch(err => alert(err.message));
}