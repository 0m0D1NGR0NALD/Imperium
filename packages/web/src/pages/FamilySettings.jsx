import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import InfoBox from '../components/InfoBox';

const FamilySettings = () => {
  const [family, setFamily] = useState(null);
  const [inviteCode, setInviteCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchFamilyDetails();
  }, []);

  const fetchFamilyDetails = async () => {
    try {
      const res = await api.get('/family/family-details');
      setFamily(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load family details');
    } finally {
      setLoading(false);
    }
  };

  const generateInviteCode = async () => {
    setGenerating(true);
    try {
      const res = await api.post('/family/generate-invite-code');
      setInviteCode(res.data.inviteCode);
      toast.success('New invite code generated');
      fetchFamilyDetails(); // refresh to show updated code
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to generate code');
    } finally {
      setGenerating(false);
    }
  };

  const joinFamily = async () => {
    if (!joinCode.trim()) {
      toast.error('Please enter an invite code');
      return;
    }
    try {
      await api.post('/family/join-family', { code: joinCode });
      toast.success('Joined family! Redirecting...');
      // Reload page or redirect to dashboard after short delay
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to join family');
    }
  };

  const leaveFamily = async () => {
    if (window.confirm('Are you sure you want to leave this family? You will lose access to shared data.')) {
      try {
        await api.post('/family/leave-family');
        toast.success('Left family. Redirecting...');
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.error || 'Failed to leave family');
      }
    }
  };

  if (loading) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h1>Family Settings</h1>
      <div className="two-column">
        <div className="main">
          {family ? (
            <>
              <div className="card">
                <h2>{family.name}</h2>
                <p><strong>Invite Code:</strong> {family.inviteCode || 'Not generated yet'}</p>
                <button onClick={generateInviteCode} disabled={generating}>
                  {generating ? 'Generating...' : 'Generate New Invite Code'}
                </button>
                <button onClick={leaveFamily} style={{ marginLeft: '1rem', backgroundColor: '#dc3545' }}>
                  Leave Family
                </button>
              </div>
              <div className="card">
                <h3>Family Members</h3>
                {family.Users && family.Users.length > 0 ? (
                  <ul>
                    {family.Users.map(user => (
                      <li key={user.id}>
                        {user.firstName} {user.lastName} ({user.email}) – {user.role}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No members found.</p>
                )}
              </div>
            </>
          ) : (
            <div className="card">
              <h2>You are not in a family</h2>
              <p>Join an existing family using an invite code:</p>
              <input
                type="text"
                placeholder="Enter invite code"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
              />
              <button onClick={joinFamily}>Join Family</button>
            </div>
          )}
        </div>
        <div className="sidebar">
          <InfoBox title="Family Economy">
            <p>Invite your spouse or older children to manage finances together. Each member can have view or edit permissions (admin/member).</p>
            <p>The admin can generate invite codes and manage family settings.</p>
            <a href="https://en.wikipedia.org/wiki/Household_economics" target="_blank" rel="noopener noreferrer">Learn about household economics →</a>
          </InfoBox>
        </div>
      </div>
    </div>
  );
};

export default FamilySettings;