import { useEffect, useState } from "react";

const API_BASE =
  "https://cyber-cafe-management-system-996e.onrender.com/api";

function Services() {
  const [services, setServices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [usages, setUsages] = useState([]);

  const [customerId, setCustomerId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [pages, setPages] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // FETCH SERVICES
  // =========================
  const fetchServices = async () => {
    try {
      console.log("Fetching services...");

      const response = await fetch(
        `${API_BASE}/services`
      );

      console.log(
        "Services response status:",
        response.status
      );

      const data = await response.json();

      console.log(
        "Services API response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch services"
        );
      }

      if (!Array.isArray(data)) {
        throw new Error(
          "Services API did not return an array"
        );
      }

      setServices(data);
      setError("");
    } catch (error) {
      console.error(
        "Services fetch error:",
        error
      );

      setServices([]);
      setError(error.message);
    }
  };

  // =========================
  // FETCH CUSTOMERS
  // =========================
  const fetchCustomers = async () => {
    try {
      console.log("Fetching customers...");

      const response = await fetch(
        `${API_BASE}/customers`
      );

      const data = await response.json();

      console.log(
        "Customers API response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch customers"
        );
      }

      setCustomers(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "Customers fetch error:",
        error
      );

      setCustomers([]);
    }
  };

  // =========================
  // FETCH USAGE
  // =========================
  const fetchUsages = async () => {
    try {
      const response = await fetch(
        `${API_BASE}/service-usage`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch service usage"
        );
      }

      setUsages(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "Usage fetch error:",
        error
      );

      setUsages([]);
    }
  };

  // =========================
  // FETCH EVERYTHING
  // =========================
  const fetchData = async () => {
    setLoading(true);

    await Promise.all([
      fetchServices(),
      fetchCustomers(),
      fetchUsages(),
    ]);

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // =========================
  // AVAILABLE SERVICES
  // =========================
  const availableServices = services.filter(
    (service) =>
      service.status === "Available"
  );

  // =========================
  // SELECTED SERVICE
  // =========================
  const selectedService = services.find(
    (service) =>
      service._id === serviceId
  );

  // =========================
  // ESTIMATED AMOUNT
  // =========================
  const estimatedAmount =
    selectedService && pages
      ? Number(pages) *
        Number(
          selectedService.ratePerPage || 0
        )
      : 0;

  // =========================
  // TOTAL REVENUE
  // =========================
  const totalRevenue = usages.reduce(
    (total, usage) =>
      total +
      Number(
        usage.totalAmount || 0
      ),
    0
  );

  // =========================
  // RECORD SERVICE USAGE
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customerId) {
      alert(
        "Please select a customer."
      );
      return;
    }

    if (!serviceId) {
      alert(
        "Please select a service."
      );
      return;
    }

    if (
      !pages ||
      Number(pages) <= 0
    ) {
      alert(
        "Please enter a valid number of pages."
      );
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        `${API_BASE}/service-usage`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            customer: customerId,
            service: serviceId,
            pages: Number(pages),
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to record service usage"
        );
      }

      alert(
        `Service usage recorded successfully!\nTotal: ₹${Number(
          data.totalAmount || 0
        ).toFixed(2)}`
      );

      setCustomerId("");
      setServiceId("");
      setPages("");

      await fetchData();
    } catch (error) {
      console.error(
        "Service usage error:",
        error
      );

      alert(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // DELETE USAGE
  // =========================
  const handleDelete = async (id) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this service usage record?"
      );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE}/service-usage/${id}`,
        {
          method: "DELETE",
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete record"
        );
      }

      alert(
        "Service usage record deleted successfully!"
      );

      await fetchData();
    } catch (error) {
      console.error(
        "Delete error:",
        error
      );

      alert(error.message);
    }
  };

  // =========================
  // CUSTOMER NAME
  // =========================
  const getCustomerName = (usage) => {
    if (
      usage.customer &&
      typeof usage.customer ===
        "object"
    ) {
      return (
        usage.customer.name ||
        usage.customer.username ||
        "Unknown Customer"
      );
    }

    const customer =
      customers.find(
        (item) =>
          item._id ===
          usage.customer
      );

    return (
      customer?.name ||
      "Unknown Customer"
    );
  };

  // =========================
  // SERVICE NAME
  // =========================
  const getServiceName = (usage) => {
    if (
      usage.service &&
      typeof usage.service ===
        "object"
    ) {
      return (
        usage.service.name ||
        "Unknown Service"
      );
    }

    const service =
      services.find(
        (item) =>
          item._id ===
          usage.service
      );

    return (
      service?.name ||
      "Unknown Service"
    );
  };

  // =========================
  // DATE
  // =========================
  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(
      date
    ).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" />

        <p className="mt-3">
          Loading services...
        </p>
      </div>
    );
  }

  // =========================
  // PAGE
  // =========================
  return (
    <div className="container-fluid py-4">

      {/* HEADER */}
      <div className="mb-4">
        <h2 className="fw-bold">
          Services & Service Usage
        </h2>

        <p className="text-muted mb-0">
          Manage printing, colour printing
          and Xerox services.
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="alert alert-danger">
          <strong>
            Failed to load services:
          </strong>

          <div>{error}</div>

          <button
            className="btn btn-sm btn-danger mt-2"
            onClick={fetchData}
          >
            Retry
          </button>
        </div>
      )}

      {/* SUMMARY */}
      <div className="row g-4 mb-4">

        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">

              <h6 className="text-muted">
                Available Services
              </h6>

              <h2 className="fw-bold">
                {availableServices.length}
              </h2>

            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">

              <h6 className="text-muted">
                Usage Records
              </h6>

              <h2 className="fw-bold">
                {usages.length}
              </h2>

            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">

              <h6 className="text-muted">
                Service Revenue
              </h6>

              <h2 className="fw-bold">
                ₹{totalRevenue.toFixed(2)}
              </h2>

            </div>
          </div>
        </div>

      </div>

      {/* SERVICES */}
      <div className="card shadow-sm mb-4">

        <div className="card-header">
          <h5 className="mb-0">
            Available Services
          </h5>
        </div>

        <div className="card-body">

          {services.length === 0 ? (

            <div className="alert alert-warning mb-0">
              No services configured.
            </div>

          ) : (

            <div className="row g-3">

              {services.map(
                (service) => (
                  <div
                    className="col-md-4"
                    key={service._id}
                  >
                    <div className="border rounded p-3 h-100">

                      <h5 className="fw-bold">
                        {service.name}
                      </h5>

                      <p className="mb-2 text-muted">
                        Type:{" "}
                        {service.type}
                      </p>

                      <h5>
                        ₹
                        {Number(
                          service.ratePerPage ||
                            0
                        ).toFixed(2)}

                        <small className="text-muted">
                          {" "}
                          / page
                        </small>
                      </h5>

                      <span
                        className={`badge ${
                          service.status ===
                          "Available"
                            ? "bg-success"
                            : "bg-secondary"
                        }`}
                      >
                        {service.status}
                      </span>

                    </div>
                  </div>
                )
              )}

            </div>

          )}

        </div>
      </div>

      {/* RECORD USAGE */}
      <div className="card shadow-sm mb-4">

        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">
            Record Service Usage
          </h5>
        </div>

        <div className="card-body">

          <form onSubmit={handleSubmit}>

            <div className="row g-3">

              {/* CUSTOMER */}
              <div className="col-md-4">

                <label className="form-label fw-semibold">
                  Customer
                </label>

                <select
                  className="form-select"
                  value={customerId}
                  onChange={(e) =>
                    setCustomerId(
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    -- Select Customer --
                  </option>

                  {customers.map(
                    (customer) => (
                      <option
                        key={
                          customer._id
                        }
                        value={
                          customer._id
                        }
                      >
                        {customer.name} -{" "}
                        {customer.phone}
                      </option>
                    )
                  )}
                </select>

              </div>

              {/* SERVICE */}
              <div className="col-md-4">

                <label className="form-label fw-semibold">
                  Service
                </label>

                <select
                  className="form-select"
                  value={serviceId}
                  onChange={(e) =>
                    setServiceId(
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    -- Select Service --
                  </option>

                  {availableServices.map(
                    (service) => (
                      <option
                        key={
                          service._id
                        }
                        value={
                          service._id
                        }
                      >
                        {service.name} - ₹
                        {
                          service.ratePerPage
                        }
                        /page
                      </option>
                    )
                  )}
                </select>

              </div>

              {/* PAGES */}
              <div className="col-md-2">

                <label className="form-label fw-semibold">
                  Pages
                </label>

                <input
                  type="number"
                  min="1"
                  className="form-control"
                  placeholder="Pages"
                  value={pages}
                  onChange={(e) =>
                    setPages(
                      e.target.value
                    )
                  }
                />

              </div>

              {/* AMOUNT */}
              <div className="col-md-2">

                <label className="form-label fw-semibold">
                  Amount
                </label>

                <div className="form-control bg-light">
                  ₹
                  {estimatedAmount.toFixed(
                    2
                  )}
                </div>

              </div>

            </div>

            <div className="mt-3">

              <button
                type="submit"
                className="btn btn-success"
                disabled={submitting}
              >
                {submitting
                  ? "Saving..."
                  : "Record Usage"}
              </button>

            </div>

          </form>

          {customers.length === 0 && (
            <div className="alert alert-warning mt-3 mb-0">
              Add a customer before
              recording service usage.
            </div>
          )}

          {availableServices.length ===
            0 && (
            <div className="alert alert-warning mt-3 mb-0">
              No services are currently
              available.
            </div>
          )}

        </div>
      </div>

      {/* HISTORY */}
      <div className="card shadow-sm">

        <div className="card-header">
          <h5 className="mb-0">
            Service Usage History
          </h5>
        </div>

        <div className="card-body p-0">

          {usages.length === 0 ? (

            <div className="text-center py-5">

              <h5>
                No service usage records
              </h5>

              <p className="text-muted mb-0">
                Record printing or Xerox
                usage above.
              </p>

            </div>

          ) : (

            <div className="table-responsive">

              <table className="table table-hover align-middle mb-0">

                <thead className="table-light">

                  <tr>
                    <th>#</th>
                    <th>Customer</th>
                    <th>Service</th>
                    <th>Pages</th>
                    <th>Rate/Page</th>
                    <th>Total</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>

                </thead>

                <tbody>

                  {usages.map(
                    (
                      usage,
                      index
                    ) => (

                      <tr
                        key={
                          usage._id
                        }
                      >

                        <td>
                          {index + 1}
                        </td>

                        <td className="fw-semibold">
                          {getCustomerName(
                            usage
                          )}
                        </td>

                        <td>
                          {getServiceName(
                            usage
                          )}
                        </td>

                        <td>
                          {usage.pages}
                        </td>

                        <td>
                          ₹
                          {Number(
                            usage.ratePerPage ||
                              0
                          ).toFixed(2)}
                        </td>

                        <td className="fw-semibold">
                          ₹
                          {Number(
                            usage.totalAmount ||
                              0
                          ).toFixed(2)}
                        </td>

                        <td>
                          {formatDate(
                            usage.createdAt
                          )}
                        </td>

                        <td>

                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() =>
                              handleDelete(
                                usage._id
                              )
                            }
                          >
                            Delete
                          </button>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>
      </div>

    </div>
  );
}

export default Services;
