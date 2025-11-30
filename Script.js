// Small welcome just to show that JS is working
alert("welcome to forme!");

// ========== Theme Switcher ==========
// Get the button
let themeBtn = document.getElementById("themeBtn");

// Check if a theme was saved before
let savedTheme = localStorage.getItem("theme");

// If a saved theme exists, apply it
if (savedTheme) {
  document.body.className = savedTheme;
}

// Only show theme button on home page
if (themeBtn) {
  // Check if we are on home page
  const isHomePage = window.location.href.indexOf("home.html") !== -1;
  
  if (!isHomePage) {
    // Hide the button on other pages
    themeBtn.style.display = "none";
  } else {
    // When the user clicks the button (only on home page)
    themeBtn.addEventListener("click", function() {
      // Toggle between light and dark
      if (document.body.classList.contains("dark")) {
        document.body.classList.remove("dark");
        document.body.classList.add("light");
        localStorage.setItem("theme", "light"); // save it
      } else {
        document.body.classList.remove("light");
        document.body.classList.add("dark");
        localStorage.setItem("theme", "dark"); // save it
      }
    });
  }
}

// ---------------- Scroll to top button ----------------
const btn = document.getElementById("scrollTopBtn");

if (btn) {
  window.addEventListener("scroll", function () {
    if (
      document.body.scrollTop > 200 ||
      document.documentElement.scrollTop > 200
    ) {
      btn.style.display = "block";
    } else {
      btn.style.display = "none";
    }
  });

  btn.onclick = function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
}

// ---------------- Digital clock in footer ----------------
function updateClock() {
  const clockEl = document.getElementById("clock");
  if (!clockEl) return; // no clock on this page

  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const timeString = `${hours}:${minutes}:${seconds}`;
  clockEl.textContent = timeString;
}
setInterval(updateClock, 1000);
updateClock();

// ----------------------------------------------------------
// Request A Service page  
// ----------------------------------------------------------
const requestSection = document.getElementById("Req-Service");

if (requestSection) {
  const requestForm = requestSection.querySelector("form");
  const requestsContainer = document.getElementById("requestsContainer");
  const requestsList = document.getElementById("requestsList");

  requestForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const serviceSelect = document.getElementById("service");
    const nameInput = document.getElementById("name");
    const dueDateInput = document.getElementById("dueDate");
    const descInput = document.getElementById("desc");

    [serviceSelect, nameInput, dueDateInput, descInput].forEach((el) => {
      if (el) el.classList.remove("input-error");
    });

    // 1) Service must be selected
    if (!serviceSelect.value) {
      serviceSelect.classList.add("input-error");
      alert("There is no service selected. Please choose a service.");
      return; // stop here, only one alert for this error
    }

    // 2) Name: full name and no numbers or ? ! @
    const nameValue = nameInput.value.trim();
    const fullNamePattern = /^[A-Za-z]+(?:\s+[A-Za-z]+)+$/; // at least two words
    const forbiddenCharsPattern = /[0-9?!@]/;

    if (!nameValue) {
      nameInput.classList.add("input-error");
      alert("Name is required. Please enter your full name.");
      return;
    }

    if (forbiddenCharsPattern.test(nameValue)) {
      nameInput.classList.add("input-error");
      alert("Name must not contain numbers or the characters ? ! @.");
      return;
    }

    if (!fullNamePattern.test(nameValue)) {
      nameInput.classList.add("input-error");
      alert("Name is not full. Please enter first and last name.");
      return;
    }

    // 3) Due date: should not be too soon
    if (!dueDateInput.value) {
      dueDateInput.classList.add("input-error");
      alert("Please choose a due date for your request.");
      return;
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const dueDate = new Date(dueDateInput.value);
      dueDate.setHours(0, 0, 0, 0);

      // here I decided that the minimum gap is 3 days
      const MIN_DAYS_AHEAD = 3;
      const diffMs = dueDate - today;
      const diffDays = diffMs / (1000 * 60 * 60 * 24);

      if (diffDays < MIN_DAYS_AHEAD) {
        dueDateInput.classList.add("input-error");
        alert(
          `Due date is very soon. Please choose a date at least ${MIN_DAYS_AHEAD} days from today.`
        );
        return;
      }
    }

    // 4) Description: at least 100 characters
    const descValue = descInput.value.trim();
    if (descValue.length < 100) {
      descInput.classList.add("input-error");
      alert(
        "Request description is very short. Please write at least 100 characters."
      );
      return;
    }



showMessageBox({
  boxId: "msgBox",
  message: "Your request has been submitted successfully!",
  showButtons: true   // Stay + Return
});

    // if they choose to stay:
    // show the container and append the new request as a list item
    if (requestsContainer && requestsList) {
      requestsContainer.style.display = "block";

      const li = document.createElement("li");
      li.style.marginBottom = "10px";
      li.style.textAlign = "left";

      // --- Convert service value → readable service name ---
let serviceName = "";

if (serviceSelect.value === "dance-30") {
  serviceName = "Dance Class – 30 minutes";
} 
else if (serviceSelect.value === "dance-60") {
  serviceName = "Dance Class – 60 minutes";
} 
else if (serviceSelect.value === "pilates-45") {
  serviceName = "Pilates Class – 45 minutes";
} 
else if (serviceSelect.value === "pilates-90") {
  serviceName = "Pilates Class – 90 minutes";
} 
else if (serviceSelect.value === "yoga-30") {
  serviceName = "Yoga Class – 30 minutes";
} 
else if (serviceSelect.value === "yoga-60") {
  serviceName = "Yoga Class – 60 minutes";
}

const serviceText = serviceName;

		 li.innerHTML =
  `<strong>Service:</strong> ${serviceText}<br>` +
  `<strong>Name:</strong> ${nameValue}<br>` +
  `<strong>Due date:</strong> ${dueDateInput.value}<br>` +
  `<strong>Description:</strong>
     <div class="desc-box">${descValue}</div>`;



      requestsList.appendChild(li);
    }

    // clear the form so the customer can add another request if they want
    requestForm.reset();
  });
}

// ----------------------------------------------------------
// Service Evaluation page (rating + simple messages)
// ----------------------------------------------------------
const evalSection = document.getElementById("Eval-Service");

if (evalSection) {
  const evalForm = evalSection.querySelector("form");

  evalForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const serviceSelect = evalForm.querySelector("#service");
    const ratingInputs = evalForm.querySelectorAll('input[name="rating"]');
    const feedbackInput = document.getElementById("feedback");
    const starsBox = evalForm.querySelector(".stars");

    // remove old highlights
    serviceSelect.classList.remove("input-error");
    starsBox.classList.remove("input-error");
    feedbackInput.classList.remove("input-error");

    // validation
    if (!serviceSelect.value) {
      serviceSelect.classList.add("input-error");
      alert("Please select the service you are evaluating.");
      return;
    }

    let ratingValue = null;
    ratingInputs.forEach((r) => {
      if (r.checked) ratingValue = r.value;
    });

    if (!ratingValue) {
      starsBox.classList.add("input-error");
      alert("Please choose a rating.");
      return;
    }

    if (!feedbackInput.value.trim()) {
      feedbackInput.classList.add("input-error");
      alert("Please write your feedback.");
      return;
    }

    // VALID
    const ratingNumber = parseInt(ratingValue);

    if (ratingNumber >= 4) {
      showMessageBox({
        boxId: "evalMsg",
        message: "Thank You! Your feedback is very valuable to us.",
        showButtons: false
      });
    } else {
      showMessageBox({
        boxId: "evalMsg",
        message: "We are Sorry! We'll use your feedback to improve.",
        showButtons: false
      });
    }

    evalForm.reset();
  });
}


// ----------------------------------------------------------
// about us
// ----------------------------------------------------------

function validateForm() {
  // Get fields
  let name = document.getElementById("name").value.trim();
  let dob = document.getElementById("dob").value;
  let photo = document.getElementById("photo").value;

  // ---------- 1. No empty fields ----------
  if (name === "" || dob === "" || photo === "") {
    alert("Please fill in all fields.");
    return false;
  }

  // ---------- 2. Name cannot start with a number ----------
  if (!isNaN(name.charAt(0))) {
    alert("Name cannot start with a number.");
    return false;
  }

  // ---------- 3. Photo must be an image ----------
  let allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
  if (!allowedExtensions.test(photo)) {
    alert("Photo must be an image file (jpg, jpeg, png, gif).");
    return false;
  }

  // ---------- 4. DOB should NOT be after 2008 ----------
  let birthYear = new Date(dob).getFullYear();
  if (birthYear > 2008) {
    alert("DOB must not be after 2008.");
    return false;
  }

  // ---------- If all is good ----------
  alert("Thank you " + name + "! Your form was submitted successfully.");
  return true;
}

// ==================================================================
// 6) SERVICE PROVIDER'S DASHBOARD - Load services from localStorage
// ==================================================================
const providerServicesContainer = document.getElementById("providerServices");

if (providerServicesContainer) {
  // Get services from localStorage
  let services = JSON.parse(localStorage.getItem("providerServices")) || [];

  // If there are no services, show a message
  if (services.length === 0) {
    providerServicesContainer.innerHTML =
      '<p style="text-align:center; color:#555;">No services added yet. Click "Add New Service" to add your first service.</p>';
  } else {
    // Loop through all services and display them
    services.forEach(function (service) {
      // Create article element for each service
      let article = document.createElement("article");
      article.className = "service card";

      // Create the HTML content
      article.innerHTML =
        '<img src="' + service.photo + '" alt="' + service.name + '">' +
        "<h3>" + service.name + "</h3>" +
        "<p>" + service.description + "</p>" +
        '<p class="price"><strong>' + service.price + " SAR</strong></p>";

      // Append to the container
      providerServicesContainer.appendChild(article);
    });
  }
}

// ==================================================================
// 7) ADD NEW SERVICE - Form validation and localStorage storage
// ==================================================================
const addServiceForm = document.getElementById("addServiceForm");

if (addServiceForm) {
  addServiceForm.addEventListener("submit", function (e) {
    // Stop the default form submission
    e.preventDefault();

    // Get input elements
    const nameInput = document.getElementById("service-name");
    const priceInput = document.getElementById("service-price");
    const descInput = document.getElementById("service-desc");
    const photoInput = document.getElementById("service-photo");

    // Get values
    const serviceName = nameInput.value.trim();
    const servicePrice = priceInput.value.trim();
    const serviceDesc = descInput.value.trim();
    const servicePhoto = photoInput.files[0];

    // Remove old error highlights
    nameInput.classList.remove("input-error");
    priceInput.classList.remove("input-error");
    descInput.classList.remove("input-error");
    photoInput.classList.remove("input-error");

    // ---------- VALIDATION ----------

    // 1) Check for empty fields
    if (serviceName === "") {
      nameInput.classList.add("input-error");
      alert("Service name is empty. Please enter a name.");
      return;
    }

    if (servicePrice === "") {
      priceInput.classList.add("input-error");
      alert("Price is empty. Please enter a price.");
      return;
    }

    if (serviceDesc === "") {
      descInput.classList.add("input-error");
      alert("Description is empty. Please enter a description.");
      return;
    }

    if (!servicePhoto) {
      photoInput.classList.add("input-error");
      alert("Photo is missing. Please upload an image.");
      return;
    }

    // 2) Name cannot start with a number
    if (!isNaN(serviceName.charAt(0))) {
      nameInput.classList.add("input-error");
      alert("Service name cannot start with a number.");
      return;
    }

    // 3) Price should be a valid number and positive
    if (isNaN(servicePrice) || parseFloat(servicePrice) < 0) {
      priceInput.classList.add("input-error");
      alert("Price should be a valid positive number.");
      return;
    }

    // 4) Photo must be an image file
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"];
    if (!allowedTypes.includes(servicePhoto.type)) {
      photoInput.classList.add("input-error");
      alert("Photo must be an image file (jpg, jpeg, png, gif).");
      return;
    }

    // ---------- FORM IS VALID ----------

    // Read the image file and convert to base64 for localStorage
    const reader = new FileReader();

    reader.onload = function (event) {
      const photoData = event.target.result;

      // Create service object
      const newService = {
        name: serviceName,
        price: servicePrice,
        description: serviceDesc,
        photo: photoData
      };

      // Get existing services from localStorage
      let services = JSON.parse(localStorage.getItem("providerServices")) || [];

      // Add the new service to the array
      services.push(newService);

      // Save back to localStorage
      localStorage.setItem("providerServices", JSON.stringify(services));

      // Show success alert with service name
      alert("Service '" + serviceName + "' has been added successfully!");

      // Clear the form
      addServiceForm.reset();
    };

    // Start reading the file
    reader.readAsDataURL(servicePhoto);
  });
}

// ==================================================================
// 8) MANAGE STAFF MEMBERS - Add and Delete functionality
// ==================================================================

// Default staff members array (initial data)
const defaultStaff = [
  {
    name: "Sara Al-Qahtani",
    role: "Pilates Instructor",
    photo: "images/girl1.jpeg"
  },
  {
    name: "Lina Al-Faisal",
    role: "Yoga Instructor",
    photo: "images/girl2.jpeg"
  },
  {
    name: "Mona Al-Harbi",
    role: "Dance Instructor",
    photo: "images/girl3.jpeg"
  },
  {
    name: "Asma Al-Dossary",
    role: "Wellness Coach",
    photo: "images/girl4.jpeg"
  }
];

// Check if we are on the Manage Staff Members page
const deleteStaffForm = document.getElementById("delete-staff-form");
const addStaffForm = document.getElementById("add-staff-form");

if (deleteStaffForm) {
  // Initialize staff in localStorage if not present
  if (!localStorage.getItem("staffMembers")) {
    localStorage.setItem("staffMembers", JSON.stringify(defaultStaff));
  }

  // Function to display all staff members with checkboxes
  function displayStaffMembers() {
    const staffList = document.querySelector(".staff-list");
    let staff = JSON.parse(localStorage.getItem("staffMembers")) || [];

    // Clear current list
    staffList.innerHTML = "";

    // Loop through staff and create rows
    for (let i = 0; i < staff.length; i++) {
      const member = staff[i];

      // Create row div
      const row = document.createElement("div");
      row.className = "staff-row";

      // Create checkbox
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = "staff-select";
      checkbox.value = i;

      // Create photo
      const photo = document.createElement("img");
      photo.src = member.photo;
      photo.alt = member.name;

      // Create name span
      const nameSpan = document.createElement("span");
      nameSpan.textContent = member.name;

      // Create role span
      const roleSpan = document.createElement("span");
      roleSpan.textContent = member.role;

      // Append all to row
      row.appendChild(checkbox);
      row.appendChild(photo);
      row.appendChild(nameSpan);
      row.appendChild(roleSpan);

      // Append row to staff list
      staffList.appendChild(row);
    }
  }

  // Display staff when page loads
  displayStaffMembers();

  // Handle delete form submission
  deleteStaffForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get all checked checkboxes
    const checkboxes = document.querySelectorAll(
      'input[name="staff-select"]:checked'
    );

    // If none selected, show alert (FIXED MESSAGE)
    if (checkboxes.length === 0) {
      alert("Please select one member to delete");
      return;
    }

    // Ask for confirmation
    const confirmDelete = confirm(
      "Are you sure you want to delete " +
        checkboxes.length +
        " selected member(s)?"
    );

    if (confirmDelete) {
      // Get current staff
      let staff = JSON.parse(localStorage.getItem("staffMembers")) || [];

      // Get indexes to delete (in reverse order to avoid index shifting)
      let indexesToDelete = [];
      checkboxes.forEach(function (cb) {
        indexesToDelete.push(parseInt(cb.value));
      });

      // Sort in descending order
      indexesToDelete.sort(function (a, b) {
        return b - a;
      });

      // Remove each selected member
      for (let i = 0; i < indexesToDelete.length; i++) {
        staff.splice(indexesToDelete[i], 1);
      }

      // Save updated array to localStorage
      localStorage.setItem("staffMembers", JSON.stringify(staff));

      // Refresh the display
      displayStaffMembers();

      alert("Selected member(s) have been deleted successfully!");
    }
  });
}

// Handle Add Staff Form
if (addStaffForm) {
  addStaffForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get all input elements
    const photoInput = document.getElementById("staff-photo");
    const nameInput = document.getElementById("staff-name");
    const dobInput = document.getElementById("staff-dob");
    const emailInput = document.getElementById("staff-email");
    const roleInput = document.getElementById("staff-role");
    const skillsInput = document.getElementById("skills");
    const educationInput = document.getElementById("education");

    // Get values
    const staffName = nameInput.value.trim();
    const staffDob = dobInput.value;
    const staffEmail = emailInput.value.trim();
    const staffRole = roleInput.value.trim();
    const staffSkills = skillsInput.value.trim();
    const staffEducation = educationInput.value.trim();
    const staffPhoto = photoInput.files[0];

    // Remove old error classes
    nameInput.classList.remove("input-error");
    dobInput.classList.remove("input-error");
    emailInput.classList.remove("input-error");
    roleInput.classList.remove("input-error");
    skillsInput.classList.remove("input-error");
    educationInput.classList.remove("input-error");
    photoInput.classList.remove("input-error");

    // ---------- VALIDATION ----------

    // 1) Photo is required (FIXED - now required like Add Service)
    if (!staffPhoto) {
      photoInput.classList.add("input-error");
      alert("Photo is missing. Please upload an image.");
      return;
    }

    // Check if photo is an image file
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"];
    if (!allowedTypes.includes(staffPhoto.type)) {
      photoInput.classList.add("input-error");
      alert("Photo must be an image file (jpg, jpeg, png, gif).");
      return;
    }

    // 2) Check for empty fields
    if (staffName === "") {
      nameInput.classList.add("input-error");
      alert("Name field is empty. Please enter the staff member's name.");
      return;
    }

    if (staffDob === "") {
      dobInput.classList.add("input-error");
      alert("Date of Birth is empty. Please select a date.");
      return;
    }

    if (staffEmail === "") {
      emailInput.classList.add("input-error");
      alert("Email field is empty. Please enter an email address.");
      return;
    }

    if (staffRole === "") {
      roleInput.classList.add("input-error");
      alert("Area of Expertise is empty. Please enter the role.");
      return;
    }

    if (staffSkills === "") {
      skillsInput.classList.add("input-error");
      alert("Skills field is empty. Please enter skills.");
      return;
    }

    if (staffEducation === "") {
      educationInput.classList.add("input-error");
      alert("Education field is empty. Please enter education background.");
      return;
    }

    // 3) Name cannot start with a number
    if (!isNaN(staffName.charAt(0))) {
      nameInput.classList.add("input-error");
      alert("Name cannot start with a number.");
      return;
    }

    // 4) Validate email format using pattern matching
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(staffEmail)) {
      emailInput.classList.add("input-error");
      alert("Please enter a valid email address.");
      return;
    }

    // 5) DOB should not be after 2008 (staff must be at least 17)
    const birthYear = new Date(staffDob).getFullYear();
    if (birthYear > 2008) {
      dobInput.classList.add("input-error");
      alert("Staff member must be born in 2008 or earlier.");
      return;
    }

    // ---------- FORM IS VALID ----------

    // Read the photo file
    const reader = new FileReader();
    reader.onload = function (event) {
      const photoData = event.target.result;

      // Create new staff object
      const newStaff = {
        name: staffName,
        role: staffRole,
        photo: photoData,
        dob: staffDob,
        email: staffEmail,
        skills: staffSkills,
        education: staffEducation
      };

      // Get existing staff from localStorage
      let staff = JSON.parse(localStorage.getItem("staffMembers")) || [];

      // Add new staff
      staff.push(newStaff);

      // Save to localStorage
      localStorage.setItem("staffMembers", JSON.stringify(staff));

      // Refresh the staff list display
      displayStaffMembers();

      // Show success message
      alert("Staff member '" + staffName + "' has been added successfully!");

      // Clear the form
      addStaffForm.reset();
    };
    reader.readAsDataURL(staffPhoto);
  });
}

// ==================================================================
// CUSTOMER WAITING LIST - Form functionality (FIXED)
// ==================================================================
window.addEventListener("load", function () {
  // Check if we are on waiting list page
  const waitingListForm = document.querySelector("#waiting-list form");

  if (waitingListForm) {
    waitingListForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get all checkboxes in the table
      const allCheckboxes = waitingListForm.querySelectorAll(
        'tbody input[type="checkbox"]'
      );
      
      // Get checked checkboxes
      let checkedBoxes = [];
      for (let i = 0; i < allCheckboxes.length; i++) {
        if (allCheckboxes[i].checked) {
          checkedBoxes.push(allCheckboxes[i]);
        }
      }

      // If none selected
      if (checkedBoxes.length === 0) {
        alert("Please select at least one customer to confirm.");
        return;
      }

      // Ask for confirmation
      const confirmAction = confirm(
        "Are you sure you want to accept " +
          checkedBoxes.length +
          " selected customer(s)?"
      );

      if (confirmAction) {
        // Get the table body
        const tbody = waitingListForm.querySelector("tbody");

        // Remove the selected rows
        for (let i = 0; i < checkedBoxes.length; i++) {
          const row = checkedBoxes[i].closest("tr");
          tbody.removeChild(row);
        }

        alert(
          checkedBoxes.length + " customer(s) have been accepted and removed from the waiting list!"
        );

        // Check if table is now empty
        const remainingRows = tbody.querySelectorAll("tr");
        if (remainingRows.length === 0) {
          const emptyRow = document.createElement("tr");
          emptyRow.innerHTML =
            '<td colspan="5" style="text-align:center;">No customers in waiting list.</td>';
          tbody.appendChild(emptyRow);
        }
      }
    });
  }
});


//        UNIVERSAL MESSAGE BOX HANDLER           


function showMessageBox({ boxId, message, showButtons = false }) {
  const box = document.getElementById(boxId);
  if (!box) return;

  let html = `<p>${message}</p>`;

  if (showButtons) {
    html += `
      <div class="message-box-buttons">
        <button class="message-box-btn" data-action="stay">Stay on Page</button>
        <button class="message-box-btn" data-action="dashboard">Return to Dashboard</button>
      </div>`;
  }

  box.innerHTML = html;
  box.style.display = "block";

  void box.offsetWidth;
  box.classList.add("visible");

  if (showButtons) {
    box.querySelector('[data-action="stay"]').onclick = () => hideMessage(box);
    box.querySelector('[data-action="dashboard"]').onclick = () => {
      window.location.href = "Customer_Dashboard.html";
    };
  } else {
    setTimeout(() => hideMessage(box), 5000);
  }
}

function hideMessage(box) {
  box.classList.remove("visible");
  setTimeout(() => (box.style.display = "none"), 250);
}
