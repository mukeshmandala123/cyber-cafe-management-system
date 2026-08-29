import { useEffect, useState } from "react";

const API_BASE = "http://localhost:5000/api";

function Services() {
  const [services, setServices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [usages, setUsages] = useState([]);

  const [customerId, setCustomerId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [pages, setPages] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const [
        servicesResponse,
        customersResponse,
        usagesResponse,
      ] = await Promise.all([
        fetch(`${API_BASE}/services`),
        fetch(`${API_BASE}/customers`),
        fetch(`${API_BASE}/service-usage`),
      ]);

      if (!servicesResponse.ok) {
        throw new Error("Failed to load services");
      }

      if (!customersResponse.ok) {
        throw new Error("Failed to load customers");
      }

      if (!usagesResponse.ok) {
        throw new Error("Failed to load service usage");
      }

      const servicesData = await servicesResponse.json();
      const customersData = await customersResponse.json();
      const usagesData = await usagesResponse.json();

      setServices(servicesData);
      setCustomers(customersData);
      setUsages(usagesData);
    } catch (error) {
      console.error("Service data error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const availableServices = services.filter(
    (service) => service.status === "Available"
  );

  const selectedService = services.find(
    (service) => service._id === serviceId
  );

  const estimatedAmount =
    selectedService && pages
      ? Number(pages) * Number(selectedService.ratePerPage)
      : 0;

  const totalRevenue = usages.reduce(
    (total, usage) =>
      total + Number(usage.totalAmount || 0),
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customerId) {
      alert("Please select a customer.");
      return;
    }

    if (!serviceId) {
      alert("Please select a service.");
      return;
    }

    if (!pages || Number(pages) <= 0) {
      alert("Please enter a valid number of pages.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        `${API_BASE}/service-usage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer: customerId,
            service: serviceId,
            pages: Number(pages),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to record service usage"
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
      console.error("Service usage error:", error);
      alert(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete record"
        );
      }

      alert("Service usage record deleted successfully!");

      await fetchData();
    } catch (error) {
      console.error("Delete error:", error);
      alert(error.message);
    }
  };

  const getCustomerName = (usage) => {
    if (
      usage.customer &&
      typeof usage.customer === "object"
    ) {
      return (
        usage.customer.name ||
        usage.customer.username ||
        "Unknown Customer"
      );
    }

    const customer = customers.find(
      (item) => item._id === usage.customer
    );

    return customer?.name || "Unknown Customer";
  };

  const getServiceName = (usage) => {
    if (
      usage.service &&
      typeof usage.service === "object"
    ) {
      return usage.service.name || "Unknown Service";
    }

    const service = services.find(
      (item) => item._id === usage.service
    );

    return service?.name || "Unknown Service";
  };

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary"></div>

        <p className="mt-3">
          Loading services...
        </p>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">

      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-bold">
          Services & Service Usage
        </h2>

        <p className="text-muted mb-0">
          Manage printing, colour printing and Xerox services.
        </p>
      </div>

      {/* Summary Cards */}
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

      {/* Available Services */}
      <div className="card shadow-sm mb-4">

        <div className="card-header">
          <h5 className="mb-0">
            Available Services
          </h5>
        </div>

        <div className="card-body">

          <div className="row g-3">

            {services.map((service) => (
              <div
                className="col-md-4"
                key={service._id}
              >
                <div className="border rounded p-3 h-100">

                  <h5 className="fw-bold">
                    {service.name}
                  </h5>

                  <p className="mb-2 text-muted">
                    Type: {service.type}
                  </p>

                  <h5>
                    ₹{Number(
                      service.ratePerPage
                    ).toFixed(2)}
                    <small className="text-muted">
                      {" "}
                      / page
                    </small>
                  </h5>

                  <span
                    className={`badge ${
                      service.status === "Available"
                        ? "bg-success"
                        : "bg-secondary"
                    }`}
                  >
                    {service.status}
                  </span>

                </div>
              </div>
            ))}

          </div>

          {services.length === 0 && (
            <div className="text-center py-4">
              <p className="text-muted mb-0">
                No services configured.
              </p>
            </div>
          )}

        </div>
      </div>

      {/* Record Service Usage */}
      <div className="card shadow-sm mb-4">

        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">
            Record Service Usage
          </h5>
        </div>

        <div className="card-body">

          <form onSubmit={handleSubmit}>

            <div className="row g-3">

              {/* Customer */}
              <div className="col-md-4">

                <label className="form-label fw-semibold">
                  Customer
                </label>

                <select
                  className="form-select"
                  value={customerId}
                  onChange={(e) =>
                    setCustomerId(e.target.value)
                  }
                >
                  <option value="">
                    -- Select Customer --
                  </option>

                  {customers.map((customer) => (
                    <option
                      key={customer._id}
                      value={customer._id}
                    >
                      {customer.name} - {customer.phone}
                    </option>
                  ))}
                </select>

              </div>

              {/* Service */}
              <div className="col-md-4">

                <label className="form-label fw-semibold">
                  Service
                </label>

                <select
                  className="form-select"
                  value={serviceId}
                  onChange={(e) =>
                    setServiceId(e.target.value)
                  }
                >
                  <option value="">
                    -- Select Service --
                  </option>

                  {availableServices.map((service) => (
                    <option
                      key={service._id}
                      value={service._id}
                    >
                      {service.name} - ₹
                      {service.ratePerPage}/page
                    </option>
                  ))}
                </select>

              </div>

              {/* Pages */}
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
                    setPages(e.target.value)
                  }
                />

              </div>

              {/* Amount */}
              <div className="col-md-2">

                <label className="form-label fw-semibold">
                  Amount
                </label>

                <div className="form-control bg-light">
                  ₹{estimatedAmount.toFixed(2)}
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
              Add a customer before recording service usage.
            </div>
          )}

          {availableServices.length === 0 && (
            <div className="alert alert-warning mt-3 mb-0">
              No services are currently available.
            </div>
          )}

        </div>
      </div>

      {/* Usage History */}
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
                Record printing or Xerox usage above.
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
                    (usage, index) => (

                      <tr key={usage._id}>

                        <td>
                          {index + 1}
                        </td>

                        <td className="fw-semibold">
                          {getCustomerName(usage)}
                        </td>

                        <td>
                          {getServiceName(usage)}
                        </td>

                        <td>
                          {usage.pages}
                        </td>

                        <td>
                          ₹
                          {Number(
                            usage.ratePerPage || 0
                          ).toFixed(2)}
                        </td>

                        <td className="fw-semibold">
                          ₹
                          {Number(
                            usage.totalAmount || 0
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