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

// Fetch restaurants and display in the dropdown with ratings and food type
async function loadRestaurants() {
    const restaurantSelect = document.getElementById("restaurant");

    try {
        // Fetch restaurants from Firestore
        const querySnapshot = await db.collection("restaurants").get();
        
        querySnapshot.forEach((doc) => {
            const restaurant = doc.data();
            const option = document.createElement("option");

            // Add restaurant name, rating, and food type to the dropdown
            option.value = doc.id; // Use restaurant's document ID as the value
            option.text = `${restaurant.name} - ${restaurant.foodType} (Rating: ${restaurant.rating})`;

            restaurantSelect.add(option);
        });
    } catch (error) {
        console.error("Error fetching restaurants: ", error);
    }
}

// Handle Order
document.getElementById("orderForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const restaurantId = document.getElementById("restaurant").value;
    const quantity = document.getElementById("quantity").value;

    if (!auth.currentUser) {
        document.getElementById("orderMessage").innerText = "You must be logged in to place an order.";
        return;
    }

    const orderData = {
        restaurantId: restaurantId,
        quantity: parseInt(quantity),
        userId: auth.currentUser.uid,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    };

    try {
        // Save order to Firestore in the "orders" collection
        await db.collection("orders").add(orderData);
        document.getElementById("orderMessage").innerText = "Order placed successfully!";
    } catch (error) {
        document.getElementById("orderMessage").innerText = `Error placing order: ${error.message}`;
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

// Load restaurants on page load for order and feedback
window.onload = loadRestaurants;
