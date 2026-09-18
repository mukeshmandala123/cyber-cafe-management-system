import { useEffect, useState } from "react";

const API_BASE =
  "https://cyber-cafe-management-system-996e.onrender.com/api";

const RATE_PER_HOUR = 20;

function Sessions() {
  const [customers, setCustomers] = useState([]);
  const [terminals, setTerminals] = useState([]);
  const [sessions, setSessions] = useState([]);

  const [customerId, setCustomerId] = useState("");
  const [terminalId, setTerminalId] = useState("");

  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [
        customersResponse,
        terminalsResponse,
        sessionsResponse,
      ] = await Promise.all([
        fetch(`${API_BASE}/customers`),
        fetch(`${API_BASE}/terminals`),
        fetch(`${API_BASE}/sessions`),
      ]);

      if (!customersResponse.ok) {
        throw new Error("Failed to load customers");
      }

      if (!terminalsResponse.ok) {
        throw new Error("Failed to load terminals");
      }

      if (!sessionsResponse.ok) {
        throw new Error("Failed to load sessions");
      }

      const customersData = await customersResponse.json();
      const terminalsData = await terminalsResponse.json();
      const sessionsData = await sessionsResponse.json();

      setCustomers(customersData);
      setTerminals(terminalsData);
      setSessions(sessionsData);
    } catch (error) {
      console.error("Session data error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  const availableTerminals = terminals.filter(
    (terminal) =>
      terminal.status === "Available" ||
      terminal.status === "available" ||
      terminal.isAvailable === true
  );

  const activeSessions = sessions.filter(
    (session) =>
      session.status === "Active" ||
      session.status === "active"
  );

  const completedSessions = sessions.filter(
    (session) =>
      session.status === "Completed" ||
      session.status === "completed"
  );

  const totalRevenue = completedSessions.reduce(
    (total, session) =>
      total + Number(session.amount || 0),
    0
  );

  const handleStartSession = async (e) => {
    e.preventDefault();

    if (!customerId) {
      alert("Please select a customer.");
      return;
    }

    if (!terminalId) {
      alert("Please select a terminal.");
      return;
    }

    setStarting(true);

    try {
      const response = await fetch(`${API_BASE}/sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: customerId,
          terminal: terminalId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to start session"
        );
      }

      alert("Session started successfully!");

      setCustomerId("");
      setTerminalId("");

      await fetchData();
    } catch (error) {
      console.error("Start session error:", error);
      alert(error.message);
    } finally {
      setStarting(false);
    }
  };

  const handleStopSession = async (sessionId) => {
    const confirmStop = window.confirm(
      "Are you sure you want to stop this session?"
    );

    if (!confirmStop) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE}/sessions/${sessionId}/stop`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to stop session"
        );
      }

      alert(
        `Session completed!\nBill Amount: ₹${Number(
          data.amount || 0
        ).toFixed(2)}`
      );

      await fetchData();
    } catch (error) {
      console.error("Stop session error:", error);
      alert(error.message);
    }
  };

  const getCustomerName = (session) => {
    if (
      session.customer &&
      typeof session.customer === "object"
    ) {
      return (
        session.customer.name ||
        session.customer.username ||
        "Unknown Customer"
      );
    }

    const customer = customers.find(
      (item) => item._id === session.customer
    );

    return customer?.name || "Unknown Customer";
  };

  const getTerminalName = (session) => {
    if (
      session.terminal &&
      typeof session.terminal === "object"
    ) {
      return (
        session.terminal.terminalNumber ||
        session.terminal.name ||
        "Unknown Terminal"
      );
    }

    const terminal = terminals.find(
      (item) => item._id === session.terminal
    );

    return (
      terminal?.terminalNumber ||
      terminal?.name ||
      "Unknown Terminal"
    );
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

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary"></div>

        <p className="mt-3">
          Loading session data...
        </p>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">

      <div className="mb-4">
        <h2 className="fw-bold">
          Session Management
        </h2>

        <p className="text-muted mb-0">
          Start, manage and bill customer terminal sessions.
        </p>
      </div>

      <div className="row g-4 mb-4">

        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted">
                Available Terminals
              </h6>

              <h2 className="fw-bold">
                {availableTerminals.length}
              </h2>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted">
                Active Sessions
              </h6>

              <h2 className="fw-bold">
                {activeSessions.length}
              </h2>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted">
                Completed Sessions
              </h6>

              <h2 className="fw-bold">
                {completedSessions.length}
              </h2>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted">
                Total Revenue
              </h6>

              <h2 className="fw-bold">
                ₹{totalRevenue.toFixed(2)}
              </h2>
            </div>
          </div>
        </div>

      </div>

      <div className="card shadow-sm mb-4">

        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">
            Start New Session
          </h5>
        </div>

        <div className="card-body">

          <form onSubmit={handleStartSession}>

            <div className="row g-3">

              <div className="col-md-5">

                <label className="form-label fw-semibold">
                  Select Customer
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

              <div className="col-md-5">

                <label className="form-label fw-semibold">
                  Select Available Terminal
                </label>

                <select
                  className="form-select"
                  value={terminalId}
                  onChange={(e) =>
                    setTerminalId(e.target.value)
                  }
                >
                  <option value="">
                    -- Select Terminal --
                  </option>

                  {availableTerminals.map((terminal) => (
                    <option
                      key={terminal._id}
                      value={terminal._id}
                    >
                      {terminal.terminalNumber ||
                        terminal.name ||
                        "Terminal"}
                    </option>
                  ))}
                </select>

              </div>

              <div className="col-md-2 d-flex align-items-end">

                <button
                  type="submit"
                  className="btn btn-success w-100"
                  disabled={starting}
                >
                  {starting
                    ? "Starting..."
                    : "Start Session"}
                </button>

              </div>

            </div>

            <div className="mt-3">
              <small className="text-muted">
                Current browsing rate: ₹{RATE_PER_HOUR}/hour
              </small>
            </div>

            {customers.length === 0 && (
              <div className="alert alert-warning mt-3 mb-0">
                No customers available. Please add a
                customer first.
              </div>
            )}

            {availableTerminals.length === 0 && (
              <div className="alert alert-warning mt-3 mb-0">
                No terminals are currently available.
              </div>
            )}

          </form>

        </div>
      </div>

      <div className="card shadow-sm mb-4">

        <div className="card-header">
          <h5 className="mb-0">
            Active Sessions
          </h5>
        </div>

        <div className="card-body p-0">

          {activeSessions.length === 0 ? (
            <div className="text-center py-5">
              <h5>No active sessions</h5>

              <p className="text-muted mb-0">
                Start a session using the form above.
              </p>
            </div>
          ) : (

            <div className="table-responsive">

              <table className="table table-hover align-middle mb-0">

                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Customer</th>
                    <th>Terminal</th>
                    <th>Start Time</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {activeSessions.map(
                    (session, index) => (
                      <tr key={session._id}>

                        <td>{index + 1}</td>

                        <td className="fw-semibold">
                          {getCustomerName(session)}
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
                          <span className="badge bg-success">
                            ACTIVE
                          </span>
                        </td>

                        <td>

                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() =>
                              handleStopSession(
                                session._id
                              )
                            }
                          >
                            Stop Session
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

      <div className="card shadow-sm">

        <div className="card-header">
          <h5 className="mb-0">
            Session History
          </h5>
        </div>

        <div className="card-body p-0">

          {sessions.length === 0 ? (
            <div className="text-center py-5">

              <p className="text-muted mb-0">
                No session history available.
              </p>

            </div>
          ) : (

            <div className="table-responsive">

              <table className="table table-hover align-middle mb-0">

                <thead className="table-light">

                  <tr>
                    <th>#</th>
                    <th>Customer</th>
                    <th>Terminal</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Duration</th>
                    <th>Status</th>
                    <th>Amount</th>
                  </tr>

                </thead>

                <tbody>

                  {sessions.map(
                    (session, index) => {

                      const isActive =
                        session.status === "Active" ||
                        session.status === "active";

                      return (
                        <tr key={session._id}>

                          <td>{index + 1}</td>

                          <td>
                            {getCustomerName(session)}
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

                          <td>
                            {isActive ? (
                              <span className="badge bg-success">
                                ACTIVE
                              </span>
                            ) : (
                              <span className="badge bg-secondary">
                                COMPLETED
                              </span>
                            )}
                          </td>

                          <td className="fw-semibold">
                            ₹
                            {Number(
                              session.amount || 0
                            ).toFixed(2)}
                          </td>

                        </tr>
                      );
                    }
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

export default Sessions;
