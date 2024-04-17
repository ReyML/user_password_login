const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID",
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

// Set the authentication state persistence
firebase
  .auth()
  .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
  .catch((error) => {
    console.error("Error setting persistence:", error)
  })

firebase.auth().onAuthStateChanged((user) => {
  if (!user) {
    window.location.href = "/"
  }
})

document.getElementById("logoutButton").addEventListener("click", function () {
  firebase
    .auth()
    .signOut()
    .then(() => {
      console.log("User signed out.")
      window.location.href = "/" // Redirect to login page after logout
    })
    .catch((error) => {
      console.error("Error signing out:", error)
    })
})

function updatePassword() {
  const user = firebase.auth().currentUser

  if (user) {
    const currentPassword = document.getElementById("currentPassword").value
    const newPassword = document.getElementById("newPassword").value
    const credential = firebase.auth.EmailAuthProvider.credential(
      user.email,
      currentPassword
    )

    user
      .reauthenticateWithCredential(credential)
      .then(() => {
        user
          .updatePassword(newPassword)
          .then(() => {
            document.getElementById("updatePasswordMessage").textContent =
              "Password updated successfully."
            document.getElementById("updatePasswordMessage").style.display =
              "block"
          })
          .catch((error) => {
            document.getElementById("updatePasswordMessage").textContent =
              "Error updating password: " + error.message
            document.getElementById("updatePasswordMessage").style.display =
              "block"
          })
      })
      .catch((error) => {
        document.getElementById("updatePasswordMessage").textContent =
          "Current password is incorrect."
        document.getElementById("updatePasswordMessage").style.display = "block"
      })
  } else {
    document.getElementById("updatePasswordMessage").textContent =
      "No authenticated user found. Please log in."
    document.getElementById("updatePasswordMessage").style.display = "block"
  }
}

function openUpdatePasswordModal() {
  document.getElementById("updatePasswordModal").classList.remove("hidden")
}

function closeUpdatePasswordModal() {
  document.getElementById("updatePasswordModal").classList.add("hidden")
}

function deleteUserAccount() {
  if (
    confirm(
      "Do you really want to delete your account? This action cannot be undone."
    )
  ) {
    const user = firebase.auth().currentUser

    user
      .delete()
      .then(() => {
        alert("Your account has been successfully deleted.")
        window.location.href = "/"
      })
      .catch((error) => {
        console.error("Error deleting user account:", error)
        alert("Failed to delete account. Please try again.")
      })
  }
}
