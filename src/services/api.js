const API_URL = 'http://localhost:3001/api';

// Helper function for API calls with consistent error handling
const apiRequest = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let error;
    try {
      error = await response.json();
    } catch (e) {
      // If response is not JSON, use status text
      error = { error: response.statusText || 'Something went wrong' };
    }
    throw new Error(error.error || `Request failed with status ${response.status}`);
  }

  // Handle 204 No Content responses gracefully
  if (response.status === 204) {
    return null; 
  }

  return response.json();
};

// Workshops
export const getWorkshops = async () => {
  return apiRequest('/workshops');
};

export const getWorkshop = async (id) => {
  return apiRequest(`/workshops/${id}`);
};

export const createWorkshop = async (workshop) => {
  return apiRequest('/workshops', {
    method: 'POST',
    body: JSON.stringify(workshop),
  });
};

export const updateWorkshop = async (id, workshop) => {
  return apiRequest(`/workshops/${id}`, {
    method: 'PUT',
    body: JSON.stringify(workshop),
  });
};

export const updateWorkshopStatus = async (id, status) => {
  return apiRequest(`/workshops/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
};

export const getWorkshopParticipants = async (id) => {
  return apiRequest(`/workshops/${id}/participants`);
};

export const getWorkshopAttendance = async (id) => {
  return apiRequest(`/workshops/${id}/attendance`);
};

// Participants
export const getParticipants = async () => {
  return apiRequest('/participants');
};

export const getParticipant = async (id) => {
  return apiRequest(`/participants/${id}`);
};

export const createParticipant = async (participant) => {
  return apiRequest('/participants', {
    method: 'POST',
    body: JSON.stringify(participant),
  });
};

export const updateParticipant = async (id, participant) => {
  return apiRequest(`/participants/${id}`, {
    method: 'PUT',
    body: JSON.stringify(participant),
  });
};

export const deleteParticipant = async (id) => {
  return apiRequest(`/participants/${id}`, { method: 'DELETE' });
};

// Attendance
export const getAttendance = async () => {
  return apiRequest('/attendance');
};

export const getAttendanceRecord = async (id) => {
  return apiRequest(`/attendance/${id}`);
};

export const createAttendance = async (attendance) => {
  return apiRequest('/attendance', {
    method: 'POST',
    body: JSON.stringify(attendance),
  });
};

export const updateAttendance = async (id, attendance) => {
  return apiRequest(`/attendance/${id}`, {
    method: 'PUT',
    body: JSON.stringify(attendance),
  });
};

export const deleteAttendance = async (id) => {
  return apiRequest(`/attendance/${id}`, { method: 'DELETE' });
};

// Get participant attendance statistics
export const getParticipantAttendanceStats = async (participantId) => {
  return apiRequest(`/participants/${participantId}/attendance-stats`);
};

export const getParticipantAttendanceHistory = async (participantId) => {
  return apiRequest(`/participants/${participantId}/attendance-history`);
};

// Adicionar participante à oficina
export const addWorkshopParticipant = async (workshopId, participantId) => {
  return apiRequest(`/workshops/${workshopId}/participants`, {
    method: 'POST',
    body: JSON.stringify({ participant_id: participantId }),
  });
};

// Remover participante da oficina
export const removeWorkshopParticipant = async (workshopId, participantId) => {
  return apiRequest(`/workshops/${workshopId}/participants/${participantId}`, {
    method: 'DELETE',
  });
}; 