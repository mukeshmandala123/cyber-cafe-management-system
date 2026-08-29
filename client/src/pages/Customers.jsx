import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/customers";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const fetchCustomers = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch customers");
      }

      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
      alert("Unable to load customers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.phone.trim()) {
      alert("Name and phone are required.");
      return;
    }

    try {
      const url = editingId
        ? `${API_URL}/${editingId}`
        : API_URL;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Operation failed");
      }

      alert(
        editingId
          ? "Customer updated successfully!"
          : "Customer added successfully!"
      );

      setForm({
        name: "",
        phone: "",
        email: "",
      });

      setEditingId(null);
      fetchCustomers();
    } catch (error) {
      console.error("Error saving customer:", error);
      alert(error.message);
    }
  };

  const handleEdit = (customer) => {
    setEditingId(customer._id);

    setForm({
      name: customer.name || "",
      phone: customer.phone || "",
      email: customer.email || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this customer?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete customer");
      }

      alert("Customer deleted successfully!");

      fetchCustomers();
    } catch (error) {
      console.error("Error deleting customer:", error);
      alert(error.message);
    }
  };

  const handleCancel = () => {
    setEditingId(null);

    setForm({
      name: "",
      phone: "",
      email: "",
    });
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Customer Management</h2>
          <p className="text-muted mb-0">
            Add and manage cyber cafe customers
          </p>
        </div>

        <div className="bg-primary text-white rounded px-4 py-3">
          <div className="small">Total Customers</div>
          <div className="fs-3 fw-bold">{customers.length}</div>
        </div>
      </div>

      {/* Customer Form */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">
            {editingId ? "Edit Customer" : "Add New Customer"}
          </h5>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label fw-semibold">
                  Customer Name
                </label>

                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Enter customer name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-semibold">
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  placeholder="Enter phone number"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-semibold">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter email address"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12">
                <button
                  type="submit"
                  className="btn btn-primary me-2"
                >
                  {editingId ? "Update Customer" : "Add Customer"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Customer List */}
      <div className="card shadow-sm">
        <div className="card-header">
          <h5 className="mb-0">Customer List</h5>
        </div>

        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div
                className="spinner-border text-primary"
                role="status"
              ></div>

              <p className="mt-2 mb-0">Loading customers...</p>
            </div>
          ) : customers.length === 0 ? (
            <div className="text-center py-5">
              <h5>No customers found</h5>
              <p className="text-muted">
                Add your first customer using the form above.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {customers.map((customer, index) => (
                    <tr key={customer._id}>
                      <td>{index + 1}</td>

                      <td className="fw-semibold">
                        {customer.name}
                      </td>

                      <td>{customer.phone}</td>

                      <td>
                        {customer.email || (
                          <span className="text-muted">
                            Not provided
                          </span>
                        )}
                      </td>

                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleEdit(customer)}
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() =>
                            handleDelete(customer._id)
                          }
                        >
                          Delete
                        </button>
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

export default Customers;