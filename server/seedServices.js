require("dotenv").config({
  path: require("path").join(__dirname, ".env"),
});

const mongoose = require("mongoose");
const Service = require("./models/Service");

const services = [
  {
    name: "Black & White Printing",
    type: "Printing",
    ratePerPage: 2,
    status: "Available",
  },
  {
    name: "Colour Printing",
    type: "Printing",
    ratePerPage: 5,
    status: "Available",
  },
  {
    name: "Xerox",
    type: "Xerox",
    ratePerPage: 2,
    status: "Available",
  },
];

async function seedServices() {
  try {
    console.log("Checking MongoDB configuration...");

    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI is missing from server/.env"
      );
    }

    console.log("MongoDB URI found.");
    console.log("Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully.");

    // Remove old service records
    await Service.deleteMany({});

    console.log("Old services removed.");

    // Add the 3 services
    const createdServices = await Service.insertMany(services);

    console.log(
      `Successfully added ${createdServices.length} services.`
    );

    createdServices.forEach((service) => {
      console.log(
        `- ${service.name} | ${service.type} | ₹${service.ratePerPage}/page | ${service.status}`
      );
    });

    await mongoose.disconnect();

    console.log("MongoDB disconnected.");
    console.log("Service seeding completed successfully.");
  } catch (error) {
    console.error("\nError adding services:");
    console.error(error.message);

    await mongoose.disconnect().catch(() => {});

    process.exit(1);
  }
}

seedServices();
