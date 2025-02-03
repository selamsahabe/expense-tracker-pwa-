function requestNotificationPermission() {
  if ("Notification" in window) {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        console.log("Notifications allowed!");
      } else {
        console.log("Notifications denied!");
      }
    });
  } else {
    console.log("Browser does not support notifications.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Menu Toggle Functionality
  const toggleButton = document.getElementById("toggleButton");
  const buttonContainer = document.getElementById("button-container");
  let flag = true; // Tracks the state of the menu (open/closed)

  // Initially hide the menu
  buttonContainer.style.right = "-100px";

  // Add click event listener to toggle the menu
  toggleButton.addEventListener("click", () => {
    if (flag) {
      toggleButton.innerHTML = "✕"; // Change to cross icon
      buttonContainer.style.right = "20px"; // Open the menu
    } else {
      toggleButton.innerHTML = "☰"; // Change back to hamburger icon
      buttonContainer.style.right = "-100px"; // Hide the menu
    }
    flag = !flag; // Toggle the flag
  });

  // Section Switching Functionality
  const buttons = document.querySelectorAll(".button"); // All buttons in the menu
  const featureSections = document.querySelectorAll(".feature-section"); // All feature sections

  // Function to show a specific section and hide others
  function showSection(targetId) {
    featureSections.forEach((section) => {
      section.style.display = "none"; // Hide all sections
    });

    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.style.display = "block"; // Show the target section
    }
  }

  // Add click event listeners to buttons
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault(); // Prevent default anchor behavior
      const targetId = button.getAttribute("data-target"); // Get the target section ID
      if (targetId) {
        showSection(targetId); // Show the corresponding section
      }
    });
  });

  // Handle "Go to Signup" Button
  const showSignupButton = document.getElementById("show-signup");
  if (showSignupButton) {
    showSignupButton.addEventListener("click", () => {
      showSection("signup"); // Show the signup section
    });
  }

  // Handle "Go to Login" Button
  const showLoginButton = document.getElementById("show-login");
  if (showLoginButton) {
    showLoginButton.addEventListener("click", () => {
      showSection("login"); // Show the login section
    });
  }

  // Show the login section by default
  showSection("login");
});

// Local Storage Management
function manageLocalStorage(key, defaultValue = {}) {
  if (!localStorage.getItem(key)) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
  }
  return JSON.parse(localStorage.getItem(key));
}

// Initialize or retrieve 'users' data
const users = manageLocalStorage("users", {});

// Function to register a new user
function registerUser(username, password) {
  if (users[username]) {
    alert("Username already exists. Please choose a different username.");
    return false;
  }

  // Save the new user with default details
  users[username] = {
    password: password,
    salary: 0, // Default salary is set to 0
    expenses: [], // Empty array for expenses
  };

  // Save updated users back to localStorage
  localStorage.setItem("users", JSON.stringify(users));
  alert("User registered successfully!");
  return true;
}

// Function to log in a user
function loginUser(username, password) {
  if (!users[username]) {
    alert("Username does not exist. Please register first.");
    return false;
  }

  if (users[username].password !== password) {
    alert("Incorrect password. Please try again.");
    return false;
  }

  location.reload(); // Reload the page to reset the state

  // Save the logged-in user's username in localStorage
  localStorage.setItem("loggedInUser", username);
  document.getElementById("display-username").value = currentUser;
  document.getElementById("editable-salary").value = users[currentUser].salary;

  // Activate the information section and load user data
  showSection("information-section");
  return true;
}

// Handle Page Load
document.addEventListener("DOMContentLoaded", () => {
  const currentUser = localStorage.getItem("loggedInUser");

  if (currentUser && users[currentUser]) {
    // If a user is logged in, show the information section
    showSection("information-section");

    document.getElementById("display-username").value = currentUser;
    document.getElementById("editable-salary").value =
      users[currentUser].salary;
  } else {
    // If no user is logged in, show the login section
    showSection("login");
  }
});

// Function to switch sections
function showSection(targetId) {
  const featureSections = document.querySelectorAll(".feature-section");
  featureSections.forEach((section) => {
    section.style.display = "none"; // Hide all sections
  });

  const targetSection = document.getElementById(targetId);
  if (targetSection) {
    targetSection.style.display = "block"; // Show the target section
  }
}

// Function to update the displayed user details
function updateUserDetailsDisplay(user) {
  // Display the username
  document.getElementById("display-username").textContent =
    user.username || "Not Provided";

  // Pre-fill the monthly salary input field
  const editableSalaryInput = document.getElementById("editable-salary");
  editableSalaryInput.value = user.salary || "";
}

// Handle Login Form Submission
document.getElementById("login").addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent default form submission

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("Please enter both username and password.");
    return;
  }

  // Attempt to log in the user
  loginUser(username, password);
});

// Handle Signup Form Submission
document.getElementById("signup").addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent default form submission

  const username = document.getElementById("new-username").value.trim();
  const password = document.getElementById("new-password").value.trim();

  if (!username || !password) {
    alert("Please fill in all fields.");
    return;
  }

  // Register the new user
  if (registerUser(username, password)) {
    document.getElementById("signup").classList.add("hidden");
    document.getElementById("login").classList.remove("hidden");
  }
});

// Function to log out a user
function logoutUser() {
  // Remove the logged-in user from localStorage
  localStorage.removeItem("loggedInUser");

  alert("You have been logged out.");

  // Reset the displayed user details
  document.getElementById("display-username").textContent = "Not Provided";
  document.getElementById("editable-salary").value = "";

  // Clear any dynamically loaded data (e.g., expenses table)
  const expensesList = document.getElementById("expenses-list");
  if (expensesList) {
    expensesList.innerHTML = ""; // Clear the expenses table
  }
  // Reload the page to ensure a clean state
  window.location.reload();
  // Show the login section and hide all other sections
  showSection("login");
}

// Handle Logout Button Click
document.getElementById("logout-button").addEventListener("click", () => {
  logoutUser(); // Call the logout function
});

// Function to update the user's salary
function updateSalary() {
  // Get the currently logged-in username
  const loggedInUsername = localStorage.getItem("loggedInUser");
  if (!loggedInUsername) {
    alert("No user is logged in.");
    return;
  }

  // Get the new salary value from the input field
  const newSalaryInput = document
    .getElementById("editable-salary")
    .value.trim();
  const newSalary = parseFloat(newSalaryInput);

  // Validate the input
  if (isNaN(newSalary) || newSalary < 0) {
    alert("Please enter a valid salary.");
    return;
  }

  // Retrieve the users object from localStorage
  let users = JSON.parse(localStorage.getItem("users")) || {};

  // Check if the logged-in user exists in the users object
  if (!users[loggedInUsername]) {
    alert("User data not found.");
    return;
  }

  // Update the salary for the logged-in user
  users[loggedInUsername].salary = newSalary;

  // Save the updated users object back to localStorage
  localStorage.setItem("users", JSON.stringify(users));

  // Optionally, refresh any UI elements that display the salary
  document.getElementById("total-salary").textContent = `$${newSalary.toFixed(
    2
  )}`;

  // Notify the user
  alert(`Salary updated successfully! New Salary: $${newSalary.toFixed(2)}`);
}

// Attach event listener to the Update Salary button
document
  .getElementById("update-salary")
  .addEventListener("click", updateSalary);

// Load salary on page load
document.addEventListener("DOMContentLoaded", () => {
  const loggedInUsername = localStorage.getItem("loggedInUser");
  if (loggedInUsername) {
    // Retrieve the saved salary from localStorage
    const savedSalary = localStorage.getItem(users[currentUser].salary);
    console.log("Saved Salary:", savedSalary);
    // Populate the salary input field
    document.getElementById("editable-salary").value = savedSalary;
  }
});

// CAMERA Uploads
// DOM Elements
const takePhotoBtn = document.getElementById("take-photo-btn");
const uploadImageBtn = document.getElementById("upload-image-btn");
const galleryInput = document.getElementById("gallery-input");
const progressBar = document.getElementById("progress-bar");
const totalAmountField = document.getElementById("total-amount");
const addRecordBtn = document.getElementById("add-record-btn");

// Track if the file input has already been triggered
let isFileInputTriggered = false;

// Trigger gallery input when "Upload Image" button is clicked
uploadImageBtn.addEventListener("click", () => {
  if (!isFileInputTriggered) {
    isFileInputTriggered = true;
    galleryInput.click(); // Open the file picker
  }
});

// Handle file selection (gallery input)
galleryInput.addEventListener("change", handleFileSelection);

// Handle "Take Photo" button click
takePhotoBtn.addEventListener("click", async () => {
  try {
    // Check for camera access
    const stream = await checkCameraAccess();
    if (!stream) {
      alert("Camera access denied. Please grant permission to use the camera.");
      return;
    }

    // Create video element for live camera feed
    const video = document.createElement("video");
    video.srcObject = stream;
    video.play();

    // Create canvas for capturing the image
    const canvas = document.createElement("canvas");
    const captureTimeout = 3000; // Wait 3 seconds before capturing

    // Show a countdown message
    alert(
      `Camera will capture the image in ${
        captureTimeout / 1000
      } seconds. Frame your shot!`
    );

    // Capture the image after the timeout
    setTimeout(() => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0);

      // Convert the captured image to a data URL
      const imageSrc = canvas.toDataURL("image/png");

      // Stop the camera stream
      stream.getTracks().forEach((track) => track.stop());

      // Process the captured image
      handleCapturedImage(imageSrc);
    }, captureTimeout);
  } catch (error) {
    console.error("Camera error:", error);
    alert("Failed to access the camera. Please try again.");
  }
});

// Function to check camera access
async function checkCameraAccess() {
  try {
    // Check if the browser supports media devices
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Your browser does not support camera access.");
      return null;
    }

    // Request camera access
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    return stream;
  } catch (error) {
    console.error("Camera access error:", error);
    return null;
  }
}

// Handle captured image
function handleCapturedImage(imageSrc) {
  // Simulate file selection with the captured image
  const file = dataURLtoFile(imageSrc, "captured-image.png");
  handleFileSelection({ target: { files: [file] } });
}

// Convert Data URL to File
function dataURLtoFile(dataURL, filename) {
  const arr = dataURL.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

// Handle file selection (common logic for both camera and gallery)
async function handleFileSelection(event) {
  const file = event.target.files[0];
  if (!file) {
    console.error("No file selected.");
    isFileInputTriggered = false; // Reset the flag
    return;
  }

  try {
    // Reset progress bar and disable buttons during processing
    progressBar.style.width = "0%";
    progressBar.textContent = "0%";
    takePhotoBtn.disabled = true;
    uploadImageBtn.disabled = true;
    takePhotoBtn.textContent = "Processing...";

    // Perform OCR on the captured/uploaded image
    await Tesseract.recognize(
      file,
      "eng", // Language
      {
        logger: (info) => {
          // Update progress bar dynamically
          if (info.status === "recognizing text" && info.progress) {
            const progress = Math.round(info.progress * 100);
            progressBar.style.width = `${progress}%`;
            progressBar.textContent = `${progress}%`;
          }
        },
      }
    ).then(({ data: { text } }) => {
      console.log("Extracted Text:", text);

      // Extract total amount using keywords
      const totalAmount = extractTotalAmount(text);

      // Populate the total amount field (editable)
      if (totalAmount) {
        totalAmountField.value = totalAmount; // Pre-fill the field
      } else {
        alert("Could not extract the total amount. Please enter it manually.");
      }
    });

    // Re-enable buttons after processing
    takePhotoBtn.disabled = false;
    uploadImageBtn.disabled = false;
    takePhotoBtn.textContent = "Take Photo";
  } catch (error) {
    console.error("Error processing image:", error);
    alert("Failed to process the image. Please try again.");
    takePhotoBtn.disabled = false;
    uploadImageBtn.disabled = false;
    takePhotoBtn.textContent = "Take Photo";
  } finally {
    // Reset the file input trigger flag
    isFileInputTriggered = false;
  }
}

/**
 * Function to extract total amount using keywords
 * @param {string} text - Extracted text from OCR
 * @returns {string|null} - Extracted total amount or null if not found
 */
function extractTotalAmount(text) {
  // Define keywords to search for
  const keywords = ["grand total", "total amount", "total", "amount due"];

  // Convert text to lowercase for case-insensitive matching
  const lowerText = text.toLowerCase();

  // Loop through keywords and find matches
  for (const keyword of keywords) {
    const regex = new RegExp(
      `${keyword}\\s*[\\$:]*\\s*(\\d+(\\.\\d{2})?)`,
      "i"
    );
    const match = lowerText.match(regex);
    if (match) {
      return match[1]; // Return the numeric value
    }
  }

  return null; // Return null if no match is found
}

// Handle "Add Record" button click
// Handle "Add Record" button click
addRecordBtn.addEventListener("click", () => {
  const totalAmount = totalAmountField.value.trim();

  // Get current date and time
  const now = new Date();
  const currentDate = now.toLocaleDateString(); // Format: MM/DD/YYYY
  const currentTime = now.toLocaleTimeString(); // Format: HH:MM:SS AM/PM

  // Get the currently logged-in user from localStorage
  const currentUser = localStorage.getItem("loggedInUser");

  if (!currentUser) {
    alert("No user is currently logged in.");
    return;
  }

  // Parse the users object from localStorage
  let users = JSON.parse(localStorage.getItem("users")) || {};

  // Check if the user exists in the users object
  if (!users[currentUser]) {
    alert("User data not found.");
    return;
  }

  // Create the new expense record
  const newExpense = {
    amount: parseFloat(totalAmount), // Convert to number
    date: currentDate,
    time: currentTime,
  };

  // Add the new expense to the user's expenses array
  users[currentUser].expenses.push(newExpense);

  // Save the updated users object back to localStorage
  localStorage.setItem("users", JSON.stringify(users));

  // Clear the total amount field
  totalAmountField.value = "";

  populateExpensesTable(); // Update the expenses table
});
// Function to populate the expenses table
function populateExpensesTable() {
  const currentUser = localStorage.getItem("loggedInUser");
  if (!currentUser) {
    console.error("No user is currently logged in.");
    return;
  }

  // Parse the users object from localStorage
  let users = JSON.parse(localStorage.getItem("users")) || {};
  const user = users[currentUser];

  if (!user || !Array.isArray(user.expenses)) {
    console.error("User data not found or expenses array is invalid.");
    // Display a fallback message in the table
    const tableBody = document.querySelector("#expenses-table tbody");
    tableBody.innerHTML =
      '<tr><td colspan="4" class="text-center">No expenses found.</td></tr>';
    return;
  }

  // Get the table body element
  const tableBody = document.querySelector("#expenses-table tbody");
  tableBody.innerHTML = ""; // Clear previous rows

  // Check if the expenses array is empty
  if (user.expenses.length === 0) {
    tableBody.innerHTML =
      '<tr><td colspan="4" class="text-center">No expenses found.</td></tr>';
    return;
  }

  // Loop through the expenses and add rows to the table
  user.expenses.forEach((expense, index) => {
    const row = document.createElement("tr");

    // Add index (1-based)
    const indexCell = document.createElement("td");
    indexCell.textContent = index + 1;
    row.appendChild(indexCell);

    // Add amount
    const amountCell = document.createElement("td");
    // Validate the expense amount
    if (typeof expense.amount !== "number" || isNaN(expense.amount)) {
      amountCell.textContent = "0.00"; // Default value for invalid amounts
    } else {
      amountCell.textContent = expense.amount.toFixed(2); // Format to 2 decimal places
    }

    row.appendChild(amountCell);

    // Add date
    const dateCell = document.createElement("td");
    dateCell.textContent = expense.date || "Unknown Date"; // Handle missing dates
    row.appendChild(dateCell);

    // Add time
    const timeCell = document.createElement("td");
    timeCell.textContent = expense.time || "Unknown Time"; // Handle missing times
    row.appendChild(timeCell);

    // Append the row to the table body
    tableBody.appendChild(row);
  });
}

// Call the function when the page loads
document.addEventListener("DOMContentLoaded", () => {
  populateExpensesTable();
});

// Function to analyze expenses and update the UI
function analyzeExpenses() {
  const currentUser = localStorage.getItem("loggedInUser");
  if (!currentUser) {
    console.error("No user is currently logged in.");
    return;
  }

  // Parse the users object from localStorage
  let users = JSON.parse(localStorage.getItem("users")) || {};
  const user = users[currentUser];

  if (!user || !Array.isArray(user.expenses)) {
    console.error("User data not found or expenses array is invalid.");
    return;
  }

  // Calculate total salary
  const totalSalary = users[currentUser].salary;
  // Calculate total expenses
  const totalExpenses = user.expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  // Calculate profit/loss amount
  const profitLossAmount = totalSalary - totalExpenses;

  // Update the summary cards
  document.getElementById("total-salary").textContent = `$${totalSalary.toFixed(
    2
  )}`;
  document.getElementById(
    "total-expenses"
  ).textContent = `$${totalExpenses.toFixed(2)}`;
  document.getElementById(
    "profit-loss-amount"
  ).textContent = `$${profitLossAmount.toFixed(2)}`;

  // Generate the chart
  generateExpensesChart(user.expenses);
}

// Function to generate the expenses chart
function generateExpensesChart(expenses) {
  const ctx = document.getElementById("expenses-chart").getContext("2d");

  // Extract labels (dates) and data (amounts) from expenses
  const labels = expenses.map((expense) => expense.date);
  const data = expenses.map((expense) => expense.amount);

  // Destroy existing chart instance if it exists
  if (window.expensesChart) {
    window.expensesChart.destroy();
  }

  // Create a new chart
  window.expensesChart = new Chart(ctx, {
    type: "bar", // Bar chart
    data: {
      labels: labels,
      datasets: [
        {
          label: "Expense Amount ($)",
          data: data,
          backgroundColor: "rgba(75, 192, 192, 0.6)", // Light teal color
          borderColor: "rgba(75, 192, 192, 1)", // Teal border
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
        tooltip: {
          enabled: true,
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Date",
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Amount ($)",
          },
        },
      },
    },
  });
}

// Call the analyzeExpenses function when the page loads
document.addEventListener("DOMContentLoaded", () => {
  analyzeExpenses();
});

// Update analysis after adding a new record
addRecordBtn.addEventListener("click", () => {
  // Existing code for adding a record...

  // Refresh the analysis section
  analyzeExpenses();
});
