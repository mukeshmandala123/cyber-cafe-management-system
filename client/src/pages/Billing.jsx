import { useEffect, useMemo, useState } from "react";

const API_BASE =
  "https://cyber-cafe-management-system-996e.onrender.com/api";

function Billing() {
  const [customers, setCustomers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [usages, setUsages] = useState([]);

  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [loading, setLoading] = useState(true);
  const [paid, setPaid] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [
        customersResponse,
        sessionsResponse,
        usagesResponse,
      ] = await Promise.all([
        fetch(`${API_BASE}/customers`),
        fetch(`${API_BASE}/sessions`),
        fetch(`${API_BASE}/service-usage`),
      ]);

      if (!customersResponse.ok) {
        throw new Error("Failed to load customers");
      }

      if (!sessionsResponse.ok) {
        throw new Error("Failed to load sessions");
      }

      if (!usagesResponse.ok) {
        throw new Error("Failed to load service usage");
      }

      const customersData = await customersResponse.json();
      const sessionsData = await sessionsResponse.json();
      const usagesData = await usagesResponse.json();

      setCustomers(customersData);
      setSessions(sessionsData);
      setUsages(usagesData);
    } catch (error) {
      console.error("Billing data error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const customer = customers.find(
    (item) => item._id === selectedCustomer
  );

  const customerSessions = useMemo(() => {
    return sessions.filter((session) => {
      const customerId =
        typeof session.customer === "object"
          ? session.customer?._id
          : session.customer;

      return (
        customerId === selectedCustomer &&
        (session.status === "Completed" ||
          session.status === "completed")
      );
    });
  }, [sessions, selectedCustomer]);

  const customerUsages = useMemo(() => {
    return usages.filter((usage) => {
      const customerId =
        typeof usage.customer === "object"
          ? usage.customer?._id
          : usage.customer;

      return customerId === selectedCustomer;
    });
  }, [usages, selectedCustomer]);

  const sessionTotal = customerSessions.reduce(
    (total, session) =>
      total + Number(session.amount || 0),
    0
  );

  const serviceTotal = customerUsages.reduce(
    (total, usage) =>
      total + Number(usage.totalAmount || 0),
    0
  );

  const grandTotal = sessionTotal + serviceTotal;

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const formatDuration = (minutes) => {
    if (!minutes) {
      return "-";
    }

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }

    return `${mins}m`;
  };

  const getTerminalName = (session) => {
    if (
      session.terminal &&
      typeof session.terminal === "object"
    ) {
      return (
        session.terminal.terminalNumber ||
        session.terminal.name ||
        "Terminal"
      );
    }

    return "Terminal";
  };

  const getServiceName = (usage) => {
    if (
      usage.service &&
      typeof usage.service === "object"
    ) {
      return usage.service.name || "Service";
    }

    return "Service";
  };

  const handleCustomerChange = (e) => {
    setSelectedCustomer(e.target.value);
    setPaid(false);
  };

  const handleMarkPaid = () => {
    if (!selectedCustomer) {
      alert("Please select a customer first.");
      return;
    }

    if (grandTotal <= 0) {
      alert("There is no bill amount to pay.");
      return;
    }

    setPaid(true);

    alert(
      `Payment marked as PAID.\nTotal: ₹${grandTotal.toFixed(2)}`
    );
  };

  const handlePrint = () => {
    if (!selectedCustomer) {
      alert("Please select a customer first.");
      return;
    }

    if (grandTotal <= 0) {
      alert("There is no invoice to print.");
      return;
    }

    window.print();
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary"></div>

        <p className="mt-3">
          Loading billing information...
        </p>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">
            Final Billing
          </h2>

          <p className="text-muted mb-0">
            Combine computer session and service charges.
          </p>
        </div>
      </div>

      {/* Customer Selection */}
      <div className="card shadow-sm mb-4 no-print">

        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">
            Select Customer
          </h5>
        </div>

        <div className="card-body">

          <div className="row">

            <div className="col-md-6">

              <label className="form-label fw-semibold">
                Customer
              </label>

              <select
                className="form-select"
                value={selectedCustomer}
                onChange={handleCustomerChange}
              >
                <option value="">
                  -- Select Customer --
                </option>

                {customers.map((item) => (
                  <option
                    key={item._id}
                    value={item._id}
                  >
                    {item.name} - {item.phone}
                  </option>
                ))}
              </select>

            </div>

          </div>

        </div>
      </div>

      {!selectedCustomer ? (
        <div className="card shadow-sm">

          <div className="card-body text-center py-5">

            <h5>
              No Customer Selected
            </h5>

            <p className="text-muted mb-0">
              Select a customer above to generate an invoice.
            </p>

          </div>

        </div>
      ) : (

        <div id="invoice">

          {/* Invoice Header */}
          <div className="card shadow-sm mb-4">

            <div className="card-body">

              <div className="row">

                <div className="col-md-6">

                  <h1 className="fw-bold">
                    CYBER CAFE
                  </h1>

                  <p className="text-muted mb-0">
                    Computer & Internet Services
                  </p>

                </div>

                <div className="col-md-6 text-md-end">

                  <h3 className="fw-bold">
                    FINAL INVOICE
                  </h3>

                  <p className="mb-0">
                    Date: {formatDate(new Date())}
                  </p>

                </div>

              </div>

              <hr />

              {/* Customer */}
              <div className="row">

                <div className="col-md-6">

                  <h6 className="text-muted">
                    BILL TO
                  </h6>

                  <h5 className="fw-bold">
                    {customer?.name || "Customer"}
                  </h5>

                  <p className="mb-0">
                    Phone: {customer?.phone || "-"}
                  </p>

                </div>

                <div className="col-md-6 text-md-end">

                  <h6 className="text-muted">
                    PAYMENT STATUS
                  </h6>

                  {paid ? (
                    <span className="badge bg-success fs-6">
                      PAID
                    </span>
                  ) : (
                    <span className="badge bg-warning text-dark fs-6">
                      UNPAID
                    </span>
                  )}

                </div>

              </div>

            </div>
          </div>

          {/* Computer Sessions */}
          <div className="card shadow-sm mb-4">

            <div className="card-header">
              <h5 className="mb-0">
                Computer Sessions
              </h5>
            </div>

            <div className="card-body p-0">

              {customerSessions.length === 0 ? (

                <div className="text-center py-4">
                  <p className="text-muted mb-0">
                    No completed computer sessions.
                  </p>
                </div>

              ) : (

                <div className="table-responsive">

                  <table className="table table-hover mb-0">

                    <thead className="table-light">

                      <tr>
                        <th>#</th>
                        <th>Terminal</th>
                        <th>Start</th>
                        <th>End</th>
                        <th>Duration</th>
                        <th>Amount</th>
                      </tr>

                    </thead>

                    <tbody>

                      {customerSessions.map(
                        (session, index) => (

                          <tr key={session._id}>

                            <td>
                              {index + 1}
                            </td>

                            <td>
                              {getTerminalName(session)}
                            </td>

                            <td>
                              {formatDate(
                                session.startTime
                              )}
                            </td>

                            <td>
                              {formatDate(
                                session.endTime
                              )}
                            </td>

                            <td>
                              {formatDuration(
                                session.durationMinutes
                              )}
                            </td>

                            <td className="fw-semibold">
                              ₹
                              {Number(
                                session.amount || 0
                              ).toFixed(2)}
                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                    <tfoot>

                      <tr>
                        <th
                          colSpan="5"
                          className="text-end"
                        >
                          Session Total:
                        </th>

                        <th>
                          ₹{sessionTotal.toFixed(2)}
                        </th>
                      </tr>

                    </tfoot>

                  </table>

                </div>

              )}

            </div>
          </div>

          {/* Services */}
          <div className="card shadow-sm mb-4">

            <div className="card-header">
              <h5 className="mb-0">
                Printing & Xerox Services
              </h5>
            </div>

            <div className="card-body p-0">

              {customerUsages.length === 0 ? (

                <div className="text-center py-4">
                  <p className="text-muted mb-0">
                    No printing or Xerox services used.
                  </p>
                </div>

              ) : (

                <div className="table-responsive">

                  <table className="table table-hover mb-0">

                    <thead className="table-light">

                      <tr>
                        <th>#</th>
                        <th>Service</th>
                        <th>Pages</th>
                        <th>Rate / Page</th>
                        <th>Date</th>
                        <th>Total</th>
                      </tr>

                    </thead>

                    <tbody>

                      {customerUsages.map(
                        (usage, index) => (

                          <tr key={usage._id}>

                            <td>
                              {index + 1}
                            </td>

                            <td className="fw-semibold">
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

                            <td>
                              {formatDate(
                                usage.createdAt
                              )}
                            </td>

                            <td className="fw-semibold">
                              ₹
                              {Number(
                                usage.totalAmount || 0
                              ).toFixed(2)}
                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                    <tfoot>

                      <tr>
                        <th
                          colSpan="5"
                          className="text-end"
                        >
                          Service Total:
                        </th>

                        <th>
                          ₹{serviceTotal.toFixed(2)}
                        </th>
                      </tr>

                    </tfoot>

                  </table>

                </div>

              )}

            </div>
          </div>

          {/* Grand Total */}
          <div className="row justify-content-end">

            <div className="col-md-5">

              <div className="card shadow-sm">

                <div className="card-body">

                  <div className="d-flex justify-content-between mb-2">

                    <span>
                      Computer Sessions
                    </span>

                    <span>
                      ₹{sessionTotal.toFixed(2)}
                    </span>

                  </div>

                  <div className="d-flex justify-content-between mb-3">

                    <span>
                      Services
                    </span>

                    <span>
                      ₹{serviceTotal.toFixed(2)}
                    </span>

                  </div>

                  <hr />

                  <div className="d-flex justify-content-between">

                    <h4 className="fw-bold">
                      GRAND TOTAL
                    </h4>

                    <h4 className="fw-bold">
                      ₹{grandTotal.toFixed(2)}
                    </h4>

                  </div>

                  <div className="d-flex gap-2 mt-4 no-print">

                    {!paid && (
                      <button
                        className="btn btn-success flex-fill"
                        onClick={handleMarkPaid}
                      >
                        Mark as Paid
                      </button>
                    )}

                    <button
                      className="btn btn-dark flex-fill"
                      onClick={handlePrint}
                    >
                      Print Invoice
                    </button>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Billing;
