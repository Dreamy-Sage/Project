// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCCuIUCd0ezZboY27tHMkNYBU4EScNqfYg",
    authDomain: "project-67da3.firebaseapp.com",
    projectId: "project-67da3",
    storageBucket: "project-67da3.appspot.com",
    messagingSenderId: "941154404500",
    appId: "1:941154404500:web:9c6b44ac631bcb339e4c81",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Handle Login
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        await auth.signInWithEmailAndPassword(email, password);
        document.getElementById("message").innerText = "Login successful!";
        window.location.href = "order.html"; // Redirect to order page
    } catch (error) {
        document.getElementById("message").innerText = error.message;
    }
});

// Handle Order
document.getElementById("orderForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const restaurant = document.getElementById("restaurant").value;
    const foodItem = document.getElementById("foodItem").value;
    const quantity = document.getElementById("quantity").value;

    const orderData = {
        restaurant,
        foodItem,
        quantity,
        userId: auth.currentUser.uid,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    };

    try {
        await db.collection("orders").add(orderData);
        document.getElementById("orderMessage").innerText = "Order placed successfully!";
    } catch (error) {
        document.getElementById("orderMessage").innerText = error.message;
    }
});

// Handle Feedback
document.getElementById("feedbackForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const restaurant = document.getElementById("restaurantFeedback").value;
    const rating = document.getElementById("rating").value;
    const comments = document.getElementById("comments").value;

    const feedbackData = {
        restaurant,
        rating: parseFloat(rating),
        comments,
        userId: auth.currentUser.uid,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    };

    try {
        await db.collection("feedback").add(feedbackData);
        document.getElementById("feedbackMessage").innerText = "Feedback submitted successfully!";
    } catch (error) {
        document.getElementById("feedbackMessage").innerText = error.message;
    }
});

// Fetch and display restaurants based on ratings for ordering and feedback
async function loadRestaurants() {
    const restaurantSelect = document.getElementById("restaurant");
    const restaurantFeedbackSelect = document.getElementById("restaurantFeedback");
    const querySnapshot = await db.collection("feedback").where("rating", ">=", 2.5).get();

    querySnapshot.forEach((doc) => {
        const restaurantName = doc.data().restaurant;
        if (!Array.from(restaurantSelect.options).some(option => option.text === restaurantName)) {
            const option = document.createElement("option");
            option.text = restaurantName;
            restaurantSelect.add(option);
            restaurantFeedbackSelect.add(option.cloneNode(true)); // Clone to add to feedback select
        }
    });
}

// Load restaurants on page load
window.onload = loadRestaurants;
