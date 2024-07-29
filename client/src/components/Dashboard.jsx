import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const baseURI = import.meta.env.VITE_API_BASE_URL;

const AdminDashboard = () => {
  const [clientCount, setClientCount] = useState(0);
  const [vehiculesCount, setVehiculesCount] = useState(0);
  const [vehicules, setVehicules] = useState([]);
  const [newVehicule, setNewVehicule] = useState({
    marque: '',
    modele: '',
    annee: '',
    client_id: ''
  });
  const [editVehicule, setEditVehicule] = useState(null); // Pour stocker le véhicule à modifier
  const [formError, setFormError] = useState('');
  const [editFormError, setEditFormError] = useState('');

  const navigate = useNavigate();

  const fetchClientCount = async () => {
    try {
      const response = await fetch(baseURI + 'api/clients/count', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      console.log('Client count response:', response);
      if (response.ok) {
        const data = await response.json();
        console.log('Client count data:', data);
        setClientCount(data.count);
      } else {
        console.log('Erreur lors de la récupération du nombre de clients');
        navigate('/');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du nombre de clients:', error);
      console.log('Erreur réseau');
      navigate('/');
    }
  };

  const fetchVehiculeCount = async () => {
    try {
      const response = await fetch(baseURI + 'api/vehicule/count', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      console.log('Vehicule count response:', response);
      if (response.ok) {
        const data = await response.json();
        console.log('Vehicule count data:', data);
        setVehiculesCount(data.count);
      } else {
        console.log('Erreur lors de la récupération du nombre de véhicules');
        navigate('/');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du nombre de véhicules:', error);
      console.log('Erreur réseau');
      navigate('/');
    }
  };

  const fetchVehicules = async () => {
    try {
      const response = await fetch(baseURI + 'api/vehicules', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      console.log('Vehicules response:', response);
      if (response.ok) {
        const data = await response.json();
        console.log('Vehicules data:', data);
        setVehicules(data);
      } else {
        console.log('Erreur lors de la récupération des véhicules');
      }
    } catch (error) {
      console.error('Erreur réseau lors de la récupération des véhicules:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVehicule(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!newVehicule.marque || !newVehicule.modele || !newVehicule.annee || !newVehicule.client_id) {
      setFormError('Veuillez remplir tous les champs.');
      return;
    }

    try {
      const response = await fetch(baseURI + 'api/vehicules/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newVehicule)
      });

      if (response.ok) {
        console.log('Véhicule ajouté avec succès.');
        setNewVehicule({ marque: '', modele: '', annee: '', client_id: '' });
        fetchVehicules();
      } else {
        const errorText = await response.text();
        console.error('Erreur lors de l\'ajout du véhicule:', errorText);
        setFormError('Erreur lors de l\'ajout du véhicule');
      }
    } catch (error) {
      console.error('Erreur réseau lors de l\'ajout du véhicule:', error);
      setFormError('Erreur réseau');
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditVehicule(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditFormError('');

    if (!editVehicule.marque || !editVehicule.modele || !editVehicule.annee || !editVehicule.client_id) {
      setEditFormError('Veuillez remplir tous les champs.');
      return;
    }

    try {
      const response = await fetch(baseURI + `api/vehicules/edit/${editVehicule.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(editVehicule)
      });

      if (response.ok) {
        console.log('Véhicule modifié avec succès.');
        setEditVehicule(null); // Réinitialiser le formulaire d'édition
        fetchVehicules(); // Réactualiser la liste des véhicules
      } else {
        const errorText = await response.text();
        console.error('Erreur lors de la modification du véhicule:', errorText);
        setEditFormError('Erreur lors de la modification du véhicule');
      }
    } catch (error) {
      console.error('Erreur réseau lors de la modification du véhicule:', error);
      setEditFormError('Erreur réseau');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) {
      try {
        const response = await fetch(baseURI + `api/vehicules/delete/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });
  
        if (response.ok) {
          console.log('Véhicule supprimé avec succès.');
          fetchVehicules(); // Réactualiser la liste des véhicules
        } else {
          const errorText = await response.text();
          console.error('Erreur lors de la suppression du véhicule:', errorText);
        }
      } catch (error) {
        console.error('Erreur réseau lors de la suppression du véhicule:', error);
      }
    }
  };
  

  const startEdit = (vehicule) => {
    setEditVehicule(vehicule);
  };

  useEffect(() => {
    fetchClientCount();
    fetchVehiculeCount();
    fetchVehicules();
  }, []);

  return (
    <div className="admin-dashboard">
      <h1>Dashboard Admin</h1>
      <p>Nombre de clients: {clientCount}</p>
      <p>Nombre de véhicules: {vehiculesCount}</p>

      <div>
        <h3>Ajouter un véhicule</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Marque:
            <input
              type="text"
              name="marque"
              value={newVehicule.marque}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Modèle:
            <input
              type="text"
              name="modele"
              value={newVehicule.modele}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Année:
            <input
              type="text"
              name="annee"
              value={newVehicule.annee}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Client ID:
            <input
              type="text"
              name="client_id"
              value={newVehicule.client_id}
              onChange={handleInputChange}
            />
          </label>
          <button type="submit">Ajouter</button>
        </form>
        {formError && <p className="form-error">{formError}</p>}
      </div>

      {/* Afficher le formulaire d'édition si un véhicule est sélectionné */}
      {editVehicule && (
        <div>
          <h3>Modifier un véhicule</h3>
          <form onSubmit={handleEditSubmit}>
            <label>
              Marque:
              <input
                type="text"
                name="marque"
                value={editVehicule.marque}
                onChange={handleEditInputChange}
              />
            </label>
            <label>
              Modèle:
              <input
                type="text"
                name="modele"
                value={editVehicule.modele}
                onChange={handleEditInputChange}
              />
            </label>
            <label>
              Année:
              <input
                type="text"
                name="annee"
                value={editVehicule.annee}
                onChange={handleEditInputChange}
              />
            </label>
            <label>
              Client ID:
              <input
                type="text"
                name="client_id"
                value={editVehicule.client_id}
                onChange={handleEditInputChange}
              />
            </label>
            <button type="submit">Modifier</button>
          </form>
          {editFormError && <p className="form-error">{editFormError}</p>}
        </div>
      )}

      <h3>Liste des véhicules</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Marque</th>
            <th>Modèle</th>
            <th>Année</th>
            <th>Client ID</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {vehicules.map((vehicule) => (
            <tr key={vehicule.id}>
              <td>{vehicule.id}</td>
              <td>{vehicule.marque}</td>
              <td>{vehicule.modele}</td>
              <td>{vehicule.annee}</td>
              <td>{vehicule.client_id}</td>
              <td>
                <button onClick={() => startEdit(vehicule)}>Modifier</button>
                <button onClick={() => handleDelete(vehicule.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
