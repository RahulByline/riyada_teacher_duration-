import { useState, useEffect } from 'react';
import { mysqlClient } from '../lib/mysql';

interface TeacherNomination {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  school: string;
  yearsExperience: number;
  qualifications: string[];
  subjects: string[];
  cefrLevel?: string;
  trainingNeeds: string[];
  availability: string;
  nominatedBy: string;
  nominationDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'enrolled' | 'completed';
  notes?: string;
  enrolledPrograms?: string[];
}

export function useTeacherNominations() {
  const [nominations, setNominations] = useState<TeacherNomination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNominations();
  }, []);

  const fetchNominations = async () => {
    try {
      setLoading(true);
      
      const response = await mysqlClient.getTeacherNominations();
      const data = response.nominations || [];

      const formattedNominations: TeacherNomination[] = data.map((nomination: any) => ({
        id: nomination.id,
        firstName: nomination.first_name,
        lastName: nomination.last_name,
        email: nomination.email,
        phone: nomination.phone || '',
        position: nomination.position,
        department: nomination.department || '',
        school: nomination.school,
        yearsExperience: nomination.years_experience,
        qualifications: nomination.qualifications ? JSON.parse(nomination.qualifications) : [],
        subjects: nomination.subjects ? JSON.parse(nomination.subjects) : [],
        cefrLevel: nomination.cefr_level || undefined,
        trainingNeeds: nomination.training_needs ? JSON.parse(nomination.training_needs) : [],
        availability: nomination.availability || '',
        nominatedBy: nomination.nominated_by_name || 'Unknown',
        nominationDate: nomination.nomination_date,
        status: nomination.status,
        notes: nomination.notes || undefined,
        enrolledPrograms: nomination.enrolled_pathways ? nomination.enrolled_pathways.split(',') : []
      }));

      setNominations(formattedNominations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch nominations');
      console.error('Error fetching nominations:', err);
    } finally {
      setLoading(false);
    }
  };

  const createNomination = async (nominationData: Omit<TeacherNomination, 'id' | 'nominatedBy' | 'nominationDate' | 'status' | 'enrolledPrograms'>) => {
    try {
      await mysqlClient.createTeacherNomination({
        first_name: nominationData.firstName,
        last_name: nominationData.lastName,
        email: nominationData.email,
        phone: nominationData.phone,
        position: nominationData.position,
        department: nominationData.department,
        school: nominationData.school,
        years_experience: nominationData.yearsExperience,
        qualifications: nominationData.qualifications,
        subjects: nominationData.subjects,
        cefr_level: nominationData.cefrLevel,
        training_needs: nominationData.trainingNeeds,
        availability: nominationData.availability,
        notes: nominationData.notes
      });
      
      await fetchNominations();
    } catch (err) {
      console.error('Error creating nomination:', err);
      throw err;
    }
  };

  const updateNominationStatus = async (id: string, status: TeacherNomination['status']) => {
    try {
      await mysqlClient.updateTeacherNominationStatus(id, status);
      await fetchNominations();
    } catch (err) {
      console.error('Error updating nomination status:', err);
      throw err;
    }
  };

  const enrollInProgram = async (nominationId: string, pathwayId: string) => {
    try {
      await mysqlClient.enrollTeacherInProgram(nominationId, pathwayId);
    } catch (err) {
      console.error('Error enrolling in program:', err);
      throw err;
    }
  };

  return {
    nominations,
    loading,
    error,
    createNomination,
    updateNominationStatus,
    enrollInProgram,
    refetch: fetchNominations
  };
}