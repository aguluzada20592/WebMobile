
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

      // Some seats are already unavailable.
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
