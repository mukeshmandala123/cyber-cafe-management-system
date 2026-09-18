import { useEffect, useState } from "react";

const API_URL =
  "https://cyber-cafe-management-system-996e.onrender.com/api/terminals";

function Terminals() {
  const [terminals, setTerminals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [terminalNumber, setTerminalNumber] = useState("");
  const [terminalType, setTerminalType] = useState("Browsing");
  const [ratePerHour, setRatePerHour] = useState("");

  const fetchTerminals = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch terminals");
      }

      setTerminals(data);
    } catch (error) {
      console.error("Error fetching terminals:", error);
      alert("Unable to load terminals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTerminals();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!terminalNumber || !ratePerHour) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          terminalNumber: Number(terminalNumber),
          type: terminalType,
          ratePerHour: Number(ratePerHour),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to add terminal");
        return;
      }

      alert("Terminal added successfully!");

      setTerminalNumber("");
      setTerminalType("Browsing");
      setRatePerHour("");

      fetchTerminals();
    } catch (error) {
      console.error("Error adding terminal:", error);
      alert("Server error");
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Terminal Management</h1>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h4 className="mb-3">Add New Terminal</h4>

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-3 mb-3">
                <label className="form-label">
                  Terminal Number
                </label>

                <input
                  type="number"
                  className="form-control"
                  placeholder="Example: 2"
                  value={terminalNumber}
                  onChange={(e) =>
                    setTerminalNumber(e.target.value)
                  }
                />
              </div>

              <div className="col-md-3 mb-3">
                <label className="form-label">
                  Terminal Type
                </label>

                <select
                  className="form-select"
                  value={terminalType}
                  onChange={(e) =>
                    setTerminalType(e.target.value)
                  }
                >
                  <option value="Browsing">Browsing</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Academics">Academics</option>
                </select>
              </div>

              <div className="col-md-3 mb-3">
                <label className="form-label">
                  Rate Per Hour (₹)
                </label>

                <input
                  type="number"
                  className="form-control"
                  placeholder="Example: 50"
                  value={ratePerHour}
                  onChange={(e) =>
                    setRatePerHour(e.target.value)
                  }
                />
              </div>

              <div className="col-md-3 mb-3 d-flex align-items-end">
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                >
                  Add Terminal
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <h4 className="mb-3">All Terminals</h4>

          {loading ? (
            <p>Loading terminals...</p>
          ) : terminals.length === 0 ? (
            <p className="text-muted">
              No terminals added yet.
            </p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Terminal Number</th>
                    <th>Type</th>
                    <th>Rate Per Hour</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {terminals.map((terminal, index) => (
                    <tr key={terminal._id || index}>
                      <td>{index + 1}</td>
                      <td>{terminal.terminalNumber}</td>
                      <td>{terminal.type}</td>
                      <td>₹{terminal.ratePerHour}</td>
                      <td>
                        <span
                          className={`badge ${
                            terminal.status === "Occupied"
                              ? "bg-danger"
                              : "bg-success"
                          }`}
                        >
                          {terminal.status || "Available"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Terminals;
