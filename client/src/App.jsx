import { useState, useEffect } from 'react';

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [formData, setFormData] = useState({ name: '', region: '', description: '' });

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await fetch(`${API_URL}/teams/`);
      if (!response.ok) {
        throw new Error('Failed to fetch teams');
      }
      const data = await response.json();
      setTeams(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    const method = currentTeam ? 'PUT' : 'POST';
    const url = currentTeam ? `${API_URL}/teams/${currentTeam.id}` : `${API_URL}/teams`;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save team');
      }

      setFormData({ name: '', region: '', description: '' });
      setCurrentTeam(null);
      setShowForm(false);
      fetchTeams(); // Refresh the list
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (teamId) => {
    try {
      const response = await fetch(`${API_URL}/teams/${teamId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete team');
      }
      fetchTeams(); // Refresh the list
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditClick = (team) => {
    setCurrentTeam(team);
    setFormData({
      name: team.name,
      region: team.region,
      description: team.description,
    });
    setShowForm(true);
  };

  const handleAddClick = () => {
    setCurrentTeam(null);
    setFormData({ name: '', region: '', description: '' });
    setShowForm(true);
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-base-200 p-8">
      <div className="card bg-white shadow-xl p-6">
        <h1 className="text-3xl font-bold mb-6">Team Admin Dashboard</h1>
        
        {!showForm && (
          <button 
            onClick={handleAddClick} 
            className="btn btn-primary mb-4"
          >
            Add New Team
          </button>
        )}

        {showForm && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">{currentTeam ? 'Edit Team' : 'Add New Team'}</h2>
            <form onSubmit={handleCreateOrUpdate} className="space-y-4">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Team Name"
                className="input input-bordered w-full"
                required
              />
              <input
                type="text"
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                placeholder="Region"
                className="input input-bordered w-full"
                required
              />
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description"
                className="textarea textarea-bordered w-full"
                rows="3"
              />
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="btn btn-success"
                >
                  Save Team
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <h2 className="text-xl font-semibold mb-4">Current Teams</h2>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Region</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teams.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center">No teams found.</td>
                </tr>
              ) : (
                teams.map((team) => (
                  <tr key={team.id}>
                    <td>{team.name}</td>
                    <td>{team.region}</td>
                    <td className="flex space-x-2">
                      <button
                        onClick={() => handleEditClick(team)}
                        className="btn btn-sm btn-info"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(team.id)}
                        className="btn btn-sm btn-warning"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;