
"use strict";

const venueSections = [
  {
    id: "vip",
    name: "VIP",
    price: 100,
    rows: 3,
    seatsPerRow: 10,
    color: "#d6a43a"
  },
  {
    id: "premium",
    name: "Premium",
    price: 70,
    rows: 5,
    seatsPerRow: 12,
    color: "#7059be"
  },
  {
    id: "standard",
    name: "Standard",
    price: 40,
    rows: 8,
    seatsPerRow: 14,
    color: "#3186b8"
  }
];

const seats = [];

venueSections.forEach((section) => {
  for (let row = 1; row <= section.rows; row++) {
    for (
      let number = 1;
      number <= section.seatsPerRow;
      number++
    ) {
      const seatId =
        `${section.id}-${row}-${number}`;

      const unavailable =
        (row + number) % 11 === 0;

      seats.push({
        id: seatId,
        sectionId: section.id,
        sectionName: section.name,
        row: row,
        number: number,
        price: section.price,
        status: unavailable
          ? "unavailable"
          : "available"
      });
    }
  }
});

console.log("Total seats:", seats.length);

function renderVenue() {
  const container =
    document.getElementById("seating-container");

  if (!container) return;

  container.innerHTML = "";

  venueSections.forEach((section) => {
    const sectionElement =
      document.createElement("section");

    sectionElement.className = "venue-zone";

    const heading = document.createElement("h3");
    heading.textContent =
      `${section.name} — $${section.price}`;

    sectionElement.appendChild(heading);

    for (let row = 1; row <= section.rows; row++) {
      const rowElement =
        document.createElement("div");

      rowElement.className = "seat-row";

      const rowSeats = seats.filter(
        (seat) =>
          seat.sectionId === section.id &&
          seat.row === row
      );

      rowSeats.forEach((seat) => {
        const button =
          document.createElement("button");

        button.type = "button";
        button.className =
          `seat ${seat.status}`;

        button.textContent = seat.number;
        button.dataset.seatId = seat.id;

        button.title =
          `${seat.sectionName}, Row ${seat.row}, ` +
          `Seat ${seat.number} — $${seat.price}`;

        button.setAttribute(
          "aria-label",
          `${button.title}, ${seat.status}`
        );

        if (seat.status === "unavailable") {
          button.disabled = true;
        }

        rowElement.appendChild(button);
      });

      sectionElement.appendChild(rowElement);
    }

    container.appendChild(sectionElement);
  });
}

renderVenue();
let selectedSeat = null;

const seatingContainer = document.getElementById("seating-container");
const seatInfo = document.getElementById("seat-info");
const addToCartButton = document.getElementById("add-to-cart");

seatingContainer.addEventListener("click", function (event) {
  const seatButton = event.target.closest(".seat");

  if (!seatButton || seatButton.disabled) {
    return;
  }

  const seatId = seatButton.dataset.seatId;
  const seat = seats.find((item) => item.id === seatId);

  if (!seat || seat.status === "unavailable") {
    return;
  }

  const previousSelection = seatingContainer.querySelector(
    ".seat.inspected"
  );

  if (previousSelection) {
    previousSelection.classList.remove("inspected");
  }

  selectedSeat = seat;
  seatButton.classList.add("inspected");

  seatInfo.textContent =
    `Section: ${seat.sectionName} | ` +
    `Row: ${seat.row} | ` +
    `Seat: ${seat.number} | ` +
    `Price: $${seat.price.toFixed(2)}`;

  addToCartButton.disabled = false;
});
const cart = [];

function renderCart() {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  cartItems.innerHTML = "";

  let total = 0;

  cart.forEach((seat) => {
    const item = document.createElement("li");

    item.textContent =
      `${seat.sectionName} - Row ${seat.row}, ` +
      `Seat ${seat.number} - $${seat.price.toFixed(2)}`;

const removeButton = document.createElement("button");
removeButton.type = "button";
removeButton.textContent = "Remove";
removeButton.className = "remove-ticket";

removeButton.addEventListener("click", function () {
  removeFromCart(seat.id);
});

item.appendChild(document.createTextNode(" "));
item.appendChild(removeButton);

cartItems.appendChild(item);
total += seat.price;

  });

  cartTotal.textContent = total.toFixed(2);
}

addToCartButton.addEventListener("click", function () {
  if (!selectedSeat) {
    return;
  }

  if (
    selectedSeat.status === "unavailable" ||
    selectedSeat.status === "in-cart" ||
    cart.some((item) => item.id === selectedSeat.id)
  ) {
    return;
  }

  cart.push(selectedSeat);
  selectedSeat.status = "in-cart";

  const seatButton = Array.from(
    seatingContainer.querySelectorAll(".seat")
  ).find((button) => button.dataset.seatId === selectedSeat.id);

  if (seatButton) {
    seatButton.classList.remove("available", "inspected");
    seatButton.classList.add("in-cart");
    seatButton.setAttribute(
      "aria-label",
      `${seatButton.title}, in cart`
    );
  }
renderCart();
saveCart();

seatInfo.textContent =
  "Ticket added to your cart! Select another available seat.";

  selectedSeat = null;
  addToCartButton.disabled = true;
});

renderCart();

const CART_STORAGE_KEY = "venue-ticket-cart";

function saveCart() {
  localStorage.setItem(
    CART_STORAGE_KEY,
    JSON.stringify(cart.map((seat) => seat.id))
  );
}

function removeFromCart(seatId) {
  const index = cart.findIndex((seat) => seat.id === seatId);

  if (index === -1) return;

  const seat = cart[index];
  cart.splice(index, 1);
  seat.status = "available";

  if (selectedSeat && selectedSeat.id === seatId) {
    selectedSeat = null;
    seatInfo.textContent = "Click a seat to view its details.";
    addToCartButton.disabled = true;
  }

  renderVenue();
  renderCart();
  saveCart();
}

function restoreCart() {
  let storedIds = [];

  try {
    const saved = JSON.parse(
      localStorage.getItem(CART_STORAGE_KEY) || "[]"
    );

    if (Array.isArray(saved)) {
      storedIds = saved;
    }
  } catch (error) {
    console.warn("Unable to restore saved cart:", error);
  }

  storedIds.forEach((seatId) => {
    const seat = seats.find((item) => item.id === seatId);

    if (
      seat &&
      seat.status === "available" &&
      !cart.some((item) => item.id === seat.id)
    ) {
      seat.status = "in-cart";
      cart.push(seat);
    }
  });

  renderVenue();
  renderCart();
}

restoreCart();
const venueMap = document.getElementById("venue-map");
const venueViewport = document.querySelector(".venue-viewport");

let zoomLevel = 1;
let moveX = 0;
let moveY = 0;

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2;
const ZOOM_STEP = 0.1;
const MOVE_STEP = 60;

function updateMapTransform() {
  venueMap.style.transform =
    `translate(${moveX}px, ${moveY}px) scale(${zoomLevel})`;
}

document.getElementById("zoom-in").addEventListener("click", () => {
  zoomLevel = Math.min(MAX_ZOOM, zoomLevel + ZOOM_STEP);
  updateMapTransform();
});

document.getElementById("zoom-out").addEventListener("click", () => {
  zoomLevel = Math.max(MIN_ZOOM, zoomLevel - ZOOM_STEP);
  updateMapTransform();
});

document.getElementById("move-up").addEventListener("click", () => {
  moveY -= MOVE_STEP;
  updateMapTransform();
});

document.getElementById("move-down").addEventListener("click", () => {
  moveY += MOVE_STEP;
  updateMapTransform();
});

document.getElementById("move-left").addEventListener("click", () => {
  moveX -= MOVE_STEP;
  updateMapTransform();
});

document.getElementById("move-right").addEventListener("click", () => {
  moveX += MOVE_STEP;
  updateMapTransform();
});

document.getElementById("reset-view").addEventListener("click", () => {
  zoomLevel = 1;
  moveX = 0;
  moveY = 0;
  updateMapTransform();
});

updateMapTransform();
function showFullVenue() {
  moveX = 0;
  moveY = 0;
  zoomLevel = 1;
  updateMapTransform();

  const availableWidth = venueViewport.clientWidth - 24;
  const availableHeight = venueViewport.clientHeight - 24;

  const mapWidth = venueMap.scrollWidth;
  const mapHeight = venueMap.scrollHeight;

  if (!mapWidth || !mapHeight) return;

  zoomLevel = Math.min(
    1,
    availableWidth / mapWidth,
    availableHeight / mapHeight
  );

  updateMapTransform();
}

document
  .getElementById("overview-view")
  .addEventListener("click", showFullVenue);
venueViewport.addEventListener("wheel", function (event) {
  event.preventDefault();

  const previousZoom = zoomLevel;

  if (event.deltaY < 0) {
    zoomLevel = Math.min(
      MAX_ZOOM,
      zoomLevel + ZOOM_STEP
    );
  } else if (event.deltaY > 0) {
    zoomLevel = Math.max(
      MIN_ZOOM,
      zoomLevel - ZOOM_STEP
    );
  }

  if (zoomLevel === previousZoom) return;

  updateMapTransform();
}, { passive: false });

let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let dragOriginX = 0;
let dragOriginY = 0;
let didDrag = false;

venueViewport.addEventListener("pointerdown", function (event) {
  if (event.button !== 0) return;

  isDragging = true;
  didDrag = false;

  dragStartX = event.clientX;
  dragStartY = event.clientY;
  dragOriginX = moveX;
  dragOriginY = moveY;
});

window.addEventListener("pointermove", function (event) {
  if (!isDragging) return;

  const deltaX = event.clientX - dragStartX;
  const deltaY = event.clientY - dragStartY;

  if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
    didDrag = true;
    venueViewport.classList.add("dragging");
  }

  if (!didDrag) return;

  moveX = dragOriginX + deltaX;
  moveY = dragOriginY + deltaY;

  updateMapTransform();
});

window.addEventListener("pointerup", function () {
  if (!isDragging) return;

  isDragging = false;
  venueViewport.classList.remove("dragging");
});

window.addEventListener("pointercancel", function () {
  isDragging = false;
  venueViewport.classList.remove("dragging");
});

venueViewport.addEventListener("click", function (event) {
  if (didDrag) {
    event.preventDefault();
    event.stopPropagation();
    didDrag = false;
  }
}, true);
