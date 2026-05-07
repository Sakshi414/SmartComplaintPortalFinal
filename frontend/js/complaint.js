// ================= SOCKET.IO =================

const socket = io("http://localhost:5000");

socket.on("statusUpdate", (data) => {
  console.log("Update:", data);

  alert(data.message);

  const statusElement = document.getElementById(data.complaintId);

  if (statusElement) {
    statusElement.innerText = data.status;

    // 🔥 update only this complaint's timeline
    const card = statusElement.closest("div");
    if (card) {
      updateTimeline(card, data.status);
    }
  }
});


// ================= FORM =================

const form = document.querySelector(".complaint-form");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/complaints/file", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: "Bearer " + token
        }
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Complaint submitted!\nID: ${data.complaintId}`);

        addComplaintToUI(data.complaintId, "Pending");

        form.reset();
      } else {
        alert(data.message || "Failed");
      }

    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  });
}


// ================= TIMELINE =================

function updateTimeline(container, status) {
  const steps = ["Pending", "Verified", "Assigned", "Resolved"];

  const elements = container.querySelectorAll(".step");

  elements.forEach((el, index) => {
    if (index <= steps.indexOf(status)) {
      el.classList.add("active");
    } else {
      el.classList.remove("active");
    }
  });
}


// ================= UI HELPER =================

function addComplaintToUI(id, status) {
  const container = document.getElementById("complaints");

  if (!container) return;

  const div = document.createElement("div");

  div.innerHTML = `
    <p><strong>ID:</strong> ${id}</p>
    <p>Status: <span id="${id}">${status}</span></p>

    <div class="timeline">
      <div class="step active">Pending</div>
      <div class="step">Verified</div>
      <div class="step">Assigned</div>
      <div class="step">Resolved</div>
    </div>
    <hr/>
  `;

  container.prepend(div);
}