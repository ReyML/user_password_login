const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID",
}

// Ensure Firebase is initialized before setting persistence
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

firebase
  .auth()
  .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
  .then(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log("User is still signed in", user)
        window.location.href = "/dashboard.html" // Redirect to dashboard if user is signed in
      } else {
        console.log("No user signed in")
      }
    })
  })
  .catch((error) => {
    console.error("Error setting persistence:", error)
  })

function openLoginModal() {
  document.getElementById("loginModal").classList.remove("hidden")
}

function closeLoginModal() {
  document.getElementById("loginModal").classList.add("hidden")
}

function openPasswordResetModal() {
  document.getElementById("passwordResetModal").classList.remove("hidden")
}

function closePasswordResetModal() {
  document.getElementById("passwordResetModal").classList.add("hidden")
}

let isLoginMode = true

function toggleAuthMode() {
  isLoginMode = !isLoginMode
  const authModalTitle = document.getElementById("authModalTitle")
  const authButton = document.getElementById("authButton")
  if (isLoginMode) {
    authModalTitle.textContent = "Login"
    authButton.textContent = "Login"
    authButton.onclick = login // Assuming you have a separate login function
  } else {
    authModalTitle.textContent = "Register"
    authButton.textContent = "Register"
    authButton.onclick = registerOrLogin // Use the existing function for registration
  }
}

function sendPasswordResetEmail() {
  const email = document.getElementById("resetEmail").value // Assume you have an input field for the email
  firebase
    .auth()
    .sendPasswordResetEmail(email)
    .then(() => {
      console.log("Password reset email sent.")
      alert("Password reset email sent successfully. Please check your email.")
    })
    .catch((error) => {
      console.error("Error sending password reset email:", error)
      alert("Failed to send password reset email. " + error.message)
    })
}

function registerOrLogin() {
  const email = document.getElementById("email").value
  const password = document.getElementById("password").value
  const isRegistering = !isLoginMode // Determine if the current mode is for registration

  if (isRegistering) {
    // Handle registration using Firebase
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Registration successful
        console.log("Registration successful:", userCredential.user)
        // Add user to Firestore with all required fields
        return firebase
          .firestore()
          .collection("users")
          .doc(userCredential.user.uid)
          .set({
            email: email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(), // Use server timestamp for consistency
            hasPaid: false, // Default value for new users
            paymentId: "", // Default empty string
          })
      })
      .then(() => {
        alert("Registration successful and user added to database!")
        toggleAuthMode() // Switch to login mode if not already
      })
      .catch((error) => {
        console.error("Error during registration or database operation:", error)
        alert("Registration failed: " + error.message)
      })
  } else {
    // Handle login using Firebase
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Login successful
        console.log("Login successful:", userCredential.user)
        window.location.href = "/dashboard.html" // Redirect to dashboard
      })
      .catch((error) => {
        console.error("Error logging in:", error)
        let errorMessageElement = document.getElementById("loginErrorMessage")
        if (error.code === "auth/wrong-password") {
          errorMessageElement.textContent =
            "Incorrect password. Please try again."
        } else if (error.code === "auth/user-not-found") {
          errorMessageElement.textContent =
            "No user found with this email. Please register."
        } else {
          errorMessageElement.textContent = "Login failed. Please try again."
        }
        errorMessageElement.style.display = "block" // Make the error message visible
      })
  }
}

function validateEmail(email) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

function validateForm() {
  const email = document.getElementById("email").value
  if (!validateEmail(email)) {
    alert("Email is not valid")
    return false
  }
  // Add other validations as needed
  return true
}

function login() {
  const email = document.getElementById("email").value
  const password = document.getElementById("password").value

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Login successful, redirect to dashboard
      window.location.href = "/dashboard.html"
    })
    .catch((error) => {
      console.error("Error logging in:", error)
      let errorMessageElement = document.getElementById("loginErrorMessage")
      // Check for different error codes and set the message accordingly
      if (
        error.code === "auth/wrong-password" ||
        error.message.includes("INVALID_LOGIN_CREDENTIALS")
      ) {
        errorMessageElement.textContent =
          "Incorrect password. Please try again."
      } else if (error.code === "auth/user-not-found") {
        errorMessageElement.textContent =
          "No user found with this email. Please register."
      } else if (error.code === "auth/internal-error") {
        errorMessageElement.textContent =
          "Login failed due to an internal error. Please try again."
      } else {
        errorMessageElement.textContent = "Login failed. Please try again."
      }
      errorMessageElement.style.display = "block" // Make the error message visible
    })
}
