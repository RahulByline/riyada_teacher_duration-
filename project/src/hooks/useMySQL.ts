import { useState, useEffect } from 'react';
import { mysqlClient } from '../lib/mysql';

// Simple hook for pathways
export function usePathways() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPathways();
  }, []);

  const fetchPathways = async () => {
    try {
      setLoading(true);
      const result = await mysqlClient.getPathways();
      setData(result.pathways || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    refetch: fetchPathways
  };
}

// Simple hook for participants
export function useParticipants(pathwayId?: string) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchParticipants();
  }, [pathwayId]);

  const fetchParticipants = async () => {
    try {
      setLoading(true);
      let result;
      if (pathwayId) {
        result = await mysqlClient.getParticipantsByPathway(pathwayId);
      } else {
        result = await mysqlClient.getParticipants();
      }
      setData(result.participants || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    refetch: fetchParticipants
  };
}

// Simple hook for learning events
export function useLearningEvents(pathwayId?: string) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, [pathwayId]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      let result;
      if (pathwayId) {
        result = await mysqlClient.getLearningEventsByPathway(pathwayId);
      } else {
        result = await mysqlClient.getLearningEvents();
      }
      setData(result.learning_events || result.events || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    refetch: fetchEvents
  };
}

// Simple hook for certificates
export function useCertificates() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const result = await mysqlClient.getCertificates();
      setData(result.certificates || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    refetch: fetchCertificates
  };
}

// Simple hook for feedback responses
export function useFeedbackResponses(eventId?: string) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeedback();
  }, [eventId]);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const result = await mysqlClient.getFeedback();
      let feedback = result.feedback || result.feedback_responses || [];
      
      // Filter by event if specified
      if (eventId) {
        feedback = feedback.filter((f: any) => f.event_id === eventId);
      }
      
      setData(feedback);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    refetch: fetchFeedback
  };
}
